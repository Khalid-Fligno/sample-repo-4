import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import AuthLoadingScreen from '../src/screens/AuthLoadingScreen';
import SignInScreen from '../src/screens/AuthStack/SignInScreen';
import HomeScreen from '../src/screens/AppStack/HomeScreen';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({ Home: HomeScreen });

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'App',
  },
);

export default SwitchNavigator;
