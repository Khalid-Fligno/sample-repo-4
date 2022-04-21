import { useState } from "react";
import * as Haptics from "expo-haptics";
import { auth } from "../../../../config/firebase";
import { COLLECTION_NAMES } from '../../../../library/collections';
import { FIELD_NAME } from '../../../../library/fieldName';
import { getUserChallenge, getUserSpecificField } from "../../../../hook/firestore/read";
import { addDocument, addSubDocument } from "../../../../hook/firestore/write";
import { deleteDocument, deleteSubDocument } from "../../../../hook/firestore/delete";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-community/async-storage";
import appsFlyer from 'react-native-appsflyer';
import Toast from 'react-native-toast-message';
import { navigate } from "../../../../navigation/rootNavigation";
import {
  updateUserSubscription,
  subOneDay,
  subMonthly,
  sub3Monthly,
  subYearly,
} from "../../../../utils/challenges";
import {
  Keyboard,
  Alert,
} from 'react-native'

export const useCounter = (specialOffer) => {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const addChallengesAfterSignUp = async (email, uid) => {
    const shopifyRegisteredUser = await getUserSpecificField(
      COLLECTION_NAMES.USERS,
      FIELD_NAME.EMAIL,
      FIELD_NAME.CHALLENGE,
      email,
      true
    );
    const subscriptionFromShopify = await getUserSpecificField(
      COLLECTION_NAMES.USERS,
      FIELD_NAME.EMAIL,
      FIELD_NAME.SUBSCRIPTION,
      email,
      true
    );

    if (shopifyRegisteredUser != undefined) {
      const challengeDetail = await getUserChallenge(
        COLLECTION_NAMES.USERS,
        COLLECTION_NAMES.CHALLENGES,
        shopifyRegisteredUser
      );
      if (
        challengeDetail != undefined &&
        shopifyRegisteredUser.hasOwnProperty("challenge") &&
        shopifyRegisteredUser.challenge
      ) {
        const isUserAddChallengeDetail = await addSubDocument(
          COLLECTION_NAMES.USERS,
          COLLECTION_NAMES.CHALLENGES,
          uid,
          challengeDetail.id,
          challengeDetail
        )

        if(!isUserAddChallengeDetail){
          console.log('User challenge detail not added')
          return undefined
        }
        //delete old user
        if (shopifyRegisteredUser != undefined) {
          await deleteSubDocument(
            COLLECTION_NAMES.USERS,
            COLLECTION_NAMES.CHALLENGES,
            uid,
            challengeDetail.id
          )
          await deleteDocument(
            COLLECTION_NAMES.USERS,
            shopifyRegisteredUser.id
          )
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
      await deleteDocument(
        COLLECTION_NAMES.USERS,
        subscriptionFromShopify.id
      )
    }
  };

  const signup = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    setLoading(true)

    if (!firstName || !lastName || !email || !password) {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Unsuccessful Signup',
        text2: 'Please complete all fields.',
      });
    } else if (password !== confirmPassword) {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Unsuccessful Signup',
        text2: "Passwords don't match.",
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
            const isUserAddedData = await addDocument(
              COLLECTION_NAMES.USERS,
              uid,
              data
            );

            if(!isUserAddedData){
              console.log('User Data not added')
              return undefined
            }

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

            navigate("Onboarding1", {
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

  return {
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    signup
  }
}