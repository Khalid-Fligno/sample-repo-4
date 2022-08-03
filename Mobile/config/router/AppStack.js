import { createStackNavigator } from 'react-navigation-stack';
import TabStack from './TabStack';
import ExerciseStack from './ExerciseStack';
import ProfileStack from './ProfileStack';
import ChallengeOnboardingStack from './ChallengeOnboardingStack';
import ChallengeOnboardingStackReverse from './ChallengeOnboardingStackReverse';
import SusbcriptionStack from './SubscriptionStack';


const AppStack = createStackNavigator(
  {
    Tabs: { screen: TabStack },
    Profile: { screen: ProfileStack },
    Exercise: { screen: ExerciseStack },
    ChallengeOnBoardingReverse: { screen: ChallengeOnboardingStackReverse },
    ChallengeOnBoarding: { screen:ChallengeOnboardingStack },
    Subscription: SusbcriptionStack
  },
  {
    mode: 'modal',
    initialRouteName: 'Tabs',
    // transitionConfig: () => ({
    //   transitionSpec: fadeSpec,
    //   screenInterpolator: (props) => {
    //     return fade(props);
    //   },
    // }),
    defaultNavigationOptions:({ navigation })=>( {
      gestureEnabled:navigation.state.routeName === 'ChallengeOnBoarding'?false:true,
      headerShown: false,
    }
    )
  },
);

export default AppStack;
