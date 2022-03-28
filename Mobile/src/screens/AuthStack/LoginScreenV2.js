import React, { useEffect, useState } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Dimensions,
	Keyboard,
	NativeModules,
	Alert,
} from 'react-native';
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";
import fonts from "../../styles/fonts";
import { containerPadding } from '../../styles/globalStyles';
import HeaderAuth from '../../components/Auth/Header';
import authScreenStyleV2 from './authScreenStyleV2';
import { db, auth } from "../../../config/firebase";
import * as Sentry from "@sentry/react-native";
import appsFlyer from "react-native-appsflyer";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase";
import NativeLoader from "../../components/Shared/NativeLoader";
import { hasChallenges } from "../../utils/challenges";
import { RestoreSubscriptions } from '../../utils/subscription';
import { restoreAndroidPurchases } from '../../../config/android';
import { compare, compareInApp } from '../../../config/apple';
import * as AppleAuthentication from "expo-apple-authentication";

const LoginScreenV2 = ({ navigation }) => {

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [specialOffer, setSpecialOffer] = useState(null)
	const [appleSignInAvailable, setAppleSignInAvailable] = useState(null)
	const [message, setMessage] = useState('')
	const [authResponse, setAuthResponse] = useState(false)

	const { InAppUtils } = NativeModules;

	useEffect(() => {
		getUser()
	}, [])

	const getUser = async (email) => {
		const userRef = await db
			.collection("users")
			.where("email", "==", email)
			.get();

		if (userRef.size > 0) {
			return userRef.docs[0].data();
		} else {
			return undefined;
		}
	}

	const goToAppScreen = async (userDocs) => {
		// RECEIPT STILL VALID
		setLoading(false)
		if (!userDocs.onboarded) {
			navigation.navigate("Onboarding1");
			return;
		}
		navigation.navigate("App");
	};

	const iOSStorePurchases = async (onboarded) => {
		InAppUtils.restorePurchases(async (error, response) => {
			if (error) {
				setLoading(false)
				Alert.alert("iTunes Error", "Could not connect to iTunes store.");
			} else {
				if (response.length === 0) {
					navigation.navigate("Subscription", {
						specialOffer: specialOffer,
					});
					return;
				}
				const sortedPurchases = response.slice().sort(compare);
				try {
					const validationData = await this.validate(
						sortedPurchases[0].transactionReceipt
					);
					if (validationData === undefined) {
						Alert.alert("Receipt validation error");
						return;
					}
					const sortedInApp = validationData.receipt.in_app
						.slice()
						.sort(compareInApp);
					if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
						const uid = await AsyncStorage.getItem('uid');
						const userRef = db.collection("users").doc(uid);
						const data = {
							subscriptionInfo: {
								receipt: sortedPurchases[0].transactionReceipt,
								expiry: validationData.latest_receipt_info.expires_date,
							},
						};
						await userRef.set(data, { merge: true });
						setLoading(false)
						if (onboarded) {
							navigation.navigate("Onboarding1");
							return;
						}
						navigation.navigate("App");
					} else if (
						sortedInApp[0] &&
						sortedInApp[0].expires_date_ms < Date.now()
					) {
						Alert.alert("Expired", "Your most recent subscription has expired");
						navigation.navigate("Subscription");
					} else {
						Alert.alert("Something went wrong");
						navigation.navigate("Subscription", {
							specialOffer: specialOffer,
						});
						return;
					}
				} catch (err) {
					Alert.alert("Error", "Could not retrieve subscription information");
					navigation.navigate("Subscription", {
						specialOffer: this.state.specialOffer,
					});
				}
			}
		});
	};

	const storePurchase = async (subscriptionInfo, onboarded) => {
		const restoreSubscriptions = new RestoreSubscriptions(props);
		if (!subscriptionInfo.platform) {
			subscriptionInfo.platform = "ios";
		}
		try {
			await restoreSubscriptions.restore(subscriptionInfo, onboarded);
		} catch (ex) {
			if (Platform.OS === "ios") {
				await iOSStorePurchases(onboarded);
			} else if (Platform.OS === "android") {
				await restoreAndroidPurchases(props);
			}
		}
	};

	const login = async (email, password) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		Keyboard.dismiss();
		setLoading(true)

		try {
			await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
			const authResponse = await auth.signInWithEmailAndPassword(
				email,
				password
			);

			if (authResponse) {
				setAuthResponse(true)
			}
			const { uid } = authResponse.user;
			await AsyncStorage.setItem("uid", uid);
			appsFlyer.trackEvent("af_login");
			const userDocs = await getUser(email)

			if (userDocs) {
				const {
					email,
					fitnessLevel,
					subscriptionInfo,
					onboarded
				} = userDocs
				await AsyncStorage.setItem("fitnessLevel", fitnessLevel.toString());
				Sentry.setUser({ email: email });

				// hasChallenges is true -> khalid.sanggoyod@fligno.com
				if (!subscriptionInfo) {
					if (await hasChallenges(uid)) {
						await goToAppScreen(userDocs)
					} else {
						// NO PURCHASE INFORMATION SAVED
						setLoading(false)
						navigation.navigate("Subscription", {
							specialOffer: specialOffer,
						});
					}
				} else if (subscriptionInfo.expiry < Date.now()) {
					if (await hasChallenges(uid)) {
						await goToAppScreen(userDocs);
					} else {
						// EXPIRED
						await storePurchase(subscriptionInfo, onboarded);
					}
				} else {
					//go to app
					await goToAppScreen(userDocs);
				}

				console.log('email: ', email)
				console.log('fitnessLevel: ', fitnessLevel)
				console.log('subscriptionInfo: ', subscriptionInfo)
				console.log('onboarded: ', onboarded)

				setLoading(false)
			}

			// snapshot.forEach((doc) => {
			// 	if (doc.id === uid) {
			// 		db.collection("users")
			// 			.doc(uid)
			// 			.get()
			// 			.then(async (doc) => {
			// 				Sentry.setUser({ email: doc.data().email });
			// 				if (doc.data().fitnessLevel !== undefined) {
			// 					await AsyncStorage.setItem(
			// 						"fitnessLevel",
			// 						doc.data().fitnessLevel.toString()
			// 					);
			// 				}
			// 				const { subscriptionInfo = undefined, onboarded = false } =
			// 					doc.data();
			// 				if (subscriptionInfo === undefined) {
			// 					if (await hasChallenges(uid)) {
			// 						await this.goToAppScreen(doc);
			// 					} else {
			// 						// NO PURCHASE INFORMATION SAVED
			// 						this.setState({ loading: false });
			// 						this.props.navigation.navigate("Subscription", {
			// 							specialOffer: specialOffer,
			// 						});
			// 					}
			// 				} else if (subscriptionInfo.expiry < Date.now()) {
			// 					if (await hasChallenges(uid)) {
			// 						await this.goToAppScreen(doc);
			// 					} else {
			// 						// EXPIRED
			// 						await this.storePurchase(subscriptionInfo, onboarded);
			// 					}
			// 				} else {
			// 					//go to app
			// 					await this.goToAppScreen(doc);
			// 				}
			// 			});
			// 	} else {
			// 		db.collection("users").doc(uid).set(doc.data());
			// 		db.collection("users").doc(uid).update({
			// 			id: uid,
			// 		});
			// 		var query = db.collection("users").where("id", "==", uid);
			// 		query.get().then((querySnapshot) => {
			// 			querySnapshot.forEach((document) => {
			// 				document.ref
			// 					.collection("challenges")
			// 					.get()
			// 					.then((querySnapshot) => {
			// 						querySnapshot.forEach((doc) => {
			// 							if (doc.data()) {
			// 								db.collection("users")
			// 									.doc(uid)
			// 									.collection("challenges")
			// 									.doc(doc.id)
			// 									.set(doc.data());
			// 							}
			// 						});
			// 					});
			// 			});
			// 		});
			// 		db.collection("users")
			// 			.doc(uid)
			// 			.get()
			// 			.then(async (doc) => {
			// 				if (doc.data().fitnessLevel !== undefined) {
			// 					await AsyncStorage.setItem(
			// 						"fitnessLevel",
			// 						await doc.data().fitnessLevel.toString()
			// 					);
			// 				}
			// 				const { subscriptionInfo = undefined, onboarded = false } =
			// 					doc.data();
			// 				if (subscriptionInfo === undefined) {
			// 					if (await hasChallenges(uid)) {
			// 						await this.goToAppScreen(doc);
			// 					} else {
			// 						// NO PURCHASE INFORMATION SAVED
			// 						this.setState({ loading: false });
			// 						this.props.navigation.navigate("Subscription", {
			// 							specialOffer: this.state.specialOffer,
			// 						});
			// 					}
			// 				} else if (subscriptionInfo.expiry < Date.now()) {
			// 					if (await hasChallenges(uid)) {
			// 						await this.goToAppScreen(doc);
			// 					} else {
			// 						// EXPIRED
			// 						await this.storePurchase(subscriptionInfo, onboarded);
			// 					}
			// 				} else {
			// 					//go to app
			// 					await this.goToAppScreen(doc);
			// 				}
			// 			});
			// 	}
			// });
		} catch (error) {
			if (error.code === 'auth/wrong-password') {
				console.log('Wrong Password')
			}

			if (error.code === 'auth/user-not-found') {
				console.log('User not found')
			}
		}
	};

	return (
		<SafeAreaView style={authScreenStyleV2.safeAreaContainer}>
			<View style={authScreenStyleV2.container}>
				<View>
					<View style={authScreenStyleV2.crossIconContainer}>
						<TouchableOpacity
							onPress={() => navigation.goBack()}
						>
							<Icon
								name="cross"
								color={colors.themeColor.color}
								size={22}
							/>
						</TouchableOpacity>
					</View>
					<HeaderAuth />
					<View style={authScreenStyleV2.formContainer}>
						<View style={authScreenStyleV2.formHeaderContainer}>
							<Text style={styles.Text}>
								Sign In
							</Text>
						</View>
						<View style={authScreenStyleV2.formInputContainer}>
							<TextInput
								style={styles.Input}
								placeholder="Email Address"
								keyboardType="email-address"
								onChangeText={setEmail}
								value={email}
							/>
							<TextInput
								style={styles.Input}
								placeholder="Password"
								secureTextEntry
								returnKeyType="go"
								onChangeText={setPassword}
								value={password}
							/>
						</View>
						<TouchableOpacity onPress={() => navigation.navigate('ForgottenPassword')}>
							<Text style={styles.forgotPasswordText}>
								Forgotten your password?
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={authScreenStyleV2.navigateButtonContainer}>
					<CustomBtn
						customBtnStyle={{ marginTop: 20, width: wp("90%") }}
						Title="SIGN IN"
						onPress={() => login(email, password)}
					/>
					<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
						<Text
							style={styles.navigateToText}
						>
							Don't have an account? Sign up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			{loading && <NativeLoader />}
		</SafeAreaView>
	)
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
	Text: {
		fontSize: hp('3%'),
		fontFamily: fonts.bold,
	},
	Input: {
		height: hp("6%"),
		width: width - containerPadding * 2,
		padding: 8,
		margin: 5,
		borderWidth: 1,
		fontSize: hp('2%'),
		alignItems: "center",
		fontFamily: fonts.SimplonMonoMedium
	},
	forgotPasswordText: {
		fontFamily: fonts.bold,
		fontSize: 16,
		paddingTop: 20
	},
	navigateToText: {
		fontFamily: fonts.bold,
		letterSpacing: 0.5,
		fontSize: 16,
		marginTop: width / 10,
		textAlign: "center",
		color: colors.black,
	}
})

export default LoginScreenV2;
