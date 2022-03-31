import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from '../../screens/AuthLoadingScreen';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import OnboardingStack from './OnboardingStack';
import { fadeSpec, fade } from './utils';

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
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
