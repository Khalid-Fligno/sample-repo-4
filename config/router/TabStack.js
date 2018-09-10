import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import HomeStack from './HomeStack';
import NutritionStack from './NutritionStack';
import WorkoutsStack from './WorkoutsStack';
import CalendarStack from './CalendarStack';
import ProgressStack from './ProgressStack';
import Icon from '../../src/components/Icon';
import colors from '../../src/styles/colors';
import fonts from '../../src/styles/fonts';
import { tabColorMap } from './utils';

const TabStack = createBottomTabNavigator(
  {
    Home: HomeStack,
    Nutrition: NutritionStack,
    Workouts: WorkoutsStack,
    Calendar: CalendarStack,
    Progress: ProgressStack,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const activeState = tabColorMap[routeName];
        const inactiveState = colors.charcoal.standard;
        let icon;
        if (routeName === 'Home') {
          icon = (
            <Icon
              name={focused ? 'home-solid' : 'home-outline'}
              size={24}
              color={focused ? activeState : inactiveState}
            />
          );
        } else if (routeName === 'Nutrition') {
          icon = (
            <Icon
              name={focused ? 'nutrition-solid' : 'nutrition-outline'}
              size={24}
              color={focused ? activeState : inactiveState}
            />
          );
        } else if (routeName === 'Workouts') {
          icon = (
            <Icon
              name={focused ? 'workouts-solid' : 'workouts-outline'}
              size={24}
              color={focused ? activeState : inactiveState}
            />
          );
        } else if (routeName === 'Calendar') {
          icon = (
            <Icon
              name={focused ? 'calendar-solid' : 'calendar-outline'}
              size={24}
              color={focused ? activeState : inactiveState}
            />
          );
        } else if (routeName === 'Progress') {
          icon = (
            <Icon
              name={focused ? 'star-solid' : 'star-outline'}
              size={24}
              color={focused ? activeState : inactiveState}
            />
          );
        }
        return icon;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.charcoal.standard,
      inactiveTintColor: colors.charcoal.standard,
      style: {
        shadowColor: colors.grey.standard,
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.7,
        shadowRadius: 2,
        borderTopWidth: 0,
        backgroundColor: colors.white,
      },
      labelStyle: {
        fontFamily: fonts.standard,
      },
    },
  },
);

export default TabStack;
