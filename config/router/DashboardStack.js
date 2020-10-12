import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../../src/screens/AppStack/Home/HomeScreen';
import Header from '../../src/components/Shared/Header';
import NutritionStack from './NutritionStack';
import WorkoutsStack from './WorkoutsStack';
import HomeStack from './HomeStack';

const DashboardStack = createStackNavigator(
  {
    Home: HomeStack,
    Nutrition: NutritionStack,
    Workouts: WorkoutsStack
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        if(routeName === 'Dashboard')
        return (
          <Header
            stack="Dashboard"
            navigation={navigation}
            withProfileButton={routeName === 'Dashboard'}
          />
        );
      },
    }),
  },
);

export default DashboardStack;
