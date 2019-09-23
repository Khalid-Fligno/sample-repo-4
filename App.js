import React from 'react';
import {
  Alert,
  NetInfo,
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Linking,
  AppState,
  Platform,
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import appsFlyer from 'react-native-appsflyer';
import { NavigationActions } from 'react-navigation';
import * as Sentry from 'sentry-expo';
import { appsFlyerDevKey, appId } from './config/appsFlyer';
import SwitchNavigator from './config/router/index';
import colors from './src/styles/colors';

let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(routeName, params) {
  navigator.dispatch(NavigationActions.navigate({
    routeName,
    params,
  }));
}

Sentry.init({
  dsn: 'https://ad25f20f55644584bd7ef1ffd7dfe1f1@sentry.io/1342308',
  enableInExpoDevelopment: false,
  debug: false,
});

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    OneSignal.init(
      '7078b922-5fed-4cc4-9bf4-2bd718e8b548',
      {
        kOSSettingsKeyAutoPrompt: true,
        kOSSettingsKeyInAppLaunchURL: false,
      },
    );
    OneSignal.setLocationShared(false);
    OneSignal.configure(); // triggers the ids event
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
    NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
    Linking.addEventListener('url', this.handleOpenURL);
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount = () => {
    NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
    Linking.removeEventListener('url', this.handleOpenURL);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      if (Platform.OS === 'ios') {
        appsFlyer.trackAppLaunch();
      }
    }
    this.setState({ appState: nextAppState });
  };
  handleOpenURL = (event) => {
    if (event.url === 'fitazfk://special-offer') {
      navigate('SpecialOffer');
    }
  }
  handleConnectivityChange = (connectionInfo) => {
    if (connectionInfo.type === 'none') {
      Alert.alert('No internet connection', 'You will need a healthy internet connection to use this app');
    } else if (connectionInfo.type === 'unknown') {
      Alert.alert('Bad internet connection', 'You will need a healthy internet connection to use this app');
    }
  }
  render() {
    return (
      <View style={styles.appContainer}>
        <SafeAreaView>
          <StatusBar barStyle="light-content" />
        </SafeAreaView>
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
