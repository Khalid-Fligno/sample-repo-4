import React from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { StackActions, NavigationActions } from "react-navigation";
import { Button, Divider, Input } from "react-native-elements";
import * as Haptics from "expo-haptics";
import * as Facebook from "expo-facebook";
// import * as Sentry from 'sentry-expo';
import firebase from "firebase";
import appsFlyer from "react-native-appsflyer";
import * as Crypto from "expo-crypto";
import * as AppleAuthentication from "expo-apple-authentication";
import { db, auth } from "../../../config/firebase";
import {
  compare,
  compareInApp,
  validateReceiptProduction,
  validateReceiptSandbox,
} from "../../../config/apple";
import { restoreAndroidPurchases } from "../../../config/android";
import { RestoreSubscriptions } from "../../utils/subscription";
import NativeLoader from "../../components/Shared/NativeLoader";
import Icon from "../../components/Shared/Icon";
import FacebookButton from "../../components/Auth/FacebookButton";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import errors from "../../utils/errors";
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";
import CustomBtn from "../../components/Shared/CustomBtn";
import globalStyle, { containerPadding } from "../../styles/globalStyles";
import InputBox from "../../components/Shared/inputBox";
import BigHeadingWithBackButton from "../../components/Shared/BigHeadingWithBackButton";
import authScreenStyle from "./authScreenStyle";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {
  getChallengeDetails,
  getLatestChallenge,
  hasChallenges,
} from "../../utils/challenges";
import moment from "moment";
import momentTimezone from "moment-timezone";
const { InAppUtils } = NativeModules;
const { width } = Dimensions.get("window");
const getRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
import { HelperText } from "react-native-paper";

const styles = StyleSheet.create({
  inputText: {
    fontFamily: fonts.bold,
  },
});

let isFocused = false;
export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null,
      loading: false,
      specialOffer: props.navigation.getParam("specialOffer", undefined),
      appleSignInAvailable: undefined,
    };
  }
  componentDidMount = async () => {
    const appleSignInAvailable = await AppleAuthentication.isAvailableAsync();
    this.setState({ appleSignInAvailable });
  };
  onSignInWithApple = async () => {
    const nonce = getRandomString(32);
    let nonceSHA256 = "";
    try {
      nonceSHA256 = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce
      );
    } catch (e) {
      Alert.alert("Sign up could not be completed", "Please try again.");
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
      console.log("LLLL", credential);
      if (credential.user) {
        this.signInWithApple({
          identityToken: credential.identityToken,
          nonce,
          fullName: credential.fullName,
        });
      }
    } catch (e) {
      this.setState({ loading: false });
      if (e.code === "ERR_CANCELED") {
        Alert.alert("Login cancelled");
      } else {
        Alert.alert("Something went wrong");
      }
    }
  };
  signInWithApple = async ({ identityToken, nonce }) => {
    const provider = new firebase.auth.OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: identityToken,
      rawNonce: nonce,
    });
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    firebase
      .auth()
      .signInWithCredential(credential)
      // Signed in to Firebase Auth
      .then(async (appleuser) => {
        const { uid } = appleuser.user;
        appsFlyer.trackEvent("af_login");
        await AsyncStorage.setItem("uid", uid);
        db.collection("users")
          .doc(uid)
          .get()
          .then(async (doc) => {
            if ((await doc.data().fitnessLevel) !== undefined) {
              await AsyncStorage.setItem(
                "fitnessLevel",
                await doc.data().fitnessLevel.toString()
              );
            }
            const { subscriptionInfo = undefined } = await doc.data();
            if (subscriptionInfo === undefined) {
              if (await hasChallenges(uid)) {
                await goToAppScreen(doc);
              } else {
                // NO PURCHASE INFORMATION SAVED
                // this.setState({ loading: false });
                this.props.navigation.navigate("Subscription", {
                  specialOffer: this.state.specialOffer,
                });
              }
            } else if (subscriptionInfo.expiry < Date.now()) {
              if (await hasChallenges(uid)) {
                await this.goToAppScreen(doc);
              } else {
                // EXPIRED
                InAppUtils.restorePurchases(async (error, response) => {
                  if (error) {
                    // Sentry.captureException(error);
                    this.setState({ loading: false });
                    Alert.alert(
                      "iTunes Error",
                      "Could not connect to iTunes store."
                    );
                  } else {
                    if (response.length === 0) {
                      this.props.navigation.navigate("Subscription", {
                        specialOffer: this.state.specialOffer,
                      });
                      return;
                    }
                    const sortedPurchases = response.slice().sort(compare);
                    try {
                      const validationData = await this.validate(
                        sortedPurchases[0].transactionReceipt
                      );
                      if (validationData === undefined) {
                        Alert.alert("Receipt validation error");
                        return;
                      }
                      const sortedInApp = validationData.receipt.in_app
                        .slice()
                        .sort(compareInApp);
                      if (
                        sortedInApp[0] &&
                        sortedInApp[0].expires_date_ms > Date.now()
                      ) {
                        // Alert.alert('Your subscription has been auto-renewed');
                        const userRef = db.collection("users").doc(uid);
                        const data = {
                          subscriptionInfo: {
                            receipt: sortedPurchases[0].transactionReceipt,
                            expiry:
                              validationData.latest_receipt_info.expires_date,
                          },
                        };
                        await userRef.set(data, { merge: true });
                        this.setState({ loading: false });
                        this.props.navigation.navigate("App");
                      } else if (
                        sortedInApp[0] &&
                        sortedInApp[0].expires_date_ms < Date.now()
                      ) {
                        Alert.alert(
                          "Expired",
                          "Your most recent subscription has expired"
                        );
                        this.props.navigation.navigate("Subscription");
                      } else {
                        Alert.alert("Something went wrong");
                        this.props.navigation.navigate("Subscription", {
                          specialOffer: this.state.specialOffer,
                        });
                        return;
                      }
                    } catch (err) {
                      Alert.alert(
                        "Error",
                        "Could not retrieve subscription information"
                      );
                      this.props.navigation.navigate("Subscription", {
                        specialOffer: this.state.specialOffer,
                      });
                    }
                  }
                });
              }
            } else {
              // RECEIPT STILL VALID
              this.setState({ loading: false });
              if (await !doc.data().onboarded) {
                this.props.navigation.navigate("Onboarding1");
                return;
              }
              this.props.navigation.navigate("App");
            }
          });
      })
      .catch(() => {
        this.setState({ loading: false });
        Alert.alert(
          "Login could not be completed",
          "Please try again or contact support."
        );
      });
  };
  loginWithFacebook = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        "1825444707513470",
        {
          permissions: ["public_profile", "email"],
        }
      );
      if (type === "success") {
        this.setState({ loading: true });
        appsFlyer.trackEvent("af_login");
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const authResponse = await firebase
          .auth()
          .signInWithCredential(credential);
        const { uid } = authResponse.user;
        await AsyncStorage.setItem("uid", uid);
        db.collection("users")
          .doc(uid)
          .get()
          .then(async (doc) => {
            if ((await doc.data().fitnessLevel) !== undefined) {
              await AsyncStorage.setItem(
                "fitnessLevel",
                await doc.data().fitnessLevel.toString()
              );
            }
            const { subscriptionInfo = undefined } = await doc.data();
            if (subscriptionInfo === undefined) {
              if (await hasChallenges(uid)) {
                await this.goToAppScreen(doc);
              } else {
                // NO PURCHASE INFORMATION SAVED
                // this.setState({ loading: false });
                this.props.navigation.navigate("Subscription", {
                  specialOffer: this.state.specialOffer,
                });
              }
            } else if (subscriptionInfo.expiry < Date.now()) {
              // EXPIRED
            } else {
              // RECEIPT STILL VALID
              this.setState({ loading: false });
              if (await !doc.data().onboarded) {
                this.props.navigation.navigate("Onboarding1");
                return;
              }
              this.props.navigation.navigate("App");
            }
          });
      }
    } catch (err) {
      if (
        err.message &&
        err.message.includes(
          "An account already exists with the same email address"
        )
      ) {
        Alert.alert(
          "Facebook signup failed",
          "An account already exists with the same email address but different sign-in credentials."
        );
      }
      this.setState({ error: "Something went wrong", loading: false });
    }
  };

  storePurchase = async (subscriptionInfo, onboarded) => {
    const restoreSubscriptions = new RestoreSubscriptions(this.props);
    if (!subscriptionInfo.platform) {
      subscriptionInfo.platform = "ios";
    }
    try {
      await restoreSubscriptions.restore(subscriptionInfo, onboarded);
    } catch (ex) {
      if (Platform.OS === "ios") {
        await this.iOSStorePurchases(onboarded);
      } else if (Platform.OS === "android") {
        //await restoreSubscriptions.restore(subscriptionInfo, onboarded);
        await restoreAndroidPurchases(this.props);
      }
    }
  };

  iOSStorePurchases = async (onboarded) => {
    InAppUtils.restorePurchases(async (error, response) => {
      if (error) {
        // Sentry.captureException(error);
        this.setState({ loading: false });
        Alert.alert("iTunes Error", "Could not connect to iTunes store.");
      } else {
        if (response.length === 0) {
          this.props.navigation.navigate("Subscription", {
            specialOffer: this.state.specialOffer,
          });
          return;
        }
        const sortedPurchases = response.slice().sort(compare);
        try {
          const validationData = await this.validate(
            sortedPurchases[0].transactionReceipt
          );
          if (validationData === undefined) {
            Alert.alert("Receipt validation error");
            return;
          }
          const sortedInApp = validationData.receipt.in_app
            .slice()
            .sort(compareInApp);
          if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
            // Alert.alert('Your subscription has been auto-renewed');
            const userRef = db.collection("users").doc(uid);
            const data = {
              subscriptionInfo: {
                receipt: sortedPurchases[0].transactionReceipt,
                expiry: validationData.latest_receipt_info.expires_date,
              },
            };
            await userRef.set(data, { merge: true });
            this.setState({ loading: false });
            if (onboarded) {
              this.props.navigation.navigate("Onboarding1");
              return;
            }
            this.props.navigation.navigate("App");
          } else if (
            sortedInApp[0] &&
            sortedInApp[0].expires_date_ms < Date.now()
          ) {
            Alert.alert("Expired", "Your most recent subscription has expired");
            this.props.navigation.navigate("Subscription");
          } else {
            Alert.alert("Something went wrong");
            this.props.navigation.navigate("Subscription", {
              specialOffer: this.state.specialOffer,
            });
            return;
          }
        } catch (err) {
          Alert.alert("Error", "Could not retrieve subscription information");
          this.props.navigation.navigate("Subscription", {
            specialOffer: this.state.specialOffer,
          });
        }
      }
    });
  };
  getUserRegisterdFromShopify = async (emailId) => {
    const userRef = await db
      .collection("users")
      .where("email", "==", emailId)
      .get();
    if (userRef.size > 0) {
      return userRef.docs[0].data();
    }
  };
  goToAppScreen = async (doc) => {
    // RECEIPT STILL VALID
    this.setState({ loading: false });
    if (await !doc.data().onboarded) {
      this.props.navigation.navigate("Onboarding1");
      return;
    }
    this.props.navigation.navigate("App");
  };
  login = async (email, password) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    this.setState({ loading: true });
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      const authResponse = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      if (authResponse) {
        const { uid } = authResponse.user;
        await AsyncStorage.setItem("uid", uid);
        appsFlyer.trackEvent("af_login");
        const users = db.collection('users');
        const snapshot = await users.where('email', '==', authResponse.user.email).get();
        
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  

        snapshot.forEach(doc => {
          if (doc.id === uid) {
            db.collection("users")
              .doc(uid)
              .get()
              .then(async (doc) => {
                if ((await doc.data().fitnessLevel) !== undefined) {
                  await AsyncStorage.setItem(
                    "fitnessLevel",
                    await doc.data().fitnessLevel.toString()
                  );
                }
                const { subscriptionInfo = undefined, onboarded = false } =
                  await doc.data();
                if (subscriptionInfo === undefined) {
                  console.log("check has challenge", uid);
                  if (await hasChallenges(uid)) {
                    await this.goToAppScreen(doc);
                  } else {
                    // NO PURCHASE INFORMATION SAVED
                    this.setState({ loading: false });
                    this.props.navigation.navigate("Subscription", {
                      specialOffer: this.state.specialOffer,
                    });
                  }
                } else if (subscriptionInfo.expiry < Date.now()) {
                  console.log("check has challenge", uid);
                  if (await hasChallenges(uid)) {
                    await this.goToAppScreen(doc);
                  } else {
                    // EXPIRED
                    await this.storePurchase(subscriptionInfo, onboarded);
                  }
                } else {
                  //go to app
                  await this.goToAppScreen(doc);
                }
              });
          } else {
            db.collection("users")
              .doc(uid)
              .set(doc.data());
            // doc.ref.delete(); 
            db.collection("users")
              .doc(uid)
              .get()
              .then(async (doc) => {
                if ((await doc.data().fitnessLevel) !== undefined) {
                  await AsyncStorage.setItem(
                    "fitnessLevel",
                    await doc.data().fitnessLevel.toString()
                  );
                }
                const { subscriptionInfo = undefined, onboarded = false } =
                  await doc.data();
                if (subscriptionInfo === undefined) {
                  console.log("check has challenge", uid);
                  if (await hasChallenges(uid)) {
                    await this.goToAppScreen(doc);
                  } else {
                    // NO PURCHASE INFORMATION SAVED
                    this.setState({ loading: false });
                    this.props.navigation.navigate("Subscription", {
                      specialOffer: this.state.specialOffer,
                    });
                  }
                } else if (subscriptionInfo.expiry < Date.now()) {
                  console.log("check has challenge", uid);
                  if (await hasChallenges(uid)) {
                    await this.goToAppScreen(doc);
                  } else {
                    // EXPIRED
                    await this.storePurchase(subscriptionInfo, onboarded);
                  }
                } else {
                  //go to app
                  await this.goToAppScreen(doc);
                }
              }); 
          }
        });
      }
    } catch (err) {
      const errorCode = err.code;
      this.setState({ error: errors.login[errorCode], loading: false });
    }
  };
  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(
      async () => {
        const validationDataSandbox = await validateReceiptSandbox(receiptData);
        return validationDataSandbox;
      }
    );
    if (validationData !== undefined) {
      return validationData;
    }
    return undefined;
  };
  navigateToSignup = () => {
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: "Landing" }),
        NavigationActions.navigate({ routeName: "Signup" }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  };
  navigateToForgottenPassword = () => {
    this.props.navigation.navigate("ForgottenPassword");
  };
  render() {
    const { email, password, error, loading, appleSignInAvailable } =
      this.state;
    return (
      <React.Fragment>
        <SafeAreaView style={authScreenStyle.safeAreaContainer}>
          <StatusBar barStyle="light-content" />
          <View style={authScreenStyle.container}>
            {/* <ImageBackground
              source={require('../../../assets/images/signup-screen-background.jpg')}
              style={styles.imageBackground}
            > */}
            <ScrollView contentContainerStyle={authScreenStyle.scrollView}>
              <View style={authScreenStyle.closeIconContainer}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}
                  style={authScreenStyle.closeIconButton}
                >
                  <Icon
                    name="cross"
                    color={colors.themeColor.color}
                    size={22}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <BigHeadingWithBackButton
                  isBackButton={false}
                  bigTitleText="Sign in"
                  isBigTitle={true}
                  // bigTitleStyle={{width:width-containerPadding*2}}
                />
                <InputBox
                  placeholder="Email address"
                  value={email}
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    this.setState({ email: text });
                  }}
                  inputStyle={styles.inputText}
                  //  onSubmitEditing={() => {this.passwordInput.focus()}}
                />
                <HelperText
                  type="info"
                  visible={true}
                  style={(colors.grey.standard, styles.inputText)}
                >
                  Enter email used for challenge purchase on fitazfk.com.
                </HelperText>
                <InputBox
                  errorMessage={error && error}
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => {
                    this.setState({ password: text });
                  }}
                  onSubmitEditing={() => this.login(email, password)}
                  secureTextEntry
                  returnKeyType="go"
                  // inputStyle={styles.inputText}
                  //  ref={(input) => this.passwordInput = input}
                />

                <CustomBtn
                  customBtnStyle={{ marginTop: 20 }}
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
                <View style={authScreenStyle.dividerOverlay}>
                  <Text style={authScreenStyle.dividerOverlayText}>OR</Text>
                </View>
                {/* <FacebookButton
                    title="SIGN IN WITH FACEBOOK"
                    onPress={this.loginWithFacebook}
                  /> */}
                <CustomBtn
                  customBtnStyle={{
                    borderColor: colors.grey.standard,
                  }}
                  outline={true}
                  Title="Sign in with Facebook"
                  customBtnTitleStyle={{ color: colors.transparentBlackDark }}
                  onPress={this.loginWithFacebook}
                  leftIcon={true}
                  leftIconUrl={require("../../../assets/icons/facebook.png")}
                />
                {appleSignInAvailable && (
                  <AppleAuthentication.AppleAuthenticationButton
                    onPress={this.onSignInWithApple}
                    buttonType={
                      AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                    }
                    buttonStyle={
                      AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                    }
                    cornerRadius={hp("3.5%")}
                    style={authScreenStyle.appleButton}
                  />
                )}
                <Text
                  onPress={this.navigateToForgottenPassword}
                  style={authScreenStyle.navigateToButton}
                >
                  {"Forgotten your password?"}
                </Text>
                <Text
                  onPress={this.navigateToSignup}
                  style={[authScreenStyle.navigateToButton, { marginTop: 20 }]}
                >
                  {"Don't have an account? Sign up"}
                </Text>
              </View>
            </ScrollView>
            {/* </ImageBackground> */}
          </View>
        </SafeAreaView>
        {loading && <NativeLoader />}
      </React.Fragment>
    );
  }
}
