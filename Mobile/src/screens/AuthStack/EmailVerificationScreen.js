import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { auth } from '../../config/firebase';
import Loader from '../../components/Shared/Loader';
import Icon from '../../components/Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class EmailVerificationScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  resendVerificationEmail = () => {
    this.setState({ loading: true });
    const { email, password } = this.props.navigation.state.params;
    auth.signInWithEmailAndPassword(email, password);
    const user = auth.currentUser;
    user.sendEmailVerification().then(() => {
      this.setState({ loading: false });
      this.props.navigation.navigate('Login');
    }).catch((err) => {
      this.setState({ loading: false });
      Alert.alert('Email verification send error', `${err}`);
    });
  }
  render() {
    const {
      loading,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer} >
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
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
          <View style={styles.contentContainer}>
            <Text style={styles.text}>
              {'A verification email has been sent to your email address.\n'}
            </Text>
            <Text style={styles.text}>
              {'Please verify your email address and then login to continue.'}
            </Text>
            <Icon
              name="email"
              color={colors.charcoal.standard}
              size={100}
              style={styles.icon}
            />
            <Text style={styles.text}>
              {'If the verification email is not in your inbox, check your junk mail.\n'}
            </Text>
            <Text style={styles.text}>
              {'If you accidentally deleted it, you can re-send it by pressing below.'}
            </Text>
            <Text
              onPress={this.resendVerificationEmail}
              style={styles.resendEmailLink}
            >
              Re-send verification email
            </Text>
          </View>
          <Loader
            loading={loading}
            color={colors.charcoal.standard}
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
  contentContainer: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.standard,
    fontSize: 16,
    textAlign: 'center',
  },
  icon: {
    marginTop: 15,
    marginBottom: 15,
  },
  resendEmailLink: {
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
