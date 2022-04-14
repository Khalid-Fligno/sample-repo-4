import React, { useState } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	TouchableOpacity,
	TextInput,
	Keyboard,
	NativeModules,
	Alert,
} from 'react-native';
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";
import HeaderAuth from '../../components/Auth/Header';
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
import { loginStyles } from '../../styles/auth/loginStyle';
import { getUser } from '../../hook/firestore/read';
import { COLLECTION_NAMES } from '../../library/collections';
import { addDocument } from '../../hook/firestore/write';
import { FIELD_NAME } from '../../library/fieldName';

export const LoginScreen = ({ navigation }) => {

	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const specialOffer = navigation.getParam("specialOffer", undefined)
	const { InAppUtils } = NativeModules;

	const goToAppScreen = async (userDocs) => {
		const data = {
			subscriptionInfo: {
				blogsId: "lifestyleBlogs"
			}
		}

		// RECEIPT STILL VALID
		setLoading(false)
		if (!userDocs.onboarded) {
			navigation.navigate("Onboarding1");
			return;
		}

		await addDocument(
			COLLECTION_NAMES.USERS,
			userDocs.id,
			data
		)
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
			const userDocs = await getUser(
				COLLECTION_NAMES.USERS,
				FIELD_NAME.EMAIL,
				email,
			)

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

	return (
		<SafeAreaView style={loginStyles.safeAreaContainer}>
			<View style={loginStyles.container}>
				<View>
					<View style={loginStyles.crossIconContainer}>
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
					<View style={loginStyles.formContainer}>
						<View style={loginStyles.formHeaderContainer}>
							<Text style={loginStyles.Text}>
								Sign In
							</Text>
						</View>
						<View style={loginStyles.formInputContainer}>
							<TextInput
								style={loginStyles.Input}
								placeholder="Email"
								keyboardType="email-address"
								onChangeText={setEmail}
								value={email}
								autoCapitalize='none'
							/>
							<TextInput
								style={loginStyles.Input}
								placeholder="Password"
								secureTextEntry
								returnKeyType="go"
								onChangeText={setPassword}
								value={password}
								autoCapitalize='none'
							/>
						</View>
						<TouchableOpacity onPress={() => navigation.navigate('ForgottenPassword')}>
							<Text style={loginStyles.forgotPasswordText}>
								Forgotten your password?
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={loginStyles.navigateButtonContainer}>
					<CustomBtn
						customBtnStyle={{ marginTop: 20, width: wp("90%") }}
						Title="SIGN IN"
						onPress={() => login(email, password)}
					/>
					<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
						<Text
							style={loginStyles.navigateToText}
						>
							Don't have an account? Sign up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Toast />
			{loading && <NativeLoader />}
		</SafeAreaView>
	)
}