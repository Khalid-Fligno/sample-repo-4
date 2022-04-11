import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";
import fonts from "../../styles/fonts";
import { containerPadding } from '../../styles/globalStyles';
import HeaderAuth from '../../components/Auth/Header';
import Toast from 'react-native-toast-message';
import NativeLoader from "../../components/Shared/NativeLoader";
import { auth } from '../../../config/firebase';

const { width } = Dimensions.get("window");

const ForgottenPasswordScreen = ({ navigation }) => {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const emailIsValid = (email) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  }

  const sendPasswordResetEmail = (email) => {
    setLoading(true)

    if (!email) {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Invalid email address entered.',
      });
    }

    if (email && emailIsValid(email)) {
      auth.sendPasswordResetEmail(email)
      .then(() => {
        setLoading(false)
        Toast.show({
          type: 'success',
          text1: 'Successful sent',
          text2: 'A password reset email has been sent to this email address.',
        });
      }).catch(() => {
        setLoading(false)
        Toast.show({
          type: 'error',
          text1: 'Account does not exist',
          text2: 'No account found with that email address.'
        });
      });
    } else {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Pleae enter a valid email address.'
      });
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.black,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          flexDirection: "column",
          backgroundColor: colors.themeColor.themeBackgroundColor,
        }}
      >
        <View>
          <View
            style={{
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 20
              }}
            >
              <Icon
                name="cross"
                color={colors.themeColor.color}
                size={22}
              />
            </TouchableOpacity>
          </View>
          <HeaderAuth />
          <View
            style={{
              alignItems: "center",
              paddingTop: "10%"
            }}
          >
            <TextInput
              style={styles.Input}
              placeholder="Email"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
              autoCapitalize='none'
            />
          </View>
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            bottom: 50,
          }}
        >
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingLeft: wp('10%'),
    paddingRight: wp('10%'),
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  Text: {
    fontSize: hp('3%')
  },
  Input: {
    height: hp("6%"),
    width: width - containerPadding * 2,
    padding: 8,
    margin: 5,
    borderWidth: 1,
    fontSize: hp('2%'),
    alignItems: "center",
  },
  SignInText: {
    fontSize: hp('1.9%')
  },
  inputText: {
    fontFamily: fonts.bold,
  },
})

export default ForgottenPasswordScreen;
