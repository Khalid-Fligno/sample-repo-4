import React, { useState } from 'react';
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
import NativeLoader from "../../components/Shared/NativeLoader";
import Toast from 'react-native-toast-message';
import { findAccountStyle } from '../../styles/auth/findAccountStyle';
import { useCounter } from '../../library/useCustomHook/auth/findAccountHook';

export const FindAccountScreen = ({ navigation }) => {

  const {
    email,
    setEmail,
    loading,
    getUserInfo
  } = useCounter()

  return (
    <SafeAreaView style={findAccountStyle.safeAreaContainer}>
      <View style={findAccountStyle.container}>
        <View>
          <View style={findAccountStyle.crossIconContainer}>
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
          <View style={findAccountStyle.formContainer}>
            <View style={findAccountStyle.formHeaderContainer}>
              <Text style={findAccountStyle.Text}>
                Please enter the email address you
                used when you purchased your Transform challenge:
              </Text>
            </View>
            <View style={findAccountStyle.formInputContainer}>
              <TextInput
                style={findAccountStyle.Input}
								placeholder="Email"
								keyboardType="email-address"
								onChangeText={setEmail}
								value={email}
                autoCapitalize='none'
              />
            </View>
          </View>
        </View>
        <View style={findAccountStyle.navigateButtonContainer}>
          <CustomBtn
            customBtnStyle={{ marginTop: 20, width: wp("90%") }}
            Title="FIND MY ACCOUNT"
            onPress={() => getUserInfo(email)}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text
              style={findAccountStyle.navigateToButton}
            >
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast/>
      {loading && <NativeLoader />}
    </SafeAreaView>
  )
}