import React, { useState } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
	Dimensions,
	Image
} from 'react-native';
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
								width: wp("90%"),
								alignItems: "center"
							}}
						>
							<Text style={styles.Text}>
								Create an Account
							</Text>
						</View>
						<View style={{ paddingTop: hp("3%") }}>
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
				<View
					style={{
						display: "flex",
						alignItems: "center",
						bottom: 50,
					}}
				>
					<CustomBtn
						customBtnStyle={{ marginTop: 20, width: wp("90%") }}
						Title="GET STARTED"
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
		fontFamily: fonts.SimplonMonoMedium
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

export default SignupScreenV2;
