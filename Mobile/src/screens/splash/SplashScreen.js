import React, { useEffect } from 'react'
import {
  ImageBackground,
  View,
} from 'react-native'
import { OTHERSIMG } from "../../library/images/others/others";
import { loadAssetsAsync } from '../../library/useCustomHook/splashHook';
import { splashStyles } from '../../styles/splash/splashStyles'

export const SplashScreenV2 = () => {

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