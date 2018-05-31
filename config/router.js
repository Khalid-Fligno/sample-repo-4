import { createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import AuthLoadingScreen from '../src/screens/AuthLoadingScreen';
import SignInScreen from '../src/screens/AuthStack/SignInScreen';
import HomeScreen from '../src/screens/AppStack/Home/HomeScreen';
import NutritionHomeScreen from '../src/screens/AppStack/Nutrition/NutritionHomeScreen';
import WorkoutsHomeScreen from '../src/screens/AppStack/Workouts/WorkoutsHomeScreen';
import ProfileHomeScreen from '../src/screens/AppStack/Profile/ProfileHomeScreen';

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const HomeStack = createStackNavigator(
  {
    HomeHome: HomeScreen,
  },
  {
    initialRouteName: 'HomeHome',
  },
);

const NutritionStack = createStackNavigator(
  {
    NutritionHome: NutritionHomeScreen,
  },
  {
    initialRouteName: 'NutritionHome',
  },
);

const WorkoutsStack = createStackNavigator(
  {
    WorkoutsHome: WorkoutsHomeScreen,
  },
  {

  },
);

const ProfileStack = createStackNavigator(
  {
    ProfileHome: ProfileHomeScreen,
  },
  {

  },
);

const AppStack = createBottomTabNavigator(
  {
    Home: HomeStack,
    Nutrition: NutritionStack,
    Workouts: WorkoutsStack,
    Profile: ProfileStack,
  },
  {
    initialRouteName: 'Home',
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
