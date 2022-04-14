import React, { useEffect } from 'react'
import { Linking } from 'react-native';
import SwitchNavigator from "../navigation/stack/index";
import { navigate, navigationRef } from './rootNavigation';

const Router = () => {

  const setTopLevelNavigator = (navigatorRef) => {
    navigationRef(navigatorRef)
  };

  const handleOpenURL = (event) => {
    if (event.url === "fitazfk://special-offer") {
      navigate("SpecialOffer");
    }
  };

  useEffect(() => {
    const linkinListener = Linking
      .addEventListener("url", handleOpenURL);

    return () => {
      if (linkinListener) {
        linkinListener.remove();
      }
    };
  })

  return (
    <SwitchNavigator
      ref={(navigatorRef) => setTopLevelNavigator(navigatorRef)}
    />
  )
}

export default Router;