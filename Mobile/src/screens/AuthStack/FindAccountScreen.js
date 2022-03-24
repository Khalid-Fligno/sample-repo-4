import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions
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
import { containerPadding } from '../../styles/globalStyles';
import HeaderAuth from '../../components/Auth/Header';

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
    <SafeAreaView style={authScreenStyle.safeAreaContainer}>
      <View style={authScreenStyle.container}>
        <ScrollView contentContainerStyle={authScreenStyle.scrollView}>
          <View style={authScreenStyle.closeIconContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={authScreenStyle.closeIconButton}
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
              display: 'flex',
              flexDirection: 'column',
              // paddingTop: hp('15%'),
              justifyContent: 'space-between',
              // height: 500
            }}>
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text style={styles.Text}>Please enter the email address you used when you purchased your Transform challenge:</Text>
              <View style={{ paddingTop: hp("3%") }}>
                <TextInput
                  style={styles.Input}
                  placeholder="Email Address"
                />
              </View>
            </View>
            <View>
              <CustomBtn
                customBtnStyle={{ marginTop: 20 }}
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
        </ScrollView>
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
