import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from '../../screens/AuthLoadingScreen';
import { SplashScreenV2 } from '../../screens/splash/SplashScreen';
import AuthStack from './auth/AuthStack';
import AppStack from './app/AppStack';
import OnboardingStack from './onboarding/OnboardingStack';
import { fadeSpec, fade } from './utils';

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: SplashScreenV2,
    Auth: AuthStack,
    Onboarding: OnboardingStack,
    App: AppStack,
  },
  {
    initialRouteName: 'AuthLoading',
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

export default createAppContainer(SwitchNavigator);
