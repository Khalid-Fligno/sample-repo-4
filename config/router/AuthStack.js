import { createStackNavigator } from 'react-navigation';
import LandingScreen from '../../src/screens/AuthStack/LandingScreen';
import LoginScreen from '../../src/screens/AuthStack/LoginScreen';
import SignupScreen from '../../src/screens/AuthStack/SignupScreen';
import EmailVerificationScreen from '../../src/screens/AuthStack/EmailVerificationScreen';

const AuthStack = createStackNavigator(
  {
    Landing: LandingScreen,
    Signup: SignupScreen,
    Login: LoginScreen,
    EmailVerification: EmailVerificationScreen,
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
