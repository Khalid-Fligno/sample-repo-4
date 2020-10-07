import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../src/components/Shared/Header';
import LifeStyleScreen from '../../src/screens/AppStack/Home/LifeStyleScreen';

const LifestyleStack = createStackNavigator(
  {
    Lifestyle:LifeStyleScreen
  },
  {
    initialRouteName: 'Lifestyle',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            stack="home"
            navigation={navigation}
            withProfileButton={routeName === 'Lifestyle'}
            // withBackButton={routeName === 'HomeBlog'}
          />
        );
      },
    }),
  },
);

export default LifestyleStack;
