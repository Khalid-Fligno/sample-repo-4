import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import { Facebook } from 'expo';
import { db } from '../../../config/firebase';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class SignupScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  signupWithFacebook = async () => {
    const firebase = require('firebase');
    const auth = firebase.auth();
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync('1825444707513470', {
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const { user, additionalUserInfo } = await auth.signInAndRetrieveDataWithCredential(credential);
        const { uid } = user;
        const { email } = additionalUserInfo.profile;
        // console.log(additionalUserInfo.profile.first_name);
        const data = {
          id: uid,
          email,
        };
        await db.collection('users').doc(uid).set(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      this.props.navigation.navigate('App');
    }
  }
  signup = async () => {
    const firebase = require('firebase');
    try {
      const response = await firebase.auth().createUserWithEmailAndPassword('caleb@fitazfk.com', 'password');
      const { uid, email } = response.user;
      const data = {
        id: uid,
        email,
      };
      await db.collection('users').doc(uid).set(data);
      this.props.navigation.navigate('App');
    } catch (err) {
      console.log(err);
      // const errorCode = error.code;
      // const errorMessage = error.message;
    }
  }
  render() {
    return (
      <View
        style={styles.container}
      >
        <Button
          onPress={() => this.signupWithFacebook()}
          title="Register with Facebook"
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
            backgroundColor: colors.grey.light,
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
          title="Create Account"
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
