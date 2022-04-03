import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import Header from '../../../components/Shared/Header';
import NutritionStack from '../nutrition/NutritionStack';
import WorkoutsStack from '../workout/WorkoutsStack';
import HomeStack from '../home/HomeStack';

const DashboardStack = createStackNavigator(
  {
    Home: HomeStack,
    Nutrition: NutritionStack,
    Workouts: WorkoutsStack
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      gesturesEnabled:false,
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
