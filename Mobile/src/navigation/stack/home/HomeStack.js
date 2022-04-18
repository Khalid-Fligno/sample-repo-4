import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import BlogScreen from '../../../screens/AppStack/Home/BlogScreen';
import Header from '../../../components/Shared/Header';
import { lifestyleScreen } from '../../../screens/tab/lifestyle/lifestyleScreen';

const HomeStack = createStackNavigator(
  {
    HomeHome: lifestyleScreen,
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
