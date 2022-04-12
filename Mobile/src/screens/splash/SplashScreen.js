import React, { useEffect } from 'react'
import {
  ImageBackground,
  View,
} from 'react-native'
import { getDocument } from '../../hook/firestore/read'
import { COLLECTION_NAMES } from '../../library/collections'
import { OTHERSIMG } from "../../library/images/others/others";
import { splashStyles } from '../../styles/splash/splashStyles'
import { hasChallenges, isActiveChallenge } from '../../utils/challenges'
import SplashScreen from "react-native-splash-screen";
import { useStorage } from '../../hook/storage'
import { auth } from '../../config/firebase'
import * as Sentry from "@sentry/react-native";
import { fontAssets } from '../../library/fonts';
import { imageAssets } from '../../library/images';
import { soundAsset } from '../../library/sounds';

export const SplashScreenV2 = ({ navigation }) => {

  const loadAssetsAsync = async () => {
    await Promise.all([...imageAssets(), ...fontAssets(), soundAsset()]);
    SplashScreen.hide();
    await cachingComplete();
  }

  const cachingComplete = async () => {
    const subscriber = auth.onAuthStateChanged((user) => {
      try {
        if (user) {
          subscriber();
          const { uid } = user;
          useStorage.setItem('uid', uid)
          if (uid) {
            checkUserAuthorization(uid);
          }
        } else {
          subscriber();
          Sentry.configureScope((scope) => scope.setUser(null));
          navigation.navigate("Auth");
        }
      } catch (error) {
        console.log('Error: ', error)
      }
    });
  }

  const storePurchase = async (subscriptionInfo) => {
    if (!subscriptionInfo.platform) {
      subscriptionInfo.platform = "ios";
    }
  };

  const checkUserAuthorization = async (uid) => {
    try {
      const userDoc = await getDocument(
        COLLECTION_NAMES.USERS,
        uid
      );

      if (userDoc) {
        const {
          subscriptionInfo,
        } = userDoc;
        Sentry.setUser({ email: userDoc.email });
        if (!userDoc.fitnessLevel) {
          await useStorage.setItem('fitnessLevel', "1")
        } else {
          await useStorage.setItem(
            'fitnessLevel',
            userDoc.fitnessLevel.toString()
          )
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
            await goToAppScreen(userDoc);
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
    loadAssetsAsync();
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