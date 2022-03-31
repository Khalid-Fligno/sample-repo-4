import { createStackNavigator } from 'react-navigation-stack';
import TabStack from './TabStack';
import ExerciseStack from './ExerciseStack';
import ProfileStack from './ProfileStack';
import ChallengeOnboardingStack from './ChallengeOnboardingStack';
import ChallengeOnboardingStackReverse from './ChallengeOnboardingStackReverse';

const AppStack = createStackNavigator(
  {
    Tabs: { screen: TabStack },
    Profile: { screen: ProfileStack },
    Exercise: { screen: ExerciseStack },
    ChallengeOnBoardingReverse: { screen: ChallengeOnboardingStackReverse },
    ChallengeOnBoarding: { screen:ChallengeOnboardingStack },
    
  },
  {
    initialRouteName: 'Tabs',
    defaultNavigationOptions:({ navigation })=>( {
      gesturesEnabled:navigation.state.routeName === 'ChallengeOnBoarding'?false:true,
      header: null,
    }
    )
  },
);

export default AppStack;
