import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../../components/Shared/Header';
import { TabScreen } from "../../../screens/tab/index";

const HomeStack = createStackNavigator(
  {
    HomeHome: TabScreen.LifestyleScreen,
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
