import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../../components/Shared/Header';
import { LifestyleTabScreen } from '../../../screens/tab/lifestyle';

const HomeStack = createStackNavigator(
  {
    HomeHome: LifestyleTabScreen.LifestyleScreen,
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
          />
        );
      },
    }),
  },
);

export default HomeStack;
