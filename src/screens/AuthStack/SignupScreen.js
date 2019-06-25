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
  AsyncStorage,
  Alert,
  Keyboard,
  ImageBackground,
  KeyboardAvoidingView,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Button, Divider, FormInput, FormValidationMessage } from 'react-native-elements';
import { Facebook, Haptic, Localization } from 'expo';
import firebase from 'firebase';
import { db, auth } from '../../../config/firebase';
import NativeLoader from '../../components/Shared/NativeLoader';
import Icon from '../../components/Shared/Icon';
import FacebookButton from '../../components/Auth/FacebookButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import errors from '../../utils/errors';

const { width } = Dimensions.get('window');

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
    };
  }
  signupWithFacebook = async () => {
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
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
        const { user, additionalUserInfo } = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
        const { profile } = additionalUserInfo;
        const data = {
          id: user.uid,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          onboarded: false,
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
        auth.currentUser.sendEmailVerification().then(() => {
          Alert.alert('Please verify email', 'An email verification link has been sent to your email address');
          this.props.navigation.navigate('Subscription', { name: profile.first_name });
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
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    this.setState({ loading: true });
    if (!firstName || !lastName) {
      this.setState({ error: 'Please complete all fields', loading: false });
      return;
    }
    try {
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await response.user.updateProfile({ displayName: `${firstName} ${lastName}` });
      const { country } = Localization;
      const { uid } = response.user;
      const data = {
        id: uid,
        firstName,
        lastName,
        email,
        onboarded: false,
        country,
        signUpDate: new Date(),
      };
      await AsyncStorage.setItem('uid', uid);
      await db.collection('users').doc(uid).set(data, (error) => {
        if (error) {
          response.user.delete().then(() => {
            this.setState({ loading: false });
            Alert.alert('Sign up could not be completed', 'Please try again');
          });
        }
      });
      this.setState({ loading: false });
      this.props.navigation.navigate('Subscription', { name: firstName });
      auth.currentUser.sendEmailVerification().then(() => {
        Alert.alert('Please verify email', 'An email verification link has been sent to your email address');
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
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer} >
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
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
                <FormInput
                  placeholder="First Name"
                  placeholderTextColor={colors.transparentWhiteLight}
                  value={firstName}
                  returnKeyType="next"
                  autoCorrect={false}
                  onChangeText={(text) => this.setState({ firstName: text })}
                  onSubmitEditing={() => this.lastNameInput.focus()}
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.input}
                  clearButtonMode="while-editing"
                />
                <FormInput
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
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.input}
                  clearButtonMode="while-editing"
                />
                <FormInput
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
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.input}
                  clearButtonMode="while-editing"
                />
                <FormInput
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
                  containerStyle={styles.inputContainer}
                  inputStyle={styles.input}
                  clearButtonMode="while-editing"
                />
              </KeyboardAvoidingView>
              {
                error && (
                  <View>
                    <FormValidationMessage>
                      {error}
                    </FormValidationMessage>
                  </View>
                )
              }
              <Button
                title="SIGN ME UP"
                onPress={() => this.signup(firstName, lastName, email, password)}
                containerViewStyle={styles.signupButtonContainer}
                buttonStyle={styles.signupButton}
                textStyle={styles.signupButtonText}
              />
              <Divider style={styles.divider} />
              <View style={styles.dividerOverlay}>
                <Text style={styles.dividerOverlayText}>
                  OR
                </Text>
              </View>
              <FacebookButton
                title="SIGN UP WITH FACEBOOK"
                onPress={this.signupWithFacebook}
              />
              <Text
                onPress={this.navigateToLogin}
                style={styles.navigateToLogin}
              >
                Already have an account? Log in here
              </Text>
              {
                loading && <NativeLoader />
              }
            </ScrollView>
          </ImageBackground>
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
    // flex: 1,
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
  inputContainer: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 0,
    backgroundColor: colors.transparentWhiteLight,
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
    marginTop: 7,
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
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 15,
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
