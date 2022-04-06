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
import authScreenStyle from './authScreenStyle';
import fonts from "../../styles/fonts";
import { containerPadding } from '../../styles/globalStyles';
import HeaderAuth from '../../components/Auth/Header';
import * as Haptics from "expo-haptics";
import { db, auth } from "../../../config/firebase";
import Toast from 'react-native-toast-message';
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-community/async-storage";
import appsFlyer from 'react-native-appsflyer';
import NativeLoader from "../../components/Shared/NativeLoader";
import {
  updateUserSubscription,
  subOneDay,
  subMonthly,
  sub3Monthly,
  subYearly,
} from "../../utils/challenges";

const { width } = Dimensions.get("window");

const SignupScreen = ({ navigation }) => {

  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const specialOffer = navigation.getParam("specialOffer", undefined)
  const userData = navigation.getParam("userData", undefined)

  const addDocumentWithId = async (data, uid) => {
    db.collection("users").doc(uid).set(data)
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
    setLoading(true)

    if (!firstName || !lastName || !email || !password) {
      console.log('pasok')
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Unsuccessful Signup',
        text2: 'Please complete all fields.',
      });
    } else {
      try {
        const response = await auth.createUserWithEmailAndPassword(
          email,
          password,
        );
        await response.user.updateProfile({
          displayName: `${firstName} ${lastName}`,
        });

        if (response?.user) {
          /* Set country */
          const { region } = Localization;
          const { uid, email } = response.user;
          let data = {
            id: uid,
            email: email,
            firstName,
            lastName,
            signUpDate: new Date(),
            fitnessLevel: 1,
            onboarded: false,
            country: region || 'unavailable',
          };

          await AsyncStorage.setItem("uid", uid);
          
          try {
            await addDocumentWithId(data, uid);

            setLoading(false)
            appsFlyer.trackEvent("af_complete_registration", {
              af_registration_method: "Email",
            });
            await addChallengesAfterSignUp(email, uid);
            await auth.currentUser?.sendEmailVerification().then(() => {
              Alert.alert(
                "Please verify email",
                "An email verification link has been sent to your email address"
              );
            });

            navigation.navigate("Onboarding1", {
              name: firstName,
              specialOffer: specialOffer,
            });
          } catch (err) {
            await response.user.delete();
            Toast.show({
              type: 'error',
              text1: 'Sign up could not be completed',
              text2: 'Please try again',
            });
          }
        }
      } catch (err) {
        console.log('Error: ', err)
        if (err.code === 'auth/email-already-in-use') {
          setLoading(false)
          Toast.show({
            type: 'error',
            text1: 'Unsuccessful Signup',
            text2: 'That email address is already in use.',
          });
        }

        if (err.code === 'auth/invalid-email') {
          setLoading(false)
          Toast.show({
            type: 'error',
            text1: 'Unsuccessful Signup',
            text2: 'That email address is invalid.',
          });
        }

        if (err.code === 'auth/weak-password') {
          setLoading(false)
          Toast.show({
            type: 'error',
            text1: 'Unsuccessful Signup',
            text2: 'Password is weak',
          });
        }
      }
    }
  }

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
                Create an Account
              </Text>
            </View>
            <View style={authScreenStyle.formInputContainer}>
              <TextInput
                style={styles.Input}
                placeholder="First Name"
                value={userData ? userData.firstName : firstName}
                onChangeText={(text) => userData ? 
                  setFirstName(userData.firstName) :
                  setFirstName(text)
                }
                editable={!userData ? true : false}
              />
              <TextInput
                style={styles.Input}
                placeholder="Last Name"
                value={userData ? userData.lastName : lastName}
                onChangeText={(text) => userData ? 
                  setLastName(userData.lastName) :
                  setLastName(text)
                }
                editable={!userData ? true : false}
              />
              <TextInput
                style={styles.Input}
                placeholder="Email Address"
                keyboardType="email-address"
                value={userData ? userData.email : email}
                onChangeText={(text) => userData ? 
                  setEmail(userData.email) :
                  setEmail(text)
                }
                editable={!userData ? true : false}
                autoCapitalize='none'
              />
              <TextInput
                style={styles.Input}
                placeholder="Password"
                secureTextEntry
                returnKeyType="go"
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
              />
            </View>
          </View>
        </View>
        <View style={authScreenStyle.navigateButtonContainer}>
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

export default SignupScreen;
