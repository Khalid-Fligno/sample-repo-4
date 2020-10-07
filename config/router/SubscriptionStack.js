import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../../src/screens/AppStack/Home/HomeScreen';
import BlogScreen from '../../src/screens/AppStack/Home/BlogScreen';
import Header from '../../src/components/Shared/Header';
import ChallengeSubscriptionScreen from '../../src/screens/Challenges/subscription';

const SubscriptionStack = createStackNavigator(
  {
    // Subscription: ChallengeSubscriptionScreen,
    Subscription: HomeScreen,
  },
  {
    initialRouteName: 'Subscription',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="Subscription"
            navigation={navigation}
            withProfileButton={routeName === 'Subscription'}
            withBackButton={routeName === 'SubscriptionBlog'}
          />
        );
      },
    }),
  },
);

export default SubscriptionStack;
