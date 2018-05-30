import React from 'react';
// import { StyleSheet } from 'react-native';
import SwitchNavigator from './config/router';

export default class App extends React.PureComponent {
  render() {
    return (
      <SwitchNavigator />
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
