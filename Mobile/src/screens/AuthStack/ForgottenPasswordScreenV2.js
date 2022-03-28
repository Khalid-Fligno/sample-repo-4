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

const { width } = Dimensions.get("window");

const ForgottenPasswordScreenV2 = ({ navigation }) => {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

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
          <HeaderAuth/>
          <View
            style={{
              alignItems: "center",
              paddingTop: "10%"
            }}
          >
            <TextInput
              style={styles.Input}
              placeholder="Email Address"
              keyboardType="email-address"
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
            onPress={() => getUserInfo(email)}
          />
        </View>
      </View>
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

export default ForgottenPasswordScreenV2;
