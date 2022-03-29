import React, { useState } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Dimensions,
	Keyboard,
	Alert,
} from 'react-native';
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";
import authScreenStyleV2 from './authScreenStyleV2';
import fonts from "../../styles/fonts";
import { containerPadding } from '../../styles/globalStyles';
import HeaderAuth from '../../components/Auth/Header';
import * as Haptics from "expo-haptics";
import { db, auth } from "../../../config/firebase";
import Toast from 'react-native-toast-message';
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-community/async-storage";
import appsFlyer from 'react-native-appsflyer';
import { updateUserSubscription } from '../../utils/challenges';
import NativeLoader from "../../components/Shared/NativeLoader";

const { width } = Dimensions.get("window");

const SignupScreenV2 = ({ navigation }) => {

	const [email, setEmail] = useState("")
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const specialOffer = navigation.getParam("specialOffer", undefined)

	const signUpApi = async (
		email,
		password,
		firstName,
		lastName
	) => {
		try {
			const response = await auth.createUserWithEmailAndPassword(
				email,
				password,
			);
			await response.user.updateProfile({
				displayName: `${firstName} ${lastName}`,
			});
			return response;
		} catch (err) {
			if (err.code === 'auth/email-already-in-use') {
				Toast.show({
					type: 'error',
					text1: 'Unsuccessful Signup',
					text2: 'That email address is already in use.',
				});
			}

			if (err.code === 'auth/invalid-email') {
				Toast.show({
					type: 'error',
					text1: 'Unsuccessful Signup',
					text2: 'That email address is invalid.',
				});
			}

			if (err.code === 'auth/weak-password') {
				Toast.show({
					type: 'error',
					text1: 'Unsuccessful Signup',
					text2: 'Password is weak',
				});
			}
		}
	}

	const addDocumentWithId = async (data, uid) => {
		const res = db.collection("users").doc(uid).set(data)
		return res
	}

	const useStorage = {
		setItem: async (key, value) => {
			try {
				return await AsyncStorage.setItem(key, value);
			} catch (e) {
				console.log({ '`Storage Util Error\nSet Item`': e });
			}
		},
	}
	const getUserChallengeFromShopify = async (emailId) => {
		const userRef = await db
			.collection("users")
			.where("email", "==", emailId)
			.where("challenge", "==", true)
			.get();
		if (userRef.size > 0) {
			return userRef.docs[0].data();
		}
	};

	const getUserSubscriptionFromShopify = async (emailId) => {
		const userRef = await db
			.collection("users")
			.where("email", "==", emailId)
			.where("subscription", "==", true)
			.get();
		if (userRef.size > 0) {
			return userRef.docs[0].data();
		}
	};

	const getChallengeDetails = async (user) => {
		const challengeRef = await db
			.collection("users")
			.doc(user.id)
			.collection("challenges")
			.get();
		if (challengeRef.size > 0) {
			return challengeRef.docs[0].data();
		}
	};

	const addChallengesAfterSignUp = async (email, uid) => {
		const shopifyRegisteredUser = await getUserChallengeFromShopify(email);
		const subscriptionFromShopify = await getUserSubscriptionFromShopify(email);

		if (shopifyRegisteredUser != undefined) {
			const challengeDetail = await getChallengeDetails(
				shopifyRegisteredUser
			);
			if (
				challengeDetail != undefined &&
				shopifyRegisteredUser.hasOwnProperty("challenge") &&
				shopifyRegisteredUser.challenge
			) {
				const challenge = await db
					.collection("users")
					.doc(uid)
					.collection("challenges")
					.doc(challengeDetail.id);
				challenge.set(challengeDetail, { merge: true });
				//delete old user
				if (shopifyRegisteredUser != undefined) {
					await db
						.collection("users")
						.doc(shopifyRegisteredUser.id)
						.collection("challenges")
						.doc(challengeDetail.id)
						.delete();
					await db.collection("users").doc(shopifyRegisteredUser.id).delete();
				}
			}
		} else if (subscriptionFromShopify != null) {
			if (
				subscriptionFromShopify.shopifyProductId == 6122583326906 ||
				subscriptionFromShopify.shopifyProductId == 6131066142906
			) {
				await updateUserSubscription(sub3Monthly, uid);
			} else if (subscriptionFromShopify.shopifyProductId == 6122583523514) {
				await updateUserSubscription(subYearly, uid);
			} else if (subscriptionFromShopify.shopifyProductId == 6122583195834) {
				await updateUserSubscription(subMonthly, uid);
			} else if (subscriptionFromShopify.shopifyProductId == 6129876664506) {
				await updateUserSubscription(subOneDay, uid);
			}
			await db.collection("users").doc(subscriptionFromShopify.id).delete();
		}
	};

	const signup = async (
		firstName,
		lastName,
		email,
		password
	) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		Keyboard.dismiss();

		console.log('firstName: ', firstName)
		console.log('lastName: ', lastName)
		console.log('email: ', email)
		console.log('password: ', password)

		try {

			const response = await signUpApi({
				email,
				password,
				firstName,
				lastName
			});

			console.log(response)

			// if (response?.user) {
			// 	/* Set country */
			// 	const { region } = Localization;
			// 	const { uid } = response.user;
			// 	let data = {
			// 		id: response.user.uid,
			// 		email: response.user.email,
			// 		firstName,
			// 		lastName,
			// 		signUpDate: new Date(),
			// 		fitnessLevel: 1,
			// 		onboarded: false,
			// 		country: region || 'unavailable',
			// 	};

			// 	try {
			// 		await useStorage.setItem({ key: 'uid', value: uid });
			// 		await addDocumentWithId(data, uid);

			// 		setLoading(false)
			// 		appsFlyer.trackEvent("af_complete_registration", {
			// 			af_registration_method: "Email",
			// 		});
			// 		await addChallengesAfterSignUp(email, uid);
			// 		await auth.currentUser?.sendEmailVerification().then(() => {
			// 			Alert.alert(
			// 				"Please verify email",
			// 				"An email verification link has been sent to your email address"
			// 			);
			// 		});

			// 		navigation.navigate("Onboarding1", {
			// 			name: firstName,
			// 			specialOffer: specialOffer,
			// 		});
			// 	} catch (err) {
			// 		await response.user.delete();
			// 		Toast.show({
			// 			type: 'error',
			// 			text1: 'Sign up could not be completed',
			// 			text2: 'Please try again',
			// 		});
			// 	}
			// }
		} catch (err) {
			console.log(err)
		}
	}

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
								Create an Account
							</Text>
						</View>
						<View style={authScreenStyleV2.formInputContainer}>
							<TextInput
								style={styles.Input}
								placeholder="First Name"
								onChangeText={setFirstName}
								value={firstName}
							/>
							<TextInput
								style={styles.Input}
								placeholder="Last Name"
								onChangeText={setLastName}
								value={lastName}
							/>
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
					</View>
				</View>
				<View style={authScreenStyleV2.navigateButtonContainer}>
					<CustomBtn
						customBtnStyle={{ marginTop: 20, width: wp("90%") }}
						Title="GET STARTED"
						onPress={() => signup(
							firstName,
							lastName,
							email.toLowerCase(),
							password
						)}
					/>
					<TouchableOpacity onPress={() => navigation.navigate('Login')}>
						<Text
							style={styles.navigateToButton}
						>
							Already have an Account? Sign In
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Toast/>
			{loading && <NativeLoader />}
		</SafeAreaView>
	)
}

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
	navigateToButton: {
		fontFamily: fonts.bold,
		letterSpacing: 0.5,
		fontSize: 16,
		marginTop: width / 10,
		textAlign: "center",
		color: colors.black,
	}
})

export default SignupScreenV2;
