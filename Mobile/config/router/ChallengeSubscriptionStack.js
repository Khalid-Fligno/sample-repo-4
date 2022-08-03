import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import ChallengeSubscriptionScreen from '../../src/screens/Challenges/subscription';
import Header from '../../src/components/Shared/Header';

const ChallengeSubscriptionStack = createStackNavigator({
  ChallengeSubscription: ChallengeSubscriptionScreen,
  }, {
    // mode: 'modal',
    defaultNavigationOptions: ({ navigation }) => ({
      gestureEnabled: true,
      
        // headerMode: 'none'
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
