import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreenV2 from '../../../screens/AppStack/Home/HomeScreenV2';
import BlogScreen from '../../../screens/AppStack/Home/BlogScreen';
import Header from '../../../components/Shared/Header';

const HomeStack = createStackNavigator(
  {
    HomeHome: HomeScreenV2,
    HomeBlog: BlogScreen,
  },
  {
    initialRouteName: 'HomeHome',
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled:false,
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
