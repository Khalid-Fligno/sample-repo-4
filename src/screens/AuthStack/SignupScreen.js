import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button, Divider } from 'react-native-elements';
import { Facebook } from 'expo';
import { db } from '../../../config/firebase';
import Icon from '../../components/Icon';
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
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.closeIconContainer}>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={styles.closeIconButton}
            >
              <Icon
                name="cross"
                color={colors.charcoal.standard}
                size={22}
              />
            </TouchableOpacity>
          </View>
          <Button
            title="Register with Facebook"
            onPress={() => this.signupWithFacebook()}
            containerViewStyle={styles.facebookLoginButtonContainer}
            buttonStyle={styles.facebookLoginButton}
            textStyle={styles.facebookLoginButtonText}
          />
          <Divider style={styles.divider} />
          <View style={styles.dividerOverlay}>
            <Text style={styles.dividerOverlayText}>
              OR
            </Text>
          </View>
          <Button
            title="Create Account"
            onPress={() => this.signup()}
            containerViewStyle={styles.loginButtonContainer}
            buttonStyle={styles.loginButton}
            textStyle={styles.loginButtonText}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  closeIconContainer: {
    alignItems: 'flex-end',
    width,
  },
  closeIconButton: {
    padding: 15,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  facebookLoginButtonContainer: {
    marginBottom: 7,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  facebookLoginButton: {
    backgroundColor: 'rgb(59,89,152)',
    height: 50,
    width: width - 30,
    borderRadius: 4,
  },
  facebookLoginButtonText: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  divider: {
    backgroundColor: colors.grey.light,
    width: width - 30,
    marginTop: 15,
    marginBottom: 15,
  },
  dividerOverlay: {
    height: 30,
    marginTop: -30,
    paddingTop: 8,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.white,
  },
  dividerOverlayText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.grey.dark,
  },
  loginButtonContainer: {
    marginTop: 7,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  loginButton: {
    backgroundColor: colors.coral.standard,
    height: 50,
    width: width - 30,
    borderRadius: 4,
  },
  loginButtonText: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
});
