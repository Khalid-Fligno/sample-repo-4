import { createStackNavigator } from 'react-navigation-stack';
import LandingScreen from '../../src/screens/AuthStack/LandingScreen';
import LoginScreen from '../../src/screens/AuthStack/LoginScreen';
import SignupScreen from '../../src/screens/AuthStack/SignupScreen';
import EmailVerificationScreen from '../../src/screens/AuthStack/EmailVerificationScreen';
import ForgottenPasswordScreen from '../../src/screens/AuthStack/ForgottenPasswordScreen';
import SpecialOfferScreen from '../../src/screens/AuthStack/SpecialOfferScreen';
import { fadeSpec, fade } from './utils';

const AuthStack = createStackNavigator(
  {
    Landing: LandingScreen,
    Signup: SignupScreen,
    Login: LoginScreen,
    EmailVerification: EmailVerificationScreen,
    ForgottenPassword: ForgottenPasswordScreen,
    SpecialOffer: SpecialOfferScreen,
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
      header: null,
    },
  },
);

export default AuthStack;
