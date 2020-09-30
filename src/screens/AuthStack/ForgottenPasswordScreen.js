import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Text,
  ImageBackground,
} from 'react-native';
import { Input } from 'react-native-elements';
import { DotIndicator } from 'react-native-indicators';
import { auth } from '../../../config/firebase';
import Icon from '../../components/Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import InputBox from '../../components/Shared/inputBox';
import CustomBtn from '../../components/Shared/CustomBtn';
import { containerPadding } from '../../styles/globalStyles';

const { width } = Dimensions.get('window');

export default class ForgottenPasswordScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      loading: false,
    };
  }
  emailIsValid = (email) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  }
  sendPasswordResetEmail = (email) => {
    this.setState({ loading: true });
    if (!email) {
      this.setState({ loading: false });
      Alert.alert('Invalid email address entered');
      return;
    }
    if (email && this.emailIsValid(email)) {
      auth.sendPasswordResetEmail(email).then(() => {
        this.setState({ loading: false });
        Alert.alert(`${email}`, 'A password reset email has been sent to this email address');
      }).catch(() => {
        this.setState({ loading: false });
        Alert.alert('Account does not exist', 'No account found with that email address');
      });
    } else {
      this.setState({ loading: false });
      Alert.alert('Invalid email', 'Pleae enter a valid email address');
    }
  }
  render() {
    const {
      email,
      loading,
    } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
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
            <InputBox 
              placeholder="Email address"
              value={email}
              keyboardType="email-address"
              onChangeText={(text) => this.setState({ email: text })}
            />
            {/* <Input
              placeholder="Email"
              placeholderTextColor={colors.transparentWhiteLight}
              value={email}
              returnKeyType="next"
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(text) => this.setState({ email: text })}
              containerStyle={styles.inputComponentContainer}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
              clearButtonMode="while-editing"
            /> */}
            <CustomBtn 
                customBtnStyle={{borderRadius:50,width:width -containerPadding*2,marginTop:20 }}
                Title="SEND PASSWORD RESET EMAIL"
                onPress={() => this.sendPasswordResetEmail(email)}
                customBtnTitleStyle={{fontSize:14,fontFamily:fonts.bold}}
                loading={loading}
              />
            {/* <TouchableOpacity
              onPress={() => this.sendPasswordResetEmail(email)}
              style={styles.loginButton}
            >
              {
                loading ? (
                  <DotIndicator
                    color={colors.white}
                    count={3}
                    size={6}
                  />
                ) : (
                  <Text style={styles.loginButtonText}>
                    SEND PASSWORD RESET EMAIL
                  </Text>
                )
              }
            </TouchableOpacity> */}
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
    backgroundColor: colors.offWhite,
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    width: undefined,
    height: undefined,
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
    // shadowColor: colors.charcoal.standard,
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 1,
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
  loginButton: {
    backgroundColor: colors.coral.standard,
    height: 50,
    width: width - 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: 7,
    marginBottom: 7,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  loginButtonText: {
    marginTop: 4,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.white,
  },
});
