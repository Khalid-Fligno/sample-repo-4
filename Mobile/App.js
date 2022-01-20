import React from "react";
import {
  Alert,
  View,
  StyleSheet,
  StatusBar,
  Linking,
  AppState,
  Platform,
} from "react-native";
// import * as Facebook from 'expo-facebook';
import NetInfo from "@react-native-community/netinfo";
import OneSignal from "react-native-onesignal";
import appsFlyer from "react-native-appsflyer";
import { NavigationActions } from "react-navigation";
import { Audio } from "expo-av";
import { appsFlyerDevKey, appId } from "./config/appsFlyer";
import SwitchNavigator from "./config/router/index";
import colors from "./src/styles/colors";
import { YellowBox } from "react-native";
import _ from "lodash";
import LogRocket from '@logrocket/react-native';


YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(routeName, params) {
  navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

// Facebook.initializeAsync({ appId: '1825444707513470' });

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    // Sentry.init({
    //   dsn: 'https://ad25f20f55644584bd7ef1ffd7dfe1f1@sentry.io/1342308',
    //   enableInExpoDevelopment: true,
    //   debug: false,
    // });
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
    this.state = {
      appState: AppState.currentState,
    };
  }
  componentDidMount = () => {
    // this.unsubscribe = NetInfo.addEventListener((state) => {
    //   this.handleConnectivityChange(state);
    // });
    LogRocket.init('ybsf6y/fitazfk-app');
    Linking.addEventListener("url", this.handleOpenURL);
    AppState.addEventListener("change", this.handleAppStateChange);
  };
  componentWillUnmount = () => {
    // this.unsubscribe();
    Linking.removeEventListener("url", this.handleOpenURL);
    AppState.removeEventListener("change", this.handleAppStateChange);
  };
  handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      if (Platform.OS === "ios") {
        appsFlyer.trackAppLaunch();
      }
      await Audio.setIsEnabledAsync(true);
    }
    this.setState({ appState: nextAppState });
  };
  handleOpenURL = (event) => {
    if (event.url === "fitazfk://special-offer") {
      navigate("SpecialOffer");
    }
  };
  handleConnectivityChange = (netInfoState) => {
    if (netInfoState.isInternetReachable === false) {
      Alert.alert(
        "No internet connection",
        "You will need a healthy internet connection to use this app"
      );
    }
  };
  render() {
    return (
      <View style={styles.appContainer}>
        <StatusBar barStyle="light-content" />
        <SwitchNavigator
          ref={(navigatorRef) => setTopLevelNavigator(navigatorRef)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
