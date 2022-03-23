import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import InputBox from "../../components/Shared/inputBox";
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";
import authScreenStyle from './authScreenStyle';
import fonts from "../../styles/fonts";

const FindAccountScreen = ({ navigation }) => {

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
          <View>
            <View
              style={{
                paddingTop: hp('15%'),
              }}
            >
              <Text style={styles.Text}>Please enter the email address you used when you purchased your Transform challenge:</Text>
              <View style={{ paddingTop: hp("3%") }}>
                <InputBox
                  placeholder="Email address"
                  keyboardType="email-address"
                  inputStyle={styles.inputText}
                />
              </View>
            </View>
            <CustomBtn
              customBtnStyle={{ marginTop: 20 }}
              Title="Find my account"
            />
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              onPress={this.navigateToForgottenPassword}
              style={authScreenStyle.navigateToButton}
            >
              Already have an Account? Sign In
            </Text>
            </TouchableOpacity>
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
    height: hp("5%"),
    width: wp('70%'),
    margin: 12,
    borderWidth: 1,
    fontSize: hp('2%')
  },
  SignInText: {
    fontSize: hp('1.9%')
  },
  inputText: {
    fontFamily: fonts.bold,
  },
})

export default FindAccountScreen;
