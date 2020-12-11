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
import { containerPadding } from '../../styles/globalStyles';
import BigHeadingWithBackButton from '../../components/Shared/BigHeadingWithBackButton';
import InputBox from '../../components/Shared/inputBox';
import CustomBtn from '../../components/Shared/CustomBtn';
import authScreenStyle from './authScreenStyle';
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
    console.log("???step 1-->")
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
        //Alert.alert('userid', uid);
        //Alert.alert('useremailid1', data.email);
        await AsyncStorage.setItem('uid', uid);
        db.collection('users').doc(uid).set(data)
          .then(async () => {
            this.setState({ loading: false });
            //Alert.alert('userid2', uid);
            //Alert.alert('useremailid', data.email);
            appsFlyer.trackEvent('af_complete_registration', { af_registration_method: 'Apple' });
            // this.props.navigation.navigate('Subscription', { name: givenName, specialOffer: this.state.specialOffer });
            await this.addChallengesAfterSignUp(email,uid);
            this.props.navigation.navigate('Onboarding1', { name: givenName, specialOffer: this.state.specialOffer });
            auth.currentUser.sendEmailVerification().then(() => {
              Alert.alert('Please verify email', 'An email verification link has been sent to your email address');
            });
          })
          .catch(() => {
            this.setState({ loading: false });
            Alert.alert('Could not create your account', 'Please try again or contact support.');
          });
      })
      .catch((error) => {
        //Alert.alert('error', error);
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
        await this.addChallengesAfterSignUp(data.email,data.id);
        auth.currentUser.sendEmailVerification().then(() => {
          Alert.alert('Please verify email', 'An email verification link has been sent to your email address');
          // this.props.navigation.navigate('Subscription', { name: profile.first_name, specialOffer: this.state.specialOffer });
          this.props.navigation.navigate('Onboarding1', { name: first_name, specialOffer: this.state.specialOffer });
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
  addChallengesAfterSignUp = async(email,uid) =>{
    const shopifyRegisteredUser=  await this.getUserRegisterdFromShopify(email);
    console.log("shopifyRegisteredUser",shopifyRegisteredUser);
    if(shopifyRegisteredUser != undefined){
    const challengeDetail=  await this.getChallengeDetails(shopifyRegisteredUser);
    console.log("challengeDetail",challengeDetail);
    if(challengeDetail !=undefined && shopifyRegisteredUser.hasOwnProperty('challenge') && shopifyRegisteredUser.challenge ){
      const challenge =await db.collection('users').doc(uid).collection('challenges').doc(challengeDetail.id);
      challenge.set(challengeDetail,{merge:true});
      //delete old user 
      if(shopifyRegisteredUser != undefined){
      await db.collection('users').doc(shopifyRegisteredUser.id).collection('challenges').doc(challengeDetail.id).delete();
      await db.collection('users').doc(shopifyRegisteredUser.id).delete();
      console.log("old user is deleted");
    }
    }
   }
  }
  getUserRegisterdFromShopify = async(emailId) => {
    const userRef =  await db.collection('users').where("email","==",emailId).where("challenge","==",true).get();
    if (userRef.size > 0) {
      return userRef.docs[0].data();
  }     
}
  getChallengeDetails = async(user) => {
  let challenges=[];
  const challengeRef =await db.collection("users").doc(user.id).collection("challenges").get();
  if (challengeRef.size > 0) {
    return challengeRef.docs[0].data();
  }     
    //return challenges;
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
      console.log("step1");
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await response.user.updateProfile({ displayName: `${firstName} ${lastName}` });
      const { region } = Localization;
      const { uid } = response.user;
      let data = {
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
        .then(async () => {
          this.setState({ loading: false });
          appsFlyer.trackEvent('af_complete_registration', { af_registration_method: 'Email' });
          // this.props.navigation.navigate('Subscription', { name: firstName, specialOffer: this.state.specialOffer });
                // check if user buy some challenges from shopify  
          await this.addChallengesAfterSignUp(email,uid); 
          this.props.navigation.navigate('Onboarding1', { name: firstName, specialOffer: this.state.specialOffer });
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
        <SafeAreaView style={authScreenStyle.safeAreaContainer} >
          <View style={authScreenStyle.container}>
            <StatusBar barStyle="light-content" />

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
                {/* <Text style={styles.headerText1}>
                  CREATE YOUR
                </Text>
                <Text style={styles.headerText1}>
                  ACCOUNT TO
                </Text>
                <Text style={styles.headerText2}>
                  get started
                </Text> */}

                <View >
                 <BigHeadingWithBackButton 
                  isBackButton={false}
                  bigTitleText="Create account"
                  isBigTitle={true}
                  // bigTitleStyle={{width:width-containerPadding*2}}
                />
                <KeyboardAvoidingView keyboardVerticalOffset={40} behavior="position" enabled>
                <InputBox 
                   placeholder="First Name"
                   value={firstName}
                   onChangeText={(text) => this.setState({ firstName: text })}
                />
                 <InputBox 
                   placeholder="Last Name"
                   value={lastName}
                   onChangeText={(text) => this.setState({ lastName: text })}
                />
                 <InputBox 
                   placeholder="Email address"
                   value={email}
                   keyboardType="email-address"
                   onChangeText={(text) =>{this.setState({ email: text })}}
                />
                 <InputBox 
                   errorMessage={error && error}
                   placeholder="Password"
                   value={password}
                   onChangeText={(text) => this.setState({ password: text })}
                   onSubmitEditing={() => this.signup(firstName, lastName, email.toLowerCase(), password)}
                   secureTextEntry
                   returnKeyType="go"
                />
                 
                </KeyboardAvoidingView>
                <CustomBtn 
                  customBtnStyle={{borderRadius:50,marginTop:20 }}
                  Title="Create new account"
                  customBtnTitleStyle={{fontWeight:'500',letterSpacing:0.7}}
                  onPress={() => this.signup(firstName, lastName, email.toLowerCase(), password)}
                />
              
                <View style={authScreenStyle.dividerOverlay}>
                  <Text style={authScreenStyle.dividerOverlayText}>
                    OR
                  </Text>
                </View>
             
                <CustomBtn 
                      customBtnStyle={{borderRadius:50,borderColor:colors.grey.standard}}
                      outline={true}
                      Title="Create account with Facebook"
                      customBtnTitleStyle={{fontWeight:'500',letterSpacing:0.7,color:colors.transparentBlackDark}}
                      onPress={this.signupWithFacebook}
                      leftIcon={true}
                      leftIconUrl={require('../../../assets/icons/facebook.png')}
                />
                {
                  appleSignInAvailable && (
                    <AppleAuthentication.AppleAuthenticationButton
                      onPress={this.onSignInWithApple}
                      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
                      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
                      cornerRadius={4}
                      style={authScreenStyle.appleButton}
                    />
                  )
                }
                  <Text
                  onPress={this.navigateToLogin}
                  style={[authScreenStyle.navigateToButton,{paddingBottom:20}]}
                  >
                  I already have an account? Sign in 
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

