import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from "../../../components/Shared/Icon";
import colors from "../../../styles/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../../components/Shared/CustomBtn";
import HeaderAuth from '../../../components/Auth/Header';
import Toast from 'react-native-toast-message';
import NativeLoader from "../../../components/Shared/NativeLoader";
import { useCounter } from '../../../library/useCustomHook/auth/forgottenPasswordHook';
import { styles } from './style';

export const ForgottenPasswordScreen = ({ navigation }) => {

  const {
    email,
    setEmail,
    loading,
    sendPasswordResetEmail
  } = useCounter()

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View>
          <View style={styles.crossIconContainer}>
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
          <View style={styles.formInputContainer}>
            <TextInput
              style={styles.Input}
              placeholder="Email Address"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
              autoCapitalize='none'
            />
          </View>
        </View>
        <View style={styles.navigateButtonContainer}>
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