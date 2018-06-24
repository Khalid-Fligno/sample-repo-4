import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, TouchableOpacity, SafeAreaView } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Button, Divider, FormInput, FormValidationMessage } from 'react-native-elements';
import { Facebook } from 'expo';
import Loader from '../../components/Loader';
import Icon from '../../components/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import errors from '../../utils/errors';

const { width } = Dimensions.get('window');

export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: null,
      loading: false,
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
        this.setState({ loading: true });
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        auth.signInAndRetrieveDataWithCredential(credential);
        this.setState({ loading: false });
        this.props.navigation.navigate('App');
      }
    } catch (err) {
      console.log(err);
      this.setState({ error: 'Something went wrong', loading: false });
    }
  }
  login = async (email, password) => {
    this.setState({ loading: true });
    const firebase = require('firebase');
    try {
      const response = await firebase.auth().signInWithEmailAndPassword(email, password);
      if (response) {
        this.setState({ loading: false });
        this.props.navigation.navigate('App');
      }
    } catch (err) {
      const errorCode = err.code;
      this.setState({ error: errors.login[errorCode], loading: false });
    }
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
  render() {
    const {
      email,
      password,
      error,
      loading,
    } = this.state;
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
            title="Log In with Facebook"
            onPress={() => this.loginWithFacebook()}
            containerViewStyle={styles.facebookLoginButtonContainer}
            buttonStyle={styles.facebookLoginButton}
            textStyle={styles.facebookLoginButtonText}
          />
          <Divider style={styles.divider} />
          <View style={styles.dividerOverlay} >
            <Text style={styles.dividerOverlayText}>
              OR
            </Text>
          </View>
          <FormInput
            placeholder="Email"
            value={email}
            returnKeyType="next"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(text) => this.setState({ email: text })}
            onSubmitEditing={() => this.passwordInput.focus()}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
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
            onSubmitEditing={() => this.login(this.state.email, this.state.password)}
            containerStyle={styles.inputContainer}
            inputStyle={styles.input}
          />
          {
            error && (
              <View style={{ marginBottom: 10 }}>
                <FormValidationMessage>
                  {error}
                </FormValidationMessage>
              </View>
            )
          }
          <Button
            title="Log In"
            onPress={() => this.login(this.state.email, this.state.password)}
            containerViewStyle={styles.loginButtonContainer}
            buttonStyle={styles.loginButton}
            textStyle={styles.loginButtonText}
            fontFamily={fonts.bold}
          />
          <Text
            onPress={() => this.navigateToSignup()}
            style={styles.navigateToSignup}
          >
            {"Don't have an account? Sign up here"}
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
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
    borderTopColor: colors.black,
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
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 1,
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
    backgroundColor: colors.grey.standard,
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
  inputContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 0,
  },
  input: {
    width: width - 30,
    padding: 12,
    fontFamily: fonts.bold,
    color: colors.charcoal.standard,
    borderWidth: 1,
    borderColor: colors.grey.standard,
    borderRadius: 4,
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
  navigateToSignup: {
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
});
