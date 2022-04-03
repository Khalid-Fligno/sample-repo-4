import React, { useEffect, useState, useCallback } from 'react';
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
import authScreenStyle from './authScreenStyle';
import { db, auth } from "../../config/firebase";
import * as Sentry from "@sentry/react-native";
import appsFlyer from "react-native-appsflyer";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase";
import NativeLoader from "../../components/Shared/NativeLoader";
import { hasChallenges } from "../../utils/challenges";
import { RestoreSubscriptions } from '../../utils/subscription';
import { restoreAndroidPurchases } from '../../config/android';
import { compare, compareInApp } from '../../config/apple';
import Toast from 'react-native-toast-message';

const LoginScreen = ({ navigation }) => {

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const specialOffer = navigation.getParam("specialOffer", undefined)
	const { InAppUtils } = NativeModules;

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
						specialOffer: specialOffer,
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
				setLoading(false)
				await iOSStorePurchases(onboarded);
			} else if (Platform.OS === "android") {
				setLoading(false)
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
						setLoading(false)
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
						setLoading(false)
						await goToAppScreen(userDocs);
					} else {
						// EXPIRED
						setLoading(false)
						await storePurchase(subscriptionInfo, onboarded);
					}
				} else {
					//go to app
					setLoading(false)
					await goToAppScreen(userDocs);
				}
			} else {
				setLoading(false)
				await goToAppScreen(userDocs);
			}
		} catch (error) {
			if (error.code === 'auth/wrong-password') {
				setLoading(false)
				Toast.show({
					type: 'error',
					text1: 'Unsuccessful Login',
					text2: 'Password is invalid.',
				});
			}

			if (error.code === 'auth/user-not-found') {
				setLoading(false)
				Toast.show({
					type: 'error',
					text1: 'Unsuccessful Login',
					text2: 'That email address is invalid.',
				});
			}

			if (error.code === 'auth/invalid-email') {
				setLoading(false)
				Toast.show({
					type: 'error',
					text1: 'Unsuccessful Login',
					text2: 'That email address is invalid.',
				});
			}
		}
	};

	useEffect(() => {
		let isMounted = true

		if (isMounted) {
			getUser(email)
		}

		return () => {
			isMounted = false;
		}
	}, [])

	return (
		<SafeAreaView style={authScreenStyle.safeAreaContainer}>
			<View style={authScreenStyle.container}>
				<View>
					<View style={authScreenStyle.crossIconContainer}>
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
					<View style={authScreenStyle.formContainer}>
						<View style={authScreenStyle.formHeaderContainer}>
							<Text style={styles.Text}>
								Sign In
							</Text>
						</View>
						<View style={authScreenStyle.formInputContainer}>
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
				<View style={authScreenStyle.navigateButtonContainer}>
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
			<Toast/>
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

export default LoginScreen;
