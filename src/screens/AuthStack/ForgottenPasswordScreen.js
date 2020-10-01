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
import authScreenStyle from './authScreenStyle';

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
      <SafeAreaView style={authScreenStyle.safeAreaContainer}>
        <StatusBar barStyle="light-content" />
        <View style={[authScreenStyle.container,{justifyContent:'flex-start'}]}>
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
            <View style={{marginTop:30}}>
              <InputBox 
                placeholder="Email address"
                value={email}
                keyboardType="email-address"
                onChangeText={(text) => this.setState({ email: text })}
              />
          
              <CustomBtn 
                  customBtnStyle={{borderRadius:50,marginTop:20 }}
                  Title="SEND PASSWORD RESET EMAIL"
                  onPress={() => this.sendPasswordResetEmail(email)}
                  // customBtnTitleStyle={{fontSize:14,fontFamily:fonts.bold}}
                  titleCapitalise={true}
                  loading={loading}
              />
            </View>
         
      
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
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
  
});
