import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { Facebook } from 'expo';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  loginWithFacebook = async () => {
    const firebase = require('firebase');
    const auth = firebase.auth();
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync('1825444707513470', {
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        auth.signInAndRetrieveDataWithCredential(credential);
        this.props.navigation.navigate('App');
      }
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    return (
      <View
        style={styles.container}
      >
        <Button
          onPress={() => this.loginWithFacebook()}
          title="Log In with Facebook"
          textStyle={{
            marginTop: 4,
            fontFamily: fonts.bold,
            fontSize: 15,
          }}
          buttonStyle={{
            backgroundColor: 'rgb(59,89,152)',
            height: 50,
            width: width - 30,
            borderRadius: 4,
          }}
          containerViewStyle={{
            marginBottom: 7,
            shadowColor: colors.charcoal.dark,
            shadowOpacity: 0.5,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 3,
          }}
        />
        <Divider
          style={{
            backgroundColor: colors.grey.standard,
            width: width - 30,
            marginTop: 15,
            marginBottom: 15,
          }}
        />
        <View
          style={{
            height: 30,
            marginTop: -30,
            paddingTop: 8,
            paddingLeft: 20,
            paddingRight: 20,
            backgroundColor: colors.white,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 14,
              color: colors.grey.dark,
            }}
          >
            OR
          </Text>
        </View>
        <Button
          onPress={() => this.signup()}
          title="Log In"
          fontFamily={fonts.bold}
          textStyle={{
            marginTop: 4,
            fontFamily: fonts.bold,
            fontSize: 15,
          }}
          buttonStyle={{
            backgroundColor: colors.coral.standard,
            height: 50,
            width: width - 30,
            borderRadius: 4,
          }}
          containerViewStyle={{
            marginTop: 7,
            shadowColor: colors.charcoal.dark,
            shadowOpacity: 0.5,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 3,
          }}
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
    paddingTop: 15,
  },
});
