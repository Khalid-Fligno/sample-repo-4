import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import SubscriptionScreen from "../../src/screens/OnboardingStack/SubscriptionScreen";
import Onboarding1Screen from "../../src/screens/OnboardingStack/Onboarding1Screen";
import Header from "../../src/components/Shared/Header";
import {
  fadeSpec,
  fade,
  onboardingBackButtonMap,
} from "./utils";
import Onboarding2Screen from "../../src/screens/OnboardingStack/Onboarding2Screen";

const OnboardingStack = createStackNavigator(
  {
    Subscription: SubscriptionScreen,
    Onboarding1: Onboarding1Screen,
    Onboarding2: Onboarding2Screen,
  },
  {
    initialRouteName: "Subscription",
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    defaultNavigationOptions: ({ navigation }) => ({
      gestureEnabled: false,
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="onboarding"
            navigation={navigation}
            withBackButton={onboardingBackButtonMap[routeName]}
            withLogoutButton={routeName === "Subscription"}
            withRightHelpButton={routeName === "Progress1"}
            withRestoreButton={routeName === "Subscription"}
          />
        );
      },
    }),
  }
);

export default OnboardingStack;
