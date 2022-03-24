import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import InputBox from "../../components/Shared/inputBox";
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";
import authScreenStyle from './authScreenStyle';
import fonts from "../../styles/fonts";
import { db } from '../../../config/firebase';
import globalStyle, { containerPadding } from '../../styles/globalStyles';
import HeaderAuth from '../../components/Auth/Header';
import { IMAGE } from "../../library/images";

const { width } = Dimensions.get("window");

const FindAccountScreen = ({ navigation }) => {

  const [email, setEmail] = useState(null)

  const getUser = async (email) => {
    const userRef = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userRef.size > 0) {
      return userRef.docs[0].data();
    } else {
      return undefined;
    }
  }

  const getUserInfo = async (email) => {
    console.log('email: ', email)
    const userData = await getUser(email);
    if (!userData?.id) {
      console.log("Incorrect email")
    } else {
      const firstName = userData.firstName
      const lastName = userData.lastName
      console.log('firstName: ', firstName)
      console.log('lastName: ', lastName)

      navigation.navigate('Signup', { userData })
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
          <View
            style={{
              alignItems: "center",
              padding: 10
            }}
          >
            <Image
              source={IMAGE.BRAND_MARK}
              style={globalStyle.fitazfkIcon}
              resizeMode="contain"
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "10%"
            }}
          >
            <View
              style={{
                width: wp("90%")
              }}
            >
              <Text style={styles.Text}>
                Please enter the email address you
                used when you purchased your Transform challenge:
              </Text>
            </View>
            <View style={{ paddingTop: hp("3%") }}>
              <TextInput
                style={styles.Input}
                placeholder="Email Address"
              />
            </View>
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
            Title="Find my account"
            onPress={() => getUserInfo(email)}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={authScreenStyle.navigateToButton}
            >
              Already have an Account? Sign In
            </Text>
          </TouchableOpacity>
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
    fontSize: hp('3%'),
    textAlign: 'left'
  },
  Input: {
    height: hp("6%"),
    width: width - containerPadding * 2,
    padding: 8,
    margin: 10,
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

export default FindAccountScreen;
