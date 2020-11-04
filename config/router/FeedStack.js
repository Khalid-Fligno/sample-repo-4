import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../src/components/Shared/Header';
import FeedScreen from '../../src/screens/AppStack/Home/FeedScreen';

const FeedStack = createStackNavigator(
  {
    FeedScreen:FeedScreen
  },
  {
    initialRouteName: 'FeedScreen',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="home"
            navigation={navigation}
            withProfileButton={routeName === 'FeedScreen'}
            // withHomeButton={true}
          />
        );
      },
    }),
  },
);

export default FeedStack;
