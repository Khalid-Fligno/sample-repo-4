import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class AuthLoadingScreen extends React.PureComponent {
  render() {
    return (
      <View
        style={styles.container}
      >
        <Text>AuthLoadingScreen</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
