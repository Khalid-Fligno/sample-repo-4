import React from 'react';
import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../../src/screens/AppStack/Home/HomeScreen';
import BlogScreen from '../../src/screens/AppStack/Home/BlogScreen';
import Header from '../../src/components/Shared/Header';

const HomeStack = createStackNavigator(
  {
    HomeHome: HomeScreen,
    HomeBlog: BlogScreen,
  },
  {
    initialRouteName: 'HomeHome',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="home"
            navigation={navigation}
            withProfileButton={routeName === 'HomeHome'}
            withBackButton={routeName === 'HomeBlog'}
          />
        );
      },
    }),
  },
);

export default HomeStack;
