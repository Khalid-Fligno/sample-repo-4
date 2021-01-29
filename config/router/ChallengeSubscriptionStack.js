import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../../src/screens/AppStack/Home/HomeScreen';
import BlogScreen from '../../src/screens/AppStack/Home/BlogScreen';
import Header from '../../src/components/Shared/Header';
import ChallengeSubscriptionScreen from '../../src/screens/Challenges/subscription';
import CalendarHomeScreen from '../../src/screens/AppStack/Calendar/CalendarHomeScreen';
import CalendarStack from './CalendarStack';


const ChallengeSubscriptionStack = createStackNavigator(
  {
    ChallengeSubscription: ChallengeSubscriptionScreen,
    Calendar:CalendarStack
    // Subscription: HomeScreen,
  },
  {
    initialRouteName: 'Calendar',
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled:false,
      header: () => {
        const { routeName } = navigation.state;
        if(routeName === "Calendar")
          return null
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

export default ChallengeSubscriptionStack;
