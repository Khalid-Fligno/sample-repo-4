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
import { containerPadding } from '../../styles/globalStyles';
import HeaderAuth from '../../components/Auth/Header';

const { width } = Dimensions.get("window");

const SignupScreenV2 = ({ navigation }) => {

	const [email, setEmail] = useState("")
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)
	const [specialOffer, setSpecialOffer] = useState(null)
	const [appleSignInAvailable, setAppleSignInAvailable] = useState(null)



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
								Create an Account
							</Text>
						</View>
						<View style={authScreenStyleV2.formInputContainer}>
							<TextInput
								style={styles.Input}
								placeholder="First Name"
							/>
							<TextInput
								style={styles.Input}
								placeholder="Last Name"
							/>
							<TextInput
								style={styles.Input}
								placeholder="Email Address"
								keyboardType="email-address"
							/>
							<TextInput
								style={styles.Input}
								placeholder="Create Password"
							/>
						</View>
					</View>
				</View>
				<View style={authScreenStyleV2.navigateButtonContainer}>
					<CustomBtn
						customBtnStyle={{ marginTop: 20, width: wp("90%") }}
						Title="GET STARTED"
						onPress={() => getUserInfo(email)}
					/>
					<TouchableOpacity onPress={() => navigation.navigate('Login')}>
						<Text
							style={styles.navigateToButton}
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

export default SignupScreenV2;
