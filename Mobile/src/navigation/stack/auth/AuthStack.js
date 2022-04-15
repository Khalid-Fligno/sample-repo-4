import { createStackNavigator } from 'react-navigation-stack';
import EmailVerificationScreen from '../../../screens/AuthStack/EmailVerificationScreen';
import ForgottenPasswordScreen from '../../../screens/AuthStack/ForgottenPasswordScreen';
import SpecialOfferScreen from '../../../screens/AuthStack/SpecialOfferScreen';
import { fadeSpec, fade } from '../utils';
import FindAccountScreen from '../../../screens/AuthStack/FindAccountScreen';
import { AuthScreen } from '../../../screens/auth';

const AuthStack = createStackNavigator(
  {
    Landing: AuthScreen.LandingScreen,
    Signup: AuthScreen.SignupScreen,
    Login: AuthScreen.LoginScreen,
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
      header: null,
    },
  },
);

export default AuthStack;
