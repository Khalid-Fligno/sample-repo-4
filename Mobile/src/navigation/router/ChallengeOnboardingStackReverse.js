import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import Header from "../../../src/components/Shared/Header";
import OnBoarding1 from "../../../src/screens/Challenges/Onboardings/OnBoarding1";
import OnBoarding2 from "../../../src/screens/Challenges/Onboardings/OnBoarding2";
import OnBoarding3 from "../../../src/screens/Challenges/Onboardings/OnBoarding3";
import OnBoarding4 from "../../../src/screens/Challenges/Onboardings/OnBoarding4";
import OnBoarding6 from "../../../src/screens/Challenges/Onboardings/OnBoarding6";
import CompleteBoarding from "../../../src/screens/Challenges/Onboardings/CompleteBoarding";

const ChallengeOnboardingStackReverse = createStackNavigator(
  {
    ChallengeOnBoarding6: OnBoarding6,
    ChallengeOnBoarding1: OnBoarding1,
    ChallengeOnBoarding2: OnBoarding2,
    ChallengeOnBoarding3: OnBoarding3,
    ChallengeOnBoarding4: OnBoarding4,
    ChallengeCompleteBoarding: CompleteBoarding,
  },
  {
    initialRouteName: "ChallengeOnBoarding6",

    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      header: () => {
        const { routeName } = navigation.state;
        if (
          routeName === "ChallengeOnBoarding3" ||
          routeName === "ChallengeOnBoarding4"
        ) {

          return (
            <Header
              stack="Subscription"
              navigation={navigation}
              withSkipButton
            />
          );
        }

        return (
          <Header
            stack="Subscription"
            navigation={navigation}
            withBackButton={routeName === "ChallengeOnBoarding6"}
          />
        );
      },
    }),
  }
);

export default ChallengeOnboardingStackReverse;
