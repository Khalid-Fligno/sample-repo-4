import React, { useEffect } from 'react'
import {
  ImageBackground,
  View,
} from 'react-native'
import { useStore } from 'react-redux'
import { getDocument } from '../../hook/firestore/read'
import { COLLECTION_NAMES } from '../../library/collections'
import { OTHERSIMG } from '../../library/images/others/others'
import { splashStyles } from '../../styles/splash/splashStyles'
import { isActiveChallenge } from '../../utils/challenges'

export const SplashScreen = ({ navigation }) => {

  const checkAppVersion = async () => {
    const docId = "qiF608JzXVcCpeiWccrC"
    const doc = await getDocument(
      COLLECTION_NAMES.LEGALDOCS,
      docId
    )

    if (doc) {
      let appVersion = null;
      let appVersion2 = null;
      if (Platform.OS === "ios") {
        appVersion = String(doc.data().iosBuildVersion);
        appVersion2 = String(getVersion());
      } else {
        appVersion = Number(doc.data().androidBuildVersion);
        appVersion2 = Number(getBuildNumber());
      }
      SplashScreen.hide();
    } else {
      return null
    }
  }

  const goToAppScreen = async () => {
    const uid = await useStore.getItem('uid');
    const doc = await getDocument(
      COLLECTION_NAMES.USERS,
      uid
    )

    if (!doc.data().onboarded) {
      this.props.navigation.navigate("Onboarding1");
      return;
    }

    try {
      const activeChallenge = await isActiveChallenge();

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
    checkAppVersion();
  }, [])

  useEffect(() => {
    goToAppScreen();
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