import React from 'react';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from '../src//components/Icon';
import Header from '../src/components/Header';
import AuthLoadingScreen from '../src/screens/AuthLoadingScreen';
import SignInScreen from '../src/screens/AuthStack/SignInScreen';
import HomeScreen from '../src/screens/AppStack/Home/HomeScreen';
import NutritionHomeScreen from '../src/screens/AppStack/Nutrition/NutritionHomeScreen';
import RecipeSelectionScreen from '../src/screens/AppStack/Nutrition/RecipeSelectionScreen';
import RecipeScreen from '../src/screens/AppStack/Nutrition/RecipeScreen';
import WorkoutsHomeScreen from '../src/screens/AppStack/Workouts/WorkoutsHomeScreen';
import CalendarHomeScreen from '../src/screens/AppStack/Calendar/CalendarHomeScreen';
import ProfileHomeScreen from '../src/screens/AppStack/Profile/ProfileHomeScreen';
import colors from '../src/styles/colors';
import fonts from '../src/styles/fonts';

const tabColorMap = {
  Home: colors.charcoal.standard,
  Nutrition: colors.violet.standard,
  Workouts: colors.coral.standard,
  Calendar: colors.green.standard,
  Profile: colors.blue.standard,
};

const nutritionBackButtonMap = {
  NutritionHome: false,
  RecipeSelection: true,
  Recipe: true,
};

const AuthStack = createStackNavigator(
  {
    SignIn: SignInScreen,
  },
  {
    initialRouteName: 'SignIn',
    navigationOptions: {
      header: <Header />,
    },
  },
);

const HomeStack = createStackNavigator(
  {
    HomeHome: HomeScreen,
  },
  {
    initialRouteName: 'HomeHome',
    navigationOptions: {
      header: <Header />,
    },
  },
);

const NutritionStack = createStackNavigator(
  {
    NutritionHome: NutritionHomeScreen,
    RecipeSelection: RecipeSelectionScreen,
    Recipe: RecipeScreen,
  },
  {
    initialRouteName: 'NutritionHome',
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            withBackButton={nutritionBackButtonMap[routeName]}
            stack="nutrition"
          />
        );
      },
    }),
  },
);

const WorkoutsStack = createStackNavigator(
  {
    WorkoutsHome: WorkoutsHomeScreen,
  },
  {
    initialRouteName: 'WorkoutsHome',
    navigationOptions: {
      header: <Header stack="workouts" />,
    },
  },
);

const CalendarStack = createStackNavigator(
  {
    CalendarHome: CalendarHomeScreen,
  },
  {
    initialRouteName: 'CalendarHome',
    navigationOptions: {
      header: <Header stack="calendar" />,
    },
  },
);

const ProfileStack = createStackNavigator(
  {
    ProfileHome: ProfileHomeScreen,
  },
  {
    initialRouteName: 'ProfileHome',
    navigationOptions: {
      header: <Header stack="profile" />,
    },
  },
);

const AppStack = createBottomTabNavigator(
  {
    Home: HomeStack,
    Nutrition: NutritionStack,
    Workouts: WorkoutsStack,
    Calendar: CalendarStack,
    Profile: ProfileStack,
  },
  {
    initialRouteName: 'Nutrition',
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        // const activeState = focused ? colors.coral.standard : colors.charcoal.light;
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
        } else if (routeName === 'Profile') {
          icon = (
            <Icon
              name={focused ? 'profile-solid' : 'profile-outline'}
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
        borderTopColor: colors.grey.light,
        borderTopWidth: 1,
        backgroundColor: colors.white,
      },
      labelStyle: {
        fontFamily: fonts.standard,
      },
    },
  },
);

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default SwitchNavigator;
