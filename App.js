import React from 'react';
import Sentry from 'sentry-expo';
import { Alert, NetInfo, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import SwitchNavigator from './config/router/index';
import colors from './src/styles/colors';

Sentry.config('https://ad25f20f55644584bd7ef1ffd7dfe1f1@sentry.io/1342308').install();

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
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
      <SafeAreaView style={styles.appContainer}>
        <StatusBar
          barStyle="light-content"
        />
        <SwitchNavigator />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
