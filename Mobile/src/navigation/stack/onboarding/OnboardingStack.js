import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import SubscriptionScreen from "../../../screens/OnboardingStack/SubscriptionScreen";
// import Onboarding1Screen from "../../../screens/OnboardingStack/Onboarding1Screen";
import Progress1Screen from "../../../screens/OnboardingStack/Progress1Screen";
import Progress2Screen from "../../../screens/OnboardingStack/Progress2Screen";
import { Onboarding2Screen } from "../../../screens/onboarding/onboard2/Onboarding2Screen";
import { Onboarding1Screen } from "../../../screens/onboarding/onboard1/Onboarding1Screen";
import ProgressEditScreen from "../../../screens/OnboardingStack/ProgressEditScreen";
import Header from "../../../components/Shared/Header";
import {
  fadeSpec,
  fade,
  onboardingBackButtonMap,
} from "../utils";

const OnboardingStack = createStackNavigator(
  {
    Subscription: SubscriptionScreen,
    Onboarding1: Onboarding1Screen,
    Onboarding2: Onboarding2Screen,
    Progress1: Progress1Screen,
    Progress2: Progress2Screen,
    ProgressEdit: ProgressEditScreen,
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
      gesturesEnabled: false,
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
