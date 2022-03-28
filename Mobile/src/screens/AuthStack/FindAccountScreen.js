import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
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
import authScreenStyleV2 from './authScreenStyleV2';
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
    <SafeAreaView style={authScreenStyleV2.safeAreaContainer}>
			<View style={authScreenStyleV2.container}>
				<View>
					<View style={authScreenStyleV2.crossIconContainer}>
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
          <HeaderAuth/>
					<View style={authScreenStyleV2.formContainer}>
						<View style={authScreenStyleV2.formHeaderContainer}>
							<Text style={styles.Text}>
                Please enter the email address you
                used when you purchased your Transform challenge:
							</Text>
						</View>
						<View style={authScreenStyleV2.formInputContainer}>
							<TextInput
								style={styles.Input}
								placeholder="Email Address"
								keyboardType="email-address"
							/>
						</View>
					</View>
				</View>
				<View style={authScreenStyleV2.navigateButtonContainer}>
					<CustomBtn
						customBtnStyle={{ marginTop: 20, width: wp("90%") }}
						Title="Find my account"
						onPress={() => getUserInfo(email)}
					/>
					<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
						<Text
							style={styles.navigateToButton}
						>
							Don't have an account? Sign up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
  )
}

const styles = StyleSheet.create({
  Text: {
		fontSize: hp('3%'),
		fontFamily: fonts.bold,
	},
	Input: {
		height: hp("6%"),
		width: width - containerPadding * 2,
		padding: 8,
		margin: 5,
		borderWidth: 1,
		fontSize: hp('2%'),
		alignItems: "center",
    fontFamily: fonts.SimplonMonoMedium
	},
	navigateToButton: {
		fontFamily: fonts.bold,
		letterSpacing: 0.5,
		fontSize: 16,
		marginTop: width / 10,
		textAlign: "center",
		color: colors.black,
	}
})

export default FindAccountScreen;
