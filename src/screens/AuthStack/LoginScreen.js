import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  AsyncStorage,
  Alert,
  NativeModules,
  Keyboard,
  ImageBackground,
} from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Button, Divider, Input } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import * as Facebook from 'expo-facebook';
import * as Sentry from 'sentry-expo';
import firebase from 'firebase';
import appsFlyer from 'react-native-appsflyer';
import { db, auth } from '../../../config/firebase';
import {
  compare,
  compareInApp,
  validateReceiptProduction,
  validateReceiptSandbox,
} from '../../../config/apple';
import NativeLoader from '../../components/Shared/NativeLoader';
import Icon from '../../components/Shared/Icon';
import FacebookButton from '../../components/Auth/FacebookButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import errors from '../../utils/errors';

const { InAppUtils } = NativeModules;
const { width } = Dimensions.get('window');

export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      loading: false,
      specialOffer: props.navigation.getParam('specialOffer', undefined),
    };
  }
  loginWithFacebook = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync('1825444707513470', {
        permissions: ['public_profile', 'email'],
      });
      if (type === 'success') {
        this.setState({ loading: true });
        appsFlyer.trackEvent('af_login');
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const authResponse = await firebase.auth().signInWithCredential(credential);
        const { uid } = authResponse.user;
        await AsyncStorage.setItem('uid', uid);
        db.collection('users').doc(uid)
          .get()
          .then(async (doc) => {
            if (await doc.data().fitnessLevel !== undefined) {
              await AsyncStorage.setItem('fitnessLevel', await doc.data().fitnessLevel.toString());
            }
            const { subscriptionInfo } = await doc.data();
            if (subscriptionInfo === undefined) {
              // NO PURCHASE INFORMATION SAVED
              // this.setState({ loading: false });
              this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
            } else if (subscriptionInfo.expiry < Date.now()) {
              // EXPIRED
              InAppUtils.restorePurchases(async (error, response) => {
                if (error) {
                  Sentry.captureException(error);
                  this.setState({ loading: false });
                  Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
                } else {
                  if (response.length === 0) {
                    this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
                    return;
                  }
                  const sortedPurchases = response.slice().sort(compare);
                  try {
                    const validationData = await this.validate(sortedPurchases[0].transactionReceipt);
                    if (validationData === undefined) {
                      Alert.alert('Receipt validation error');
                      return;
                    }
                    const sortedInApp = validationData.receipt.in_app.slice().sort(compareInApp);
                    if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
                      // Alert.alert('Your subscription has been auto-renewed');
                      const userRef = db.collection('users').doc(uid);
                      const data = {
                        subscriptionInfo: {
                          receipt: sortedPurchases[0].transactionReceipt,
                          expiry: validationData.latest_receipt_info.expires_date,
                        },
                      };
                      await userRef.set(data, { merge: true });
                      this.setState({ loading: false });
                      this.props.navigation.navigate('App');
                    } else if (sortedInApp[0] && sortedInApp[0].expires_date_ms < Date.now()) {
                      Alert.alert('Expired', 'Your most recent subscription has expired');
                      this.props.navigation.navigate('Subscription');
                    } else {
                      Alert.alert('Something went wrong');
                      this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
                      return;
                    }
                  } catch (err) {
                    Alert.alert('Error', 'Could not retrieve subscription information');
                    this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
                  }
                }
              });
            } else {
              // RECEIPT STILL VALID
              this.setState({ loading: false });
              if (await !doc.data().onboarded) {
                this.props.navigation.navigate('Onboarding1');
                return;
              }
              this.props.navigation.navigate('App');
            }
          });
      }
    } catch (err) {
      this.setState({ error: 'Something went wrong', loading: false });
    }
  }
  login = async (email, password) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    this.setState({ loading: true });
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const authResponse = await auth.signInWithEmailAndPassword(email, password);
      if (authResponse) {
        const { uid } = authResponse.user;
        await AsyncStorage.setItem('uid', uid);
        appsFlyer.trackEvent('af_login');
        db.collection('users').doc(uid)
          .get()
          .then(async (doc) => {
            if (await doc.data().fitnessLevel !== undefined) {
              await AsyncStorage.setItem('fitnessLevel', await doc.data().fitnessLevel.toString());
            }
            const { subscriptionInfo } = await doc.data();
            if (subscriptionInfo === undefined) {
              // NO PURCHASE INFORMATION SAVED
              this.setState({ loading: false });
              this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
            } else if (subscriptionInfo.expiry < Date.now()) {
              // EXPIRED
              InAppUtils.restorePurchases(async (error, response) => {
                if (error) {
                  Sentry.captureException(error);
                  this.setState({ loading: false });
                  Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
                } else {
                  if (response.length === 0) {
                    this.setState({ loading: false });
                    this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
                    return;
                  }
                  const sortedPurchases = response.slice().sort(compare);
                  try {
                    const validationData = await this.validate(sortedPurchases[0].transactionReceipt);
                    if (validationData === undefined) {
                      this.setState({ loading: false });
                      Alert.alert('Receipt validation error');
                      return;
                    }
                    const sortedInApp = validationData.receipt.in_app.slice().sort(compareInApp);
                    if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
                      // Alert.alert('Your subscription has been auto-renewed');
                      const userRef = db.collection('users').doc(uid);
                      const data = {
                        subscriptionInfo: {
                          receipt: sortedPurchases[0].transactionReceipt,
                          expiry: sortedInApp[0].expires_date_ms,
                        },
                      };
                      await userRef.set(data, { merge: true });
                      appsFlyer.trackEvent('af_login');
                      this.setState({ loading: false });
                      this.props.navigation.navigate('App');
                    } else if (sortedInApp[0] && sortedInApp[0].expires_date_ms < Date.now()) {
                      Alert.alert('Expired', 'Your most recent subscription has expired');
                      this.props.navigation.navigate('Subscription');
                      return;
                    } else {
                      this.setState({ loading: false });
                      Alert.alert('Something went wrong');
                      this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
                      return;
                    }
                  } catch (err) {
                    this.setState({ loading: false });
                    Alert.alert('Error', 'Could not retrieve subscription information');
                    this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
                  }
                }
              });
            } else {
              // RECEIPT STILL VALID
              this.setState({ loading: false });
              if (await !doc.data().onboarded) {
                this.props.navigation.navigate('Onboarding1');
                return;
              }
              this.props.navigation.navigate('App');
            }
          });
      }
    } catch (err) {
      const errorCode = err.code;
      this.setState({ error: errors.login[errorCode], loading: false });
    }
  }
  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(async () => {
      const validationDataSandbox = await validateReceiptSandbox(receiptData);
      return validationDataSandbox;
    });
    if (validationData !== undefined) {
      return validationData;
    }
    return undefined;
  }
  navigateToSignup = () => {
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Landing' }),
        NavigationActions.navigate({ routeName: 'Signup' }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  navigateToForgottenPassword = () => {
    this.props.navigation.navigate('ForgottenPassword');
  }
  render() {
    const {
      email,
      password,
      error,
      loading,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
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
              <Input
                placeholder="Email"
                placeholderTextColor={colors.transparentWhiteLight}
                value={email}
                returnKeyType="next"
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(text) => this.setState({ email: text })}
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
                onSubmitEditing={() => this.login(email, password)}
                containerStyle={styles.inputComponentContainer}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.input}
                clearButtonMode="while-editing"
              />
              <Button
                title="LOG IN"
                onPress={() => this.login(email, password)}
                containerStyle={styles.loginButtonContainer}
                buttonStyle={styles.loginButton}
                titleStyle={styles.loginButtonText}
                fontFamily={fonts.bold}
              />
              <Divider style={styles.divider} />
              <View style={styles.dividerOverlay} >
                <Text style={styles.dividerOverlayText}>
                  OR
                </Text>
              </View>
              <FacebookButton
                title="LOG IN WITH FACEBOOK"
                onPress={this.loginWithFacebook}
              />
              <Text
                onPress={this.navigateToForgottenPassword}
                style={styles.navigateToForgottenPasswordButton}
              >
                {'Forgotten your password?'}
              </Text>
              <Text
                onPress={this.navigateToSignup}
                style={styles.navigateToSignupButton}
              >
                {"Don't have an account? Sign up here"}
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
    flex: 1,
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
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
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
    height: 45,
    width: width - 30,
    borderRadius: 4,
  },
  loginButtonText: {
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
  navigateToForgottenPasswordButton: {
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
  navigateToSignupButton: {
    fontFamily: fonts.standard,
    fontSize: 14,
    width: width - 30,
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center',
    color: colors.grey.light,
    textDecorationStyle: 'solid',
    textDecorationColor: colors.grey.light,
    textDecorationLine: 'underline',
  },
});
