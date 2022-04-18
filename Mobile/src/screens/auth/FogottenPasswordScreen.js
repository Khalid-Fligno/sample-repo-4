import React from 'react';
import {
  View,
  SafeAreaView,
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
import { useCounter } from '../../library/useCustomHook/auth/forgottenPasswordHook';
import { forgottenPasswordStyle } from '../../styles/auth/forgottenPasswordStyle';

export const ForgottenPasswordScreen = ({ navigation }) => {

  const {
    email,
    setEmail,
    loading,
    sendPasswordResetEmail
  } = useCounter()

  return (
    <SafeAreaView style={forgottenPasswordStyle.safeAreaContainer}>
      <View style={forgottenPasswordStyle.container}>
        <View>
          <View style={forgottenPasswordStyle.crossIconContainer}>
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
          <View style={forgottenPasswordStyle.formInputContainer}>
            <TextInput
              style={forgottenPasswordStyle.Input}
              placeholder="Email Address"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
              autoCapitalize='none'
            />
          </View>
        </View>
        <View style={forgottenPasswordStyle.navigateButtonContainer}>
          <CustomBtn
            customBtnStyle={{ marginTop: 20, width: wp("90%") }}
            Title="SEND PASSWORD RESET EMAIL"
            onPress={() => sendPasswordResetEmail(email)}
          />
        </View>
      </View>
      <Toast />
      {loading && <NativeLoader />}
    </SafeAreaView>
  )
}