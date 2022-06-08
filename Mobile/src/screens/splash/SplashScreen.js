import React, { useEffect } from 'react'
import {
  ImageBackground,
  View,
} from 'react-native'
import { OTHERSIMG } from "../../library/images/others/others";
import { styles } from './style'
import * as Sentry from "@sentry/react-native";
import SplashScreen from "react-native-splash-screen";
import { hasChallenges, isActiveChallenge } from '../../utils/challenges'
import { useStorage } from '../../hook/storage'
import { auth } from '../../config/firebase'
import { fontAssets } from '../../library/fonts';
import { imageAssets } from '../../library/images';
import { soundAsset } from '../../library/sounds';
import { getDocument } from '../../hook/firestore/read'
import { COLLECTION_NAMES } from '../../library/collections'
import { navigate } from "../../navigation/rootNavigation";

export const SplashScreenV2 = () => {

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
          navigate("Auth");
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
  
  const goToAppScreen = async (userDoc) => {
    const activeChallenge = await isActiveChallenge();
  
    try {
      if (!userDoc.onboarded) {
        navigate("Onboarding1");
        return;
      }
      if (activeChallenge) {
        navigate("Calendar");
      } else {
        navigate("App");
      }
    } catch (err) {
      console.log('Error: ', err)
    }
  };

  useEffect(() => {
    loadAssetsAsync();
  }, [])

  return (
    <View style={styles.container}>
      <ImageBackground
        source={OTHERSIMG.SPLASH_IMAGE}
        style={styles.background}
      />
    </View>
  )
}