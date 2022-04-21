import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import BlogScreen from '../../../screens/AppStack/Home/BlogScreen';
import Header from '../../../components/Shared/Header';
import { LifestyleTabScreen } from '../../../screens/tab/lifestyle';

const HomeStack = createStackNavigator(
  {
    HomeHome: LifestyleTabScreen.LifestyleScreen,
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
