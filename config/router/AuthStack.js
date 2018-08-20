import { createStackNavigator } from 'react-navigation';
import LandingScreen from '../../src/screens/AuthStack/LandingScreen';
import LoginScreen from '../../src/screens/AuthStack/LoginScreen';
import SignupScreen from '../../src/screens/AuthStack/SignupScreen';

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

export default AuthStack;
