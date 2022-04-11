import React, { useEffect } from 'react'
import {
  ImageBackground,
  Platform,
  View,
} from 'react-native'
import { useStore } from 'react-redux'
import { getDocument } from '../../hook/firestore/read'
import { COLLECTION_NAMES } from '../../library/collections'
import { OTHERSIMG } from '../../library/images/others/others'
import { splashStyles } from '../../styles/splash/splashStyles'
import { hasChallenges, isActiveChallenge } from '../../utils/challenges'
import SplashScreen from "react-native-splash-screen";
import { useStorage } from '../../hook/storage'
import AsyncStorage from '@react-native-community/async-storage';
import { auth } from '../../config/firebase'
import * as Sentry from "@sentry/react-native";

export const SplashScreenV2 = ({ navigation }) => {

  // const checkAppVersion = async () => {
  //   const docId = "qiF608JzXVcCpeiWccrC"
  //   const doc = await getDocument(
  //     COLLECTION_NAMES.LEGALDOCS,
  //     docId
  //   )

  //   if (doc) {
  //     let appVersion = null;
  //     let appVersion2 = null;
  //     if (Platform.OS === "ios") {
  //       appVersion = String(doc.data().iosBuildVersion);
  //       appVersion2 = String(getVersion());
  //     } else {
  //       appVersion = Number(doc.data().androidBuildVersion);
  //       appVersion2 = Number(getBuildNumber());
  //     }
  //     SplashScreen.hide();
  //   } else {
  //     return null
  //   }
  // }

  const onAuthStateChanged = async (user) => {
    try {
      if (user) {
        const { uid } = user;
        await useStorage.setItem({ key: 'uid', value: uid })
        if (uid) {
          checkUserAuthorization(uid);
        }
      } else {
        Sentry.configureScope((scope) => scope.setUser(null));
        navigation.navigate("Auth");
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  const storePurchase = async (subscriptionInfo) => {
    if (!subscriptionInfo.platform) {
      subscriptionInfo.platform = "ios";
    }
  };

  const checkUserAuthorization = async (uid) => {
    try {
      const userDoc = await getDocument({
        collectionName: COLLECTION_NAMES.USERS,
        documentId: uid,
      });

      if (userDoc) {
        const {
          subscriptionInfo,
        } = userDoc;

        Sentry.setUser({ email: userDoc.email });
        if (!userDoc.fitnessLevel) {
          await useStorage.setItem({ key: 'fitnessLevel', value: "1" })
        } else {
          await useStorage.setItem({
            key: 'fitnessLevel',
            value: userDoc.fitnessLevel.toString()
          })
        }
        if (!subscriptionInfo) {
          if (await hasChallenges(uid)) {
            await goToAppScreen(userDoc);
          } else {
            // NO PURCHASE INFORMATION SAVED
            navigation.navigate("Subscription");
          }
        } else if (subscriptionInfo.expiry < Date.now()) {
          if (await hasChallenges(uid)) {
            await goToAppScreen(doc);
          } else {
            // EXPIRED
            if (subscriptionInfo.receipt) {
              await storePurchase(subscriptionInfo);
            } else {
              navigation.navigate("Subscription");
            }
          }
        } else if (subscriptionInfo.expiry > Date.now()) {
          // RECEIPT STILL VALID
          await hasChallenges(uid);
          await goToAppScreen(userDoc);
        }
      }
    } catch (error) {
      console.log('Error: ', error)
    }
  };

  const goToAppScreen = async (userDoc) => {
    const activeChallenge = await isActiveChallenge();

    try {
      if (!userDoc.onboarded) {
        navigation.navigate("Onboarding1");
        return;
      }
      if (activeChallenge) {
        navigation.navigate("Calendar");
      } else {
        navigation.navigate("App");
      }
    } catch (err) {
      console.log('Error: ', err)
    }
  };

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((user) => {
      console.log('user: ', user)
      onAuthStateChanged(user)
    }
    );
    return subscriber;
  }, [])

  return (
    <View style={splashStyles.container}>
      <ImageBackground
        source={OTHERSIMG.SPLASH_IMAGE}
        style={splashStyles.background}
      />
    </View>
  )
}