import React from 'react';
import { Animated, Easing } from 'react-native';
import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from '../src//components/Icon';
import Header from '../src/components/Header';
import AuthLoadingScreen from '../src/screens/AuthLoadingScreen';
import LandingScreen from '../src/screens/AuthStack/LandingScreen';
import LoginScreen from '../src/screens/AuthStack/LoginScreen';
import SignupScreen from '../src/screens/AuthStack/SignupScreen';
import Onboarding1Screen from '../src/screens/OnboardingStack/Onboarding1Screen';
import Onboarding2Screen from '../src/screens/OnboardingStack/Onboarding2Screen';
import Onboarding3Screen from '../src/screens/OnboardingStack/Onboarding3Screen';
import Onboarding4Screen from '../src/screens/OnboardingStack/Onboarding4Screen';
import HomeScreen from '../src/screens/AppStack/Home/HomeScreen';
import NutritionHomeScreen from '../src/screens/AppStack/Nutrition/NutritionHomeScreen';
import RecipeSelectionScreen from '../src/screens/AppStack/Nutrition/RecipeSelectionScreen';
import RecipeScreen from '../src/screens/AppStack/Nutrition/RecipeScreen';
import RecipeStepsScreen from '../src/screens/AppStack/Nutrition/RecipeStepsScreen';
import WorkoutsHomeScreen from '../src/screens/AppStack/Workouts/WorkoutsHomeScreen';
import WorkoutsLocationScreen from '../src/screens/AppStack/Workouts/WorkoutsLocationScreen';
import WorkoutsSelectionScreen from '../src/screens/AppStack/Workouts/WorkoutsSelectionScreen';
import WorkoutInfoScreen from '../src/screens/AppStack/Workouts/WorkoutInfoScreen';
import CountdownScreen from '../src/screens/AppStack/Workouts/CountdownScreen';
import Exercise1Screen from '../src/screens/AppStack/Workouts/Exercise1Screen';
import Exercise2Screen from '../src/screens/AppStack/Workouts/Exercise2Screen';
import Exercise3Screen from '../src/screens/AppStack/Workouts/Exercise3Screen';
import Exercise4Screen from '../src/screens/AppStack/Workouts/Exercise4Screen';
import Exercise5Screen from '../src/screens/AppStack/Workouts/Exercise5Screen';
import Exercise6Screen from '../src/screens/AppStack/Workouts/Exercise6Screen';
import WorkoutCompleteScreen from '../src/screens/AppStack/Workouts/WorkoutCompleteScreen';
import CalendarHomeScreen from '../src/screens/AppStack/Calendar/CalendarHomeScreen';
import ProfileHomeScreen from '../src/screens/AppStack/Profile/ProfileHomeScreen';
import colors from '../src/styles/colors';
import fonts from '../src/styles/fonts';
import {
  tabColorMap,
  workoutsBackButtonMap,
  nutritionBackButtonMap,
  onboardingHeaderButtonMap,
  findNutritionHeaderTitle,
  mealNameMap,
} from './routerUtils';

const fadeSpec = {
  duration: 800,
  easing: Easing.out(Easing.poly(4)),
  timing: Animated.timing,
};

const fade = (props) => {
  const { position, scene } = props;
  const { index } = scene;
  const translateX = 0;
  const translateY = 0;
  const opacity = position.interpolate({
    inputRange: [index - 0.7, index, index + 0.7],
    outputRange: [0.3, 1, 0.3],
  });
  return {
    opacity,
    transform: [{ translateX }, { translateY }],
  };
};

const AuthStack = createStackNavigator(
  {
    Landing: LandingScreen,
    Signup: SignupScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'Landing',
    mode: 'modal',
    navigationOptions: {
      header: null,
    },
  },
);

const OnboardingStack = createStackNavigator(
  {
    Onboarding1: Onboarding1Screen,
    Onboarding2: Onboarding2Screen,
    Onboarding3: Onboarding3Screen,
    Onboarding4: Onboarding4Screen,
  },
  {
    initialRouteName: 'Onboarding1',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            withBackButton={onboardingHeaderButtonMap[routeName]}
            withSkipButton={onboardingHeaderButtonMap[routeName]}
          />
        );
      },
    }),
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
    RecipeSteps: RecipeStepsScreen,
  },
  {
    initialRouteName: 'NutritionHome',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            withBackButton={nutritionBackButtonMap[routeName]}
            withStartButton={routeName === 'Recipe'}
            stack="nutrition"
            headerTitleParams={routeName === 'RecipeSelection' ? mealNameMap[navigation.getParam('meal', null)] : findNutritionHeaderTitle(routeName)}
          />
        );
      },
    }),
  },
);

const WorkoutsStack = createStackNavigator(
  {
    WorkoutsHome: WorkoutsHomeScreen,
    WorkoutsLocation: WorkoutsLocationScreen,
    WorkoutsSelection: WorkoutsSelectionScreen,
    WorkoutInfo: WorkoutInfoScreen,
  },
  {
    initialRouteName: 'WorkoutsHome',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            withBackButton={workoutsBackButtonMap[routeName]}
            withStartButton={routeName === 'WorkoutInfo'}
            stack="workouts"
          />
        );
      },
    }),
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

const ExerciseStack = createStackNavigator(
  {
    Countdown: CountdownScreen,
    Exercise1: Exercise1Screen,
    Exercise2: Exercise2Screen,
    Exercise3: Exercise3Screen,
    Exercise4: Exercise4Screen,
    Exercise5: Exercise5Screen,
    Exercise6: Exercise6Screen,
    WorkoutComplete: WorkoutCompleteScreen,
  },
  {
    initialRouteName: 'Countdown',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    navigationOptions: {
      header: null,
    },
  },
);

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Onboarding: OnboardingStack,
    App: AppStack,
    Exercise: ExerciseStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default SwitchNavigator;
