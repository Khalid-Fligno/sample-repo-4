import { createStackNavigator } from 'react-navigation-stack';
import { fadeSpec, fade } from '../utils';
import { AuthScreen } from '../../../screens/auth';

const AuthStack = createStackNavigator(
  {
    Landing: AuthScreen.LandingScreen,
    Signup: AuthScreen.SignupScreen,
    Login: AuthScreen.LoginScreen,
    ForgottenPassword: AuthScreen.ForgottenPasswordScreen,
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
