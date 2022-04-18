import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { SplashScreenV2 } from '../../screens/splash/SplashScreen';
import AuthStack from './auth/AuthStack';
import AppStack from './app/AppStack';
import OnboardingStack from './onboarding/OnboardingStack';
import { fadeSpec, fade } from './utils';
import OfferStack from './offer/OfferStack';

const SwitchNavigator = createSwitchNavigator(
  {
    Splash: SplashScreenV2,
    Auth: AuthStack,
    Offer: OfferStack,
    Onboarding: OnboardingStack,
    App: AppStack,
  },
  {
    initialRouteName: 'Splash',
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
