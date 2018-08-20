import { createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from '../../src/screens/AuthLoadingScreen';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import OnboardingStack from './OnboardingStack';

const SwitchNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    Onboarding: OnboardingStack,
    App: AppStack,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);

export default SwitchNavigator;
