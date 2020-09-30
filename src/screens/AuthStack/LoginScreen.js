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
  Alert,
  NativeModules,
  Keyboard,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import { Button, Divider, Input } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import * as Facebook from 'expo-facebook';
// import * as Sentry from 'sentry-expo';
import firebase from 'firebase';
import appsFlyer from 'react-native-appsflyer';
import * as Crypto from 'expo-crypto';
import * as AppleAuthentication from 'expo-apple-authentication';
import { db, auth } from '../../../config/firebase';
import {
  compare,
  compareInApp,
  validateReceiptProduction,
  validateReceiptSandbox,
} from '../../../config/apple';
import {
    restoreAndroidPurchases
} from '../../../config/android';
import {
  RestoreSubscriptions
} from '../../utils/subscription';
import NativeLoader from '../../components/Shared/NativeLoader';
import Icon from '../../components/Shared/Icon';
import FacebookButton from '../../components/Auth/FacebookButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import errors from '../../utils/errors';
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
import CustomBtn from '../../components/Shared/CustomBtn';
import globalStyle, { containerPadding } from '../../styles/globalStyles';
import InputBox from '../../components/Shared/inputBox';
import BigHeadingWithBackButton from '../../components/Shared/BigHeadingWithBackButton';
const { InAppUtils } = NativeModules;
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

let isFocused = false
export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
        Alert.alert('Login cancelled');
      } else {
        Alert.alert('Something went wrong');
      }
    }
  };
  signInWithApple = async ({ identityToken, nonce }) => {
    const provider = new firebase.auth.OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce,
    });
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase.auth().signInWithCredential(credential)
      // Signed in to Firebase Auth
      .then(async (appleuser) => {
        const { uid } = appleuser.user;
        appsFlyer.trackEvent('af_login');
        await AsyncStorage.setItem('uid', uid);
        db.collection('users').doc(uid)
          .get()
          .then(async (doc) => {
            if (await doc.data().fitnessLevel !== undefined) {
              await AsyncStorage.setItem('fitnessLevel', await doc.data().fitnessLevel.toString());
            }
            const { subscriptionInfo = undefined } = await doc.data();
            if (subscriptionInfo === undefined) {
              // NO PURCHASE INFORMATION SAVED
              // this.setState({ loading: false });
              this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
            } else if (subscriptionInfo.expiry < Date.now()) {
              // EXPIRED
              InAppUtils.restorePurchases(async (error, response) => {
                if (error) {
                  // Sentry.captureException(error);
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
      })
      .catch(() => {
        this.setState({ loading: false });
        Alert.alert('Login could not be completed', 'Please try again or contact support.');
      });
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
            const { subscriptionInfo = undefined } = await doc.data();
            if (subscriptionInfo === undefined) {
              // NO PURCHASE INFORMATION SAVED
              // this.setState({ loading: false });
              this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
            } else if (subscriptionInfo.expiry < Date.now()) {
              // EXPIRED

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

  storePurchase = async (subscriptionInfo, onboarded) => {
    const restoreSubscriptions = new RestoreSubscriptions(this.props);
    if (!subscriptionInfo.platform) {
      subscriptionInfo.platform = 'ios';
    }
    try{
      await restoreSubscriptions.restore(subscriptionInfo, onboarded);
    }
    catch(ex){
      if (Platform.OS === 'ios') {
        await this.iOSStorePurchases(onboarded);
      }
      else if (Platform.OS === 'android') {
          //await restoreSubscriptions.restore(subscriptionInfo, onboarded);
          await restoreAndroidPurchases(this.props);
      }
    }
  }

  iOSStorePurchases = async (onboarded) => {
    InAppUtils.restorePurchases(async (error, response) => {
      if (error) {
        // Sentry.captureException(error);
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
            if (onboarded) {
              this.props.navigation.navigate('Onboarding1');
              return;
            }
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
            const { subscriptionInfo = undefined, onboarded = false  } = await doc.data();
            if (subscriptionInfo === undefined) {
              // NO PURCHASE INFORMATION SAVED
              this.setState({ loading: false });
              this.props.navigation.navigate('Subscription', { specialOffer: this.state.specialOffer });
            } else if (subscriptionInfo.expiry < Date.now()) {
              // EXPIRED
              await this.storePurchase(subscriptionInfo, onboarded);
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
      appleSignInAvailable,
    } = this.state;
    return (
      <React.Fragment>
        <SafeAreaView style={styles.safeAreaContainer}>
          <StatusBar barStyle="light-content" />
          <View style={styles.container}>
            {/* <ImageBackground
              source={require('../../../assets/images/signup-screen-background.jpg')}
              style={styles.imageBackground}
            > */}
              <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.closeIconContainer}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                    style={styles.closeIconButton}
                  >
                    <Icon
                      name="cross"
                      color={colors.themeColor.color}
                      size={22}
                    />
                  </TouchableOpacity>
                </View>
                <BigHeadingWithBackButton 
                  isBackButton={false}
                  bigTitleText="Sign in"
                  isBigTitle={true}
                  bigTitleStyle={{width:width-containerPadding*2}}
                />
                <InputBox 
                   placeholder="Email address"
                   value={email}
                   keyboardType="email-address"
                   onChangeText={(text) =>{this.setState({ email: text })}}
                  //  onSubmitEditing={() => {this.passwordInput.focus()}}
                />
                <InputBox 
                   errorMessage={error && error}
                   placeholder="Password"
                   value={password}
                   onChangeText={(text) =>{this.setState({ password: text })}}
                   onSubmitEditing={() => this.login(email, password)}
                   secureTextEntry
                   returnKeyType="go"
                  //  ref={(input) => this.passwordInput = input}
                />
               
            
                <CustomBtn 
                  customBtnStyle={{borderRadius:50,width:width -containerPadding*2,marginTop:20 }}
                  Title="Sign in"
                  onPress={() => this.login(email, password)}
                />
                {/* <Button
                  title="SIGN IN"
                  onPress={() => this.login(email, password)}
                  containerStyle={styles.loginButtonContainer}
                  buttonStyle={styles.loginButton}
                  titleStyle={styles.loginButtonText}
                  fontFamily={fonts.bold}
                /> */}
                {/* <Divider style={styles.divider} /> */}
                <View style={styles.dividerOverlay} >
                  <Text style={styles.dividerOverlayText}>
                    OR
                  </Text>
                </View>
                {/* <FacebookButton
                  title="SIGN IN WITH FACEBOOK"
                  onPress={this.loginWithFacebook}
                /> */}
                  <CustomBtn 
                      customBtnStyle={{borderRadius:50,width:width -containerPadding*2,borderColor:colors.grey.standard}}
                      outline={true}
                      Title="Sign in with Facebook"
                      customBtnTitleStyle={{color:colors.transparentBlackDark}}
                      onPress={this.loginWithFacebook}
                      leftIcon={true}
                      leftIconUrl={require('../../../assets/icons/facebook.png')}
                />
                {
                  appleSignInAvailable && (
                    <AppleAuthentication.AppleAuthenticationButton
                      onPress={this.onSignInWithApple}
                      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                      cornerRadius={50}
                      style={styles.appleButton}
                      
                    />
                  )
                }
                <Text
                  onPress={this.navigateToForgottenPassword}
                  style={styles.navigateToForgottenPasswordButton}
                >
                  {'Forgotten your password?'}
                </Text>
                <Text
                  onPress={this.navigateToSignup}
                  style={[styles.navigateToForgottenPasswordButton,{marginTop:20}]}
                >
                  {"Don't have an account? Sign up"}
                </Text>

              </ScrollView>
            {/* </ImageBackground> */}
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
    backgroundColor: colors.themeColor.themeBackgroundColor,
    justifyContent: 'center',
    alignItems: 'center',
    // width,
    // paddingHorizontal:20
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
    padding: containerPadding,
    paddingBottom:0,
    // paddingLeft: 20,
    // paddingBottom: 20,
    // shadowColor: colors.charcoal.standard,
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 1,
  },
  
  appleButton: {
    // height: 45,
    width: width - containerPadding*2,
    marginTop: 8,
    borderWidth:2,
    borderColor:colors.grey.standard,
    borderRadius:30,
    padding:27,
  },
  // divider: {
  //   backgroundColor: colors.transparent,
  //   width: width - 30,
  //   marginTop: 15,
  //   marginBottom: 15,
  // },
  dividerOverlay: {
    marginVertical:20,
    backgroundColor: colors.transparent,
  },
  dividerOverlayText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.grey.standard,
  },
  navigateToForgottenPasswordButton: {
    // fontWeight:'700',
    fontFamily:fonts.bold,
    letterSpacing:0.5,
    fontSize: 16,
    marginTop: 50,
    textAlign: 'center',
    color: colors.themeColor.color,
    // textDecorationStyle: 'solid',
    // textDecorationColor: colors.themeColor.color,
    // textDecorationLine: 'underline',
  },

});
