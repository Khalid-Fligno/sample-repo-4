import React, { useEffect } from 'react'
import {
  ImageBackground,
  View,
} from 'react-native'
import { OTHERSIMG } from "../../library/images/others/others";
import { splashStyles } from '../../styles/splash/splashStyles'
import { loadAssetsAsync } from '../../utils/helper/splashHelper';

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