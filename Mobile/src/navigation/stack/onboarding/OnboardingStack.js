import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Progress1Screen from "../../../screens/OnboardingStack/Progress1Screen";
import Progress2Screen from "../../../screens/OnboardingStack/Progress2Screen";
import { OnboardScreen } from "../../../screens/onboarding/index";
import UserProgressEditScreen from "../../../screens/tab/you/userProgressEdit/UserProgressEditScreen";
import Header from "../../../components/Shared/Header";
import {
  fadeSpec,
  fade,
  onboardingBackButtonMap,
} from "../utils";

const OnboardingStack = createStackNavigator(
  {
    Subscription: OnboardScreen.SubscriptionScreen,
    Onboarding1: OnboardScreen.Onboarding1Screen,
    Onboarding2: OnboardScreen.Onboarding2Screen,
    Progress1: Progress1Screen,
    Progress2: Progress2Screen,
    ProgressEdit: UserProgressEditScreen,
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
