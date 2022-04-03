import { createStackNavigator } from 'react-navigation-stack';
import TabStack from '../tab/TabStack';
import ExerciseStack from '../exercise/ExerciseStack';
import ProfileStack from '../profile/ProfileStack';
import ChallengeOnboardingStack from '../challengeOnboarding/ChallengeOnboardingStack';
import ChallengeOnboardingStackReverse from '../challengeOnboardingReverse/ChallengeOnboardingStackReverse';

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
