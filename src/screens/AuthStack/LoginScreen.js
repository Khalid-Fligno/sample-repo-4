import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Button, Divider } from 'react-native-elements';
import { Facebook } from 'expo';
import Icon from '../../components/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class LoginScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
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
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        auth.signInAndRetrieveDataWithCredential(credential);
        this.props.navigation.navigate('App');
      }
    } catch (err) {
      console.log(err);
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
                size={25}
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
          <Button
            title="Log In"
            onPress={() => this.signup()}
            containerViewStyle={styles.loginButtonContainer}
            buttonStyle={styles.loginButton}
            textStyle={styles.loginButtonText}
            fontFamily={fonts.bold}
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
    backgroundColor: colors.grey.standard,
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
