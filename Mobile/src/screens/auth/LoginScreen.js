import React, { useEffect } from 'react';
import {
	View,
	SafeAreaView,
	Text,
	TouchableOpacity,
	TextInput,
} from 'react-native';
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import CustomBtn from "../../components/Shared/CustomBtn";
import HeaderAuth from '../../components/Auth/Header';
import NativeLoader from "../../components/Shared/NativeLoader";
import Toast from 'react-native-toast-message';
import { loginStyles } from '../../styles/auth/loginStyle';
import { useCounter } from '../../library/useCustomHook/auth/loginHook';

export const LoginScreen = ({ navigation }) => {
	const specialOffer = navigation.getParam("specialOffer", undefined)
	const {
		email,
		setEmail,
		password,
		setPassword,
		loading,
		login,
		setSpeciaOffer
	} = useCounter()

	useEffect(() => {
		setSpeciaOffer(specialOffer)
	}, [specialOffer])

	return (
		<SafeAreaView style={loginStyles.safeAreaContainer}>
			<View style={loginStyles.container}>
				<View>
					<View style={loginStyles.crossIconContainer}>
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
					<View style={loginStyles.formContainer}>
						<View style={loginStyles.formHeaderContainer}>
							<Text style={loginStyles.Text}>
								Sign In
							</Text>
						</View>
						<View style={loginStyles.formInputContainer}>
							<TextInput
								style={loginStyles.Input}
								placeholder="Email"
								keyboardType="email-address"
								onChangeText={setEmail}
								value={email}
								autoCapitalize='none'
							/>
							<TextInput
								style={loginStyles.Input}
								placeholder="Password"
								secureTextEntry
								returnKeyType="go"
								onChangeText={setPassword}
								value={password}
								autoCapitalize='none'
							/>
						</View>
						<TouchableOpacity onPress={() => navigation.navigate('ForgottenPassword')}>
							<Text style={loginStyles.forgotPasswordText}>
								Forgotten your password?
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View style={loginStyles.navigateButtonContainer}>
					<CustomBtn
						customBtnStyle={{ marginTop: 20, width: wp("90%") }}
						Title="SIGN IN"
						onPress={() => login(email, password)}
					/>
					<TouchableOpacity onPress={() => navigation.navigate('Signup')}>
						<Text
							style={loginStyles.navigateToText}
						>
							Don't have an account? Sign up
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<Toast />
			{loading && <NativeLoader />}
		</SafeAreaView>
	)
}