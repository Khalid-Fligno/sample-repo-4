import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	StatusBar,
	AppState,
	Platform,
	LogBox,
} from "react-native";
import OneSignal from "react-native-onesignal";
import appsFlyer from "react-native-appsflyer";
import { Audio } from "expo-av";
import colors from "../styles/colors";
import _ from "lodash";
import { Mixpanel } from "mixpanel-react-native";
import * as Sentry from "@sentry/react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { appsFlyerConfig } from "../config/appsflyer/index";
import { mixpanelConfig } from "../config/mixpanel/index";
import { oneSignalConfig } from "../config/onesignal/index";
import { sentryConfig } from "../config/sentry/index";
import Router from "../navigation/Router";
import { asyncActionStart } from "../store/async/action";
import { useSelector } from "react-redux";
import Loader from "../components/Shared/Loader";

const Setup = () => {

	const [appState, setAppState] = useState(AppState.currentState);
	const { isLoading } = useSelector(state => state.async);
	const dispatch = useDispatch();

	const initialize = useCallback(() => {
		dispatch(asyncActionStart());
	}, [dispatch]);

	if (!__DEV__) {
		Sentry.init(sentryConfig);
	}

	const handleAppStateChange = async (nextAppState) => {
		if (appState.match(/inactive|background/) && nextAppState === "active") {
			if (Platform.OS === "ios") {
				appsFlyer.trackAppLaunch();
			}
			await Audio.setIsEnabledAsync(true);
		}
		setAppState(nextAppState);
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

		const appStateListener = AppState.addEventListener(
			"change",
			handleAppStateChange
		);

		setAppState(AppState.currentState);

		return () => {
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

	useEffect(() => {
		initialize();
	}, [initialize])

	return (
		<View style={styles.appContainer}>
			<StatusBar barStyle="light-content" />
			<Router />
			{isLoading && <Loader isLoading={isLoading} />}
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
