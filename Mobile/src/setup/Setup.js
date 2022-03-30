import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	StatusBar,
	Linking,
	AppState,
	Platform,
	LogBox,
} from "react-native";
import OneSignal from "react-native-onesignal";
import appsFlyer from "react-native-appsflyer";
import { NavigationActions } from "react-navigation";
import { Audio } from "expo-av";
import SwitchNavigator from "./config/router/index";
import colors from "../styles/colors";
import _ from "lodash";
import { Mixpanel } from "mixpanel-react-native";
import * as Sentry from "@sentry/react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { appsFlyerConfig } from "../../config/appsflyer";
import { mixpanelConfig } from "../../config/mixpanel";
import { oneSignalConfig } from "../../config/onesignal";
import { sentryConfig } from "../../config/sentry";

const Setup = () => {

	const [appState, setAppState] = useState(AppState.currentState);

	if (!__DEV__) {
		Sentry.init(sentryConfig);
	}

	let navigator;

	const setTopLevelNavigator = (navigatorRef) => {
		navigator = navigatorRef;
	};

	const navigate = (routeName, params) => {
		navigator.dispatch(
			NavigationActions.navigate({
				routeName,
				params,
			})
		);
	};

	const handleAppStateChange = async (nextAppState) => {
		if (appState.match(/inactive|background/) && nextAppState === "active") {
			if (Platform.OS === "ios") {
				appsFlyer.trackAppLaunch();
			}
			await Audio.setIsEnabledAsync(true);
		}
		setAppState(nextAppState);
	};

	const handleOpenURL = (event) => {
		if (event.url === "fitazfk://special-offer") {
			navigate("SpecialOffer");
		}
	};

	useEffect(() => {
		LogBox.ignoreLogs(["Setting a timer"]);
		const _console = _.clone(console);
		console.warn = (message) => {
			if (message.indexOf("Setting a timer") <= -1) {
				_console.warn(message);
			}
		};
		Mixpanel.init(mixpanelConfig.token);
		OneSignal.init(oneSignalConfig.token, oneSignalConfig.secondParam);
		OneSignal.setLocationShared(false);
		appsFlyer.initSdk(appsFlyerConfig);

		const linkinListener = Linking.addEventListener("url", handleOpenURL);
		const appStateListener = AppState.addEventListener(
			"change",
			handleAppStateChange
		);

		setAppState(AppState.currentState);

		return () => {
			if (linkinListener) {
				linkinListener.remove();
			}
			if (appStateListener) {
				appStateListener.remove();
			}
		};
	}, []);

	useEffect(() => {
		const Review = async () => {
			const res = await AsyncStorage.getItem("later");
			if (res === "true") {
				await AsyncStorage.removeItem("later");
			}
		};
		Review();
	}, []);

	return (
		<View style={styles.appContainer}>
			<StatusBar barStyle="light-content" />
			<SwitchNavigator
				ref={(navigatorRef) => setTopLevelNavigator(navigatorRef)}
			/>
		</View>
	);
};

export default Sentry.wrap(Setup);

const styles = StyleSheet.create({
	appContainer: {
		flex: 1,
		backgroundColor: colors.black,
	},
});
