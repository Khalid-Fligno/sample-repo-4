import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Alert,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import { Button, Divider, Input } from 'react-native-elements';
import * as Localization from 'expo-localization';
import * as Haptics from 'expo-haptics';
import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import appsFlyer from 'react-native-appsflyer';
import * as Crypto from 'expo-crypto';
import * as AppleAuthentication from 'expo-apple-authentication';
import { db, auth } from '../../../config/firebase';
import NativeLoader from '../../components/Shared/NativeLoader';
import Icon from '../../components/Shared/Icon';
import FacebookButton from '../../components/Auth/FacebookButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import errors from '../../utils/errors';

const { width } = Dimensions.get('window');

const getRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export default class SignupScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: null,
      loading: false,
      specialOffer: props.navigation.getParam('specialOffer', undefined),
      appleSignInAvailable: undefined,
    };
  }
  componentDidMount = async () => {
    const appleSignInAvailable = await AppleAuthentication.isAvailableAsync();
    this.setState({ appleSignInAvailable });
  }
  onSignInWithApple = async () => {
    const nonce = getRandomString(32);
    let nonceSHA256 = '';
    try {
      nonceSHA256 = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce,
      );
    } catch (e) {
      Alert.alert('Sign up could not be completed', 'Please try again.');
    }
    this.setState({ loading: true });
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: nonceSHA256,
      });
      // Signed in to Apple
      if (credential.user) {
        this.signInWithApple({ identityToken: credential.identityToken, nonce, fullName: credential.fullName });
      }
    } catch (e) {
      this.setState({ loading: false });
      if (e.code === 'ERR_CANCELED') {
        Alert.alert('Sign up cancelled');
      } else {
        Alert.alert('Could not sign in with Apple', 'Please sign up with your email address.');
      }
    }
  };
  signInWithApple = async ({ identityToken, nonce, fullName }) => {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce,
    });
    firebase.auth().signInWithCredential(credential)
      // Signed in to Firebase Auth
      .then(async (appleuser) => {
        const { uid, email } = appleuser.user;
        const { givenName, familyName } = fullName;
        const { region } = Localization;
        const data = {
          id: uid,
          firstName: givenName,
          lastName: familyName,
          email,
          onboarded: false,
          country: region || 'unavailable',
          signUpDate: new Date(),
          fitnessLevel: 1,
        };
        await AsyncStorage.setItem('uid', uid);
        db.collection('users').doc(uid).set(data)
          .then(() => {
            this.setState({ loading: false });
            appsFlyer.trackEvent('af_complete_registration', { af_registration_method: 'Apple' });
            this.props.navigation.navigate('Subscription', { name: givenName, specialOffer: this.state.specialOffer });
            auth.currentUser.sendEmailVerification().then(() => {
              Alert.alert('Please verify email', 'An email verification link has been sent to your email address');
            });
          })
          .catch(() => {
            this.setState({ loading: false });
            Alert.alert('Could not create your account', 'Please try again or contact support.');
          });
      })
      .catch(() => {
        this.setState({ loading: false });
        Alert.alert('Could not authenticate with Apple', 'Please try again or contact support.');
      });
  }
  signupWithFacebook = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const { type, token, declinedPermissions } = await Facebook.logInWithReadPermissionsAsync('1825444707513470', {
        permissions: ['public_profile', 'email'],
      });
      if (declinedPermissions.length > 0) {
        this.setState({ loading: false });
        Alert.alert('Could not connect to facebook', 'Please sign up with your email address');
        return;
      }
      if (type === 'success') {
        this.setState({ loading: true });
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const { user, additionalUserInfo } = await firebase.auth().signInWithCredential(credential);
        const { region } = Localization;
        const { profile } = additionalUserInfo;
        const data = {
          id: user.uid,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          onboarded: false,
          country: region || 'unavailable',
          signUpDate: new Date(),
          fitnessLevel: 1,
        };
        await AsyncStorage.setItem('uid', user.uid);
        await AsyncStorage.setItem('fitnessLevel', '1');
        await db.collection('users').doc(user.uid).set(data, (error) => {
          if (error) {
            user.delete().then(() => {
              this.setState({ loading: false });
              Alert.alert('Sign up could not be completed', 'Please try again');
            });
          }
        });
        this.setState({ loading: false });
        appsFlyer.trackEvent('af_complete_registration', { af_registration_method: 'Facebook' });
        auth.currentUser.sendEmailVerification().then(() => {
          Alert.alert('Please verify email', 'An email verification link has been sent to your email address');
          this.props.navigation.navigate('Subscription', { name: profile.first_name, specialOffer: this.state.specialOffer });
        });
      } else {
        this.setState({ loading: false });
        Alert.alert('Could not connect to facebook', 'Please sign up with your email address');
      }
    } catch (err) {
      if (err.message === 'MISSING_EMAIL') {
        this.setState({ loading: false });
        Alert.alert('Facebook signup failed', 'Please sign up with your email address');
        return;
      }
      this.setState({ error: 'Something went wrong', loading: false });
    }
  }
  signup = async (firstName, lastName, email, password) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    this.setState({ loading: true });
    if (!firstName || !lastName) {
      this.setState({ error: 'Please complete all fields', loading: false });
      return;
    }
    try {
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await response.user.updateProfile({ displayName: `${firstName} ${lastName}` });
      const { region } = Localization;
      const { uid } = response.user;
      const data = {
        id: uid,
        firstName,
        lastName,
        email,
        onboarded: false,
        country: region || 'unavailable',
        signUpDate: new Date(),
        fitnessLevel: 1,
      };
      await AsyncStorage.setItem('uid', uid);
      db.collection('users').doc(uid).set(data)
        .then(() => {
          this.setState({ loading: false });
          appsFlyer.trackEvent('af_complete_registration', { af_registration_method: 'Email' });
          this.props.navigation.navigate('Subscription', { name: firstName, specialOffer: this.state.specialOffer });
          auth.currentUser.sendEmailVerification().then(() => {
            Alert.alert('Please verify email', 'An email verification link has been sent to your email address');
          });
        })
        .catch(() => {
          response.user.delete().then(() => {
            this.setState({ loading: false });
            Alert.alert('Sign up could not be completed', 'Please try again');
          });
        });
    } catch (err) {
      const errorCode = err.code;
      this.setState({ error: errors.createUser[errorCode], loading: false });
    }
  }
  navigateToLogin = () => {
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Landing' }),
        NavigationActions.navigate({ routeName: 'Login' }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      error,
      loading,
      appleSignInAvailable,
    } = this.state;
    return (
      <React.Fragment>
        <SafeAreaView style={styles.safeAreaContainer} >
          <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <ImageBackground
              source={require('../../../assets/images/signup-screen-background.jpg')}
              style={styles.imageBackground}
            >
              <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.closeIconContainer}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.closeIconButton}
                  >
                    <Icon
                      name="cross"
                      color={colors.white}
                      size={22}
                    />
                  </TouchableOpacity>
                </View>
                <Text style={styles.headerText1}>
                  CREATE YOUR
                </Text>
                <Text style={styles.headerText1}>
                  ACCOUNT TO
                </Text>
                <Text style={styles.headerText2}>
                  get started
                </Text>
                <KeyboardAvoidingView keyboardVerticalOffset={40} behavior="position" enabled>
                  <Input
                    placeholder="First Name"
                    placeholderTextColor={colors.transparentWhiteLight}
                    value={firstName}
                    returnKeyType="next"
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({ firstName: text })}
                    onSubmitEditing={() => this.lastNameInput.focus()}
                    containerStyle={styles.inputComponentContainer}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    clearButtonMode="while-editing"
                  />
                  <Input
                    placeholder="Last Name"
                    placeholderTextColor={colors.transparentWhiteLight}
                    value={lastName}
                    returnKeyType="next"
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({ lastName: text })}
                    ref={(input) => {
                      this.lastNameInput = input;
                    }}
                    onSubmitEditing={() => this.emailInput.focus()}
                    containerStyle={styles.inputComponentContainer}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    clearButtonMode="while-editing"
                  />
                  <Input
                    placeholder="Email"
                    placeholderTextColor={colors.transparentWhiteLight}
                    value={email}
                    returnKeyType="next"
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(text) => this.setState({ email: text })}
                    ref={(input) => {
                      this.emailInput = input;
                    }}
                    onSubmitEditing={() => this.passwordInput.focus()}
                    containerStyle={styles.inputComponentContainer}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    clearButtonMode="while-editing"
                  />
                  <Input
                    errorMessage={error && error}
                    placeholder="Password"
                    placeholderTextColor={colors.transparentWhiteLight}
                    value={password}
                    returnKeyType="go"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(text) => this.setState({ password: text })}
                    secureTextEntry
                    ref={(input) => {
                      this.passwordInput = input;
                    }}
                    onSubmitEditing={() => this.signup(firstName, lastName, email, password)}
                    containerStyle={styles.inputComponentContainer}
                    inputContainerStyle={styles.inputContainer}
                    inputStyle={styles.input}
                    clearButtonMode="while-editing"
                  />
                </KeyboardAvoidingView>
                <Button
                  title="CREATE NEW ACCOUNT"
                  onPress={() => this.signup(firstName, lastName, email, password)}
                  containerStyle={styles.signupButtonContainer}
                  buttonStyle={styles.signupButton}
                  titleStyle={styles.signupButtonText}
                />
                <Divider style={styles.divider} />
                <View style={styles.dividerOverlay}>
                  <Text style={styles.dividerOverlayText}>
                    OR
                  </Text>
                </View>
                <FacebookButton
                  title="NEW ACCOUNT WITH FACEBOOK"
                  onPress={this.signupWithFacebook}
                />
                {
                  appleSignInAvailable && (
                    <AppleAuthentication.AppleAuthenticationButton
                      onPress={this.onSignInWithApple}
                      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                      cornerRadius={4}
                      style={styles.appleButton}
                    />
                  )
                }
                <Text
                  onPress={this.navigateToLogin}
                  style={styles.navigateToLogin}
                >
                  Already have an account? Log in here
                </Text>
              </ScrollView>
            </ImageBackground>
          </View>
        </SafeAreaView>
        {loading && <NativeLoader />}
      </React.Fragment>
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
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
    width,
  },
  imageBackground: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  scrollView: {
    alignItems: 'center',
  },
  closeIconContainer: {
    alignItems: 'flex-end',
    width,
  },
  closeIconButton: {
    padding: 15,
    paddingBottom: 0,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
  },
  headerText1: {
    fontFamily: fonts.ultraItalic,
    fontSize: 20,
    color: colors.white,
  },
  headerText2: {
    fontFamily: fonts.tuesdayNight,
    fontSize: 28,
    color: colors.white,
    marginTop: -10,
  },
  inputComponentContainer: {
    width: width - 30,
    alignItems: 'center',
  },
  inputContainer: {
    width: width - 30,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 0,
    backgroundColor: colors.transparentWhiteLight,
    borderRadius: 4,
  },
  input: {
    width: width - 30,
    padding: 12,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.grey.light,
    borderRadius: 4,
  },
  signupButtonContainer: {
    marginTop: 6,
    marginBottom: 7,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  signupButton: {
    backgroundColor: colors.coral.standard,
    height: 45,
    width: width - 30,
    borderRadius: 4,
  },
  signupButtonText: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  appleButton: {
    height: 45,
    width: width - 30,
    marginTop: 8,
  },
  divider: {
    backgroundColor: colors.transparent,
    width: width - 30,
    marginTop: 15,
    marginBottom: 15,
  },
  dividerOverlay: {
    height: 26,
    marginTop: -30,
    paddingTop: 8,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: colors.transparent,
  },
  dividerOverlayText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.grey.medium,
  },
  navigateToLogin: {
    fontFamily: fonts.standard,
    fontSize: 14,
    width: width - 30,
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
    color: colors.grey.light,
    textDecorationStyle: 'solid',
    textDecorationColor: colors.grey.light,
    textDecorationLine: 'underline',
  },
});
