import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";
import HeaderAuth from '../../components/Auth/Header';
import Toast from 'react-native-toast-message';
import NativeLoader from "../../components/Shared/NativeLoader";
import { useCounter } from '../../library/useCustomHook/signupHook';
import { signupStyle } from '../../styles/auth/signupStyle';

export const SignupScreen = ({ navigation }) => {

  const userData = navigation.getParam("userData", undefined)
  const {
    email,
    setEmail,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    signup
  } = useCounter(navigation)

  return (
    <SafeAreaView style={signupStyle.safeAreaContainer}>
      <View style={signupStyle.container}>
        <View>
          <View style={signupStyle.crossIconContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="cross"
                color={colors.themeColor.color}
                size={22}
              />
            </TouchableOpacity>
          </View>
          <HeaderAuth />
          <View style={signupStyle.formContainer}>
            <View style={signupStyle.formHeaderContainer}>
              {
                userData ?
                  <Text style={signupStyle.Text}>
                    Create a password to complete your account
                  </Text>
                  :
                  <Text style={signupStyle.Text}>
                    Create an Account:
                  </Text>
              }
            </View>
            <View style={signupStyle.formInputContainer}>
              <TextInput
                style={signupStyle.Input}
                placeholder="First Name"
                value={userData ? userData.firstName : firstName}
                onChangeText={(text) => setFirstName(text)}
                editable={!userData ? true : false}
              />
              <TextInput
                style={signupStyle.Input}
                placeholder="Last Name"
                value={userData ? userData.lastName : lastName}
                onChangeText={(text) => setLastName(text)}
                editable={!userData ? true : false}
              />
              <TextInput
                style={signupStyle.Input}
                placeholder="Email"
                keyboardType="email-address"
                value={userData ? userData.email : email}
                onChangeText={(text) => setEmail(text)}
                editable={!userData ? true : false}
                autoCapitalize='none'
              />
              <TextInput
                style={signupStyle.Input}
                placeholder="Create Password"
                secureTextEntry
                returnKeyType="go"
                value={password}
                onChangeText={setPassword}
                autoCapitalize='none'
              />
              <TextInput
                style={signupStyle.Input}
                placeholder="Confirm Password"
                secureTextEntry
                returnKeyType="go"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize='none'
              />
            </View>
          </View>
        </View>
        <View style={signupStyle.navigateButtonContainer}>
          <CustomBtn
            customBtnStyle={{ marginTop: 20, width: wp("90%") }}
            Title="GET STARTED!"
            onPress={() => userData ?
              signup(
                userData.firstName,
                userData.lastName,
                userData.email.toLowerCase(),
                password,
                confirmPassword
              )
              :
              signup(
                firstName,
                lastName,
                email.toLowerCase(),
                password,
                confirmPassword
              )
            }
          />
          {
            !userData ?
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text
                  style={signupStyle.navigateToButton}
                >
                  Already have an Account? Sign In
                </Text>
              </TouchableOpacity>
              :
              null
          }

        </View>
      </View>
      <Toast />
      {loading && <NativeLoader />}
    </SafeAreaView>
  )
}