import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import ChallengeSubscriptionScreen from '../../src/screens/Challenges/subscription';
import SubscriptionScreen from "../../src/screens/OnboardingStack/SubscriptionScreen";
import Header from '../../src/components/Shared/Header';

const ChallengeSubscriptionStack = createStackNavigator({
  ChallengeSubscription: ChallengeSubscriptionScreen,
  Subscription: SubscriptionScreen,
  }, {
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled: true,
      header: () => {
        const { routeName } = navigation.state;
        switch (routeName) {
          case "ChallengeSubscription":
            var withProfileButton = true
            var withBackButton = false
            var bac
            break
          case 'Subscription':
            var withProfileButton = false
            var withBackButton = true
            break
        }
        return (
          <Header
            stack="ChallengeSubscription"
            navigation={navigation}
            withProfileButton={withProfileButton}
            withBackButton={withBackButton}
          />
        )
      },
    }),
  })

  export default ChallengeSubscriptionStack