import { createStackNavigator } from 'react-navigation-stack';
import EmailVerificationScreen from '../../../screens/AuthStack/EmailVerificationScreen';
import SpecialOfferScreen from '../../../screens/AuthStack/SpecialOfferScreen';
import { fadeSpec, fade } from '../utils';
import { AuthScreen } from '../../../screens/auth';

const AuthStack = createStackNavigator(
  {
    Landing: AuthScreen.LandingScreen,
    Signup: AuthScreen.SignupScreen,
    Login: AuthScreen.LoginScreen,
    EmailVerification: EmailVerificationScreen,
    ForgottenPassword: AuthScreen.ForgottenPasswordScreen,
    SpecialOffer: SpecialOfferScreen,
    FindAccount: AuthScreen.FindAccountScreen,
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
