import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../../src/screens/AppStack/Home/HomeScreen';
import BlogScreen from '../../src/screens/AppStack/Home/BlogScreen';
import Header from '../../src/components/Shared/Header';
import ChallengeSubscriptionScreen from '../../src/screens/Challenges/subscription';

const SubscriptionStack = createStackNavigator(
  {
    ChallengeSubscription: ChallengeSubscriptionScreen,
    // Subscription: HomeScreen,
  },
  {
    initialRouteName: 'ChallengeSubscription',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="ChallengeSubscription"
            navigation={navigation}
            withProfileButton={routeName === 'ChallengeSubscription'}
            // withHomeButton={true}
          />
        );
      },
    }),
  },
);

export default SubscriptionStack;
