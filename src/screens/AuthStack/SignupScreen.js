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
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Button, Divider, FormInput, FormValidationMessage } from 'react-native-elements';
import { Facebook } from 'expo';
import Modal from 'react-native-modal';
import { db, auth } from '../../../config/firebase';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
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
      emailVerificationModalVisible: false,
    };
  }
  signupWithFacebook = async () => {
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync('1825444707513470', {
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        this.setState({ loading: true });
        const credential = auth.FacebookAuthProvider.credential(token);
        const { user, additionalUserInfo } = await auth.signInAndRetrieveDataWithCredential(credential);
        const { profile } = additionalUserInfo;
        const data = {
          id: user.uid,
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          onboarded: false,
          signUpDate: new Date(),
        };
        await db.collection('users').doc(user.uid).set(data);
        await AsyncStorage.setItem('uid', user.uid);
        this.setState({ loading: false });
        this.props.navigation.navigate('Onboarding');
      }
    } catch (err) {
      console.log(err);
      this.setState({ error: 'Something went wrong', loading: false });
    }
  }
  signup = async (firstName, lastName, email, password) => {
    this.setState({ loading: true });
    if (!firstName || !lastName) {
      this.setState({ error: 'Please complete all fields', loading: false });
      return;
    }
    const firebase = require('firebase');
    try {
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const { uid } = response.user;
      const data = {
        id: uid,
        firstName,
        lastName,
        email,
        onboarded: false,
        signUpDate: new Date(),
      };
      await db.collection('users').doc(uid).set(data);
      await AsyncStorage.setItem('uid', uid);
      this.setState({ loading: false });
      auth.currentUser.sendEmailVerification().then(() => {
        this.setState({ emailVerificationModalVisible: true });
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
      emailVerificationModalVisible,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer} >
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              alignItems: 'center',
              width: width - 30,
            }}
          >
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
            <FormInput
              placeholder="First Name"
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
              title="CREATE ACCOUNT"
              onPress={() => this.signup(firstName, lastName, email, password)}
              containerViewStyle={styles.loginButtonContainer}
              buttonStyle={styles.loginButton}
              textStyle={styles.loginButtonText}
            />
            <Divider style={styles.divider} />
            <View style={styles.dividerOverlay}>
              <Text style={styles.dividerOverlayText}>
                OR
              </Text>
            </View>
            <Button
              title="REGISTER WITH FACEBOOK"
              onPress={() => this.signupWithFacebook()}
              containerViewStyle={styles.facebookLoginButtonContainer}
              buttonStyle={styles.facebookLoginButton}
              textStyle={styles.facebookLoginButtonText}
            />
            <Text
              onPress={() => this.navigateToLogin()}
              style={styles.navigateToLogin}
            >
              Already signed up? Log in here
            </Text>
            {
              loading && (
                <Loader
                  loading={loading}
                  color={colors.black}
                  overlayColor="rgba(0, 0, 0, 0.3)'"
                />
              )
            }
          </ScrollView>
          <Modal
            isVisible={emailVerificationModalVisible}
            animationIn="fadeIn"
            animationInTiming={800}
            animationOut="fadeOut"
            animationOutTiming={800}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalTextContainer}>
                <Text style={styles.modalHeaderText}>
                  Verify Email
                </Text>
                <Text style={styles.modalBodyText}>
                  A verification email has been sent to your email address.  Please verify your email then log in to continue.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.setState({ emailVerificationModalVisible: false })}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
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
    width,
  },
  closeIconContainer: {
    alignItems: 'flex-end',
    width,
  },
  closeIconButton: {
    padding: 15,
    paddingLeft: 20,
    paddingBottom: 20,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
  },
  inputContainer: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 0,
  },
  input: {
    width: width - 30,
    padding: 12,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.standard,
    borderWidth: 1,
    borderColor: colors.grey.standard,
    borderRadius: 4,
  },
  loginButtonContainer: {
    marginTop: 7,
    marginBottom: 7,
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
  divider: {
    backgroundColor: colors.grey.light,
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
    backgroundColor: colors.white,
  },
  dividerOverlayText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.grey.dark,
  },
  facebookLoginButtonContainer: {
    marginTop: 8,
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
  navigateToLogin: {
    width: width - 30,
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
    color: colors.grey.dark,
    textDecorationStyle: 'solid',
    textDecorationColor: colors.grey.dark,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalTextContainer: {
    backgroundColor: colors.white,
    padding: 10,
    paddingTop: 15,
  },
  modalHeaderText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  modalBodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.dark,
    marginLeft: 3,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
});
