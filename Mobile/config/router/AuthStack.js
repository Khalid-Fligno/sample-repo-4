import { createStackNavigator } from 'react-navigation-stack';
import LandingScreen from '../../src/screens/AuthStack/LandingScreen';
import LoginScreen from '../../src/screens/AuthStack/LoginScreen';
import SignupScreen from '../../src/screens/AuthStack/SignupScreen';
import EmailVerificationScreen from '../../src/screens/AuthStack/EmailVerificationScreen';
import ForgottenPasswordScreen from '../../src/screens/AuthStack/ForgottenPasswordScreen';
import SpecialOfferScreen from '../../src/screens/AuthStack/SpecialOfferScreen';
import { fadeSpec, fade } from './utils';
import FindAccountScreen from '../../src/screens/AuthStack/FindAccountScreen';

const AuthStack = createStackNavigator(
  {
    Landing: LandingScreen,
    Signup: SignupScreen,
    Login: LoginScreen,
    EmailVerification: EmailVerificationScreen,
    ForgottenPassword: ForgottenPasswordScreen,
    SpecialOffer: SpecialOfferScreen,
    FindAccount: FindAccountScreen,
  },
  {
    initialRouteName: 'Landing',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    defaultNavigationOptions: {
      headerShown: false,
    },
  },
);

export default AuthStack;
