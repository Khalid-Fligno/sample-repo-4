import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Facebook } from 'expo';
import CustomButton from '../../components/CustomButton';
import colors from '../../styles/colors';

export default class SignInScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  loginWithFacebook = async () => {
    const firebase = require('firebase');
    const auth = firebase.auth();
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('1825444707513470', {
      permissions: ['public_profile', 'email'],
    });
    if (type === 'success') {
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      auth.signInAndRetrieveDataWithCredential(credential)
        .then(() => {
          this.props.navigation.navigate('App');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
  render() {
    return (
      <View
        style={styles.container}
      >
        <Text>SignInScreen</Text>

        <CustomButton
          onPress={() => this.loginWithFacebook()}
          title="Sign in with Facebook"
          primary
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
