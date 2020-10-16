import { createStackNavigator } from 'react-navigation-stack';
import TabStack from './TabStack';
import ExerciseStack from './ExerciseStack';
import ProfileStack from './ProfileStack';
import { fadeSpec, fade } from './utils';
import ChallengeOnboardingStack from './ChallengeOnboardingStack';

const AppStack = createStackNavigator(
  {
    Tabs: { screen: TabStack },
    Profile: { screen: ProfileStack },
    Exercise: { screen: ExerciseStack },
    ChallengeOnBoarding: { screen:ChallengeOnboardingStack }
  },
  {
    initialRouteName: 'Tabs',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    defaultNavigationOptions:({ navigation })=>( {
      gesturesEnabled:navigation.state.routeName === 'ChallengeOnBoarding'?false:true,
      header: null,
    }
    )
  },
);

export default AppStack;
