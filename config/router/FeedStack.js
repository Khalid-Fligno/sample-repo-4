import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../../src/screens/AppStack/Home/HomeScreen';
import BlogScreen from '../../src/screens/AppStack/Home/BlogScreen';
import Header from '../../src/components/Shared/Header';

const FeedStack = createStackNavigator(
  {
    FeedFeed: HomeScreen,
    FeedBlog: BlogScreen,
  },
  {
    initialRouteName: 'FeedFeed',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="Feed"
            navigation={navigation}
            withProfileButton={routeName === 'FeedFeed'}
            withBackButton={routeName === 'FeedBlog'}
          />
        );
      },
    }),
  },
);

export default FeedStack;
