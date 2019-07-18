import React from 'react';
import Sentry from 'sentry-expo';
import { Alert, NetInfo, View, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import OneSignal from 'react-native-onesignal';
import SwitchNavigator from './config/router/index';
import colors from './src/styles/colors';

Sentry.config('https://ad25f20f55644584bd7ef1ffd7dfe1f1@sentry.io/1342308').install();

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
    OneSignal.configure(); // triggers the ids event
    this.state = {
    };
  }
  componentDidMount = () => {
    NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);
  }
  componentWillUnmount = () => {
    NetInfo.removeEventListener('connectionChange', this.handleConnectivityChange);
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
        <SwitchNavigator />
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
