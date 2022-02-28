import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Linking,
  AppState,
  Platform,
  LogBox,
} from "react-native";
import OneSignal from "react-native-onesignal";
import appsFlyer from "react-native-appsflyer";
import { NavigationActions } from "react-navigation";
import { Audio } from "expo-av";
import { appsFlyerDevKey, appId } from "./config/appsFlyer";
import SwitchNavigator from "./config/router/index";
import colors from "./src/styles/colors";
import _ from "lodash";
// import LogRocket from "@logrocket/react-native";
import { Mixpanel } from "mixpanel-react-native";

const App = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  let navigator;

  const setTopLevelNavigator = (navigatorRef) => {
    navigator = navigatorRef;
  };

  const navigate = (routeName, params) => {
    navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      })
    );
  };

  const handleAppStateChange = async (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === "active") {
      if (Platform.OS === "ios") {
        appsFlyer.trackAppLaunch();
      }
      await Audio.setIsEnabledAsync(true);
    }
    setAppState(nextAppState);
  };
  const handleOpenURL = (event) => {
    if (event.url === "fitazfk://special-offer") {
      navigate("SpecialOffer");
    }
  };

  useEffect(() => {
    LogBox.ignoreLogs(["Setting a timer"]);
    const _console = _.clone(console);
    console.warn = (message) => {
      if (message.indexOf("Setting a timer") <= -1) {
        _console.warn(message);
      }
    };

    OneSignal.init("7078b922-5fed-4cc4-9bf4-2bd718e8b548", {
      kOSSettingsKeyAutoPrompt: true,
      kOSSettingsKeyInAppLaunchURL: false,
    });
    OneSignal.setLocationShared(false);
    appsFlyer.initSdk({
      devKey: appsFlyerDevKey,
      isDebug: false,
      appId,
    });
    const linkinListener = Linking.addEventListener("url", handleOpenURL);
    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    // LogRocket.init('mwh1f2/fitaz-app-v3')
    Mixpanel.init("109211293f4830a3355672d9b84aae74");

    setAppState(AppState.currentState);

    return () => {
      if (linkinListener) {
        linkinListener.remove();
      }
      if (appStateListener) {
        appStateListener.remove();
      }
    };
  }, []);

  return (
    <View style={styles.appContainer}>
      <StatusBar barStyle="light-content" />
      <SwitchNavigator
        ref={(navigatorRef) => setTopLevelNavigator(navigatorRef)}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
