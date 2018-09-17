import { createStackNavigator } from 'react-navigation';
import TabStack from './TabStack';
import ExerciseStack from './ExerciseStack';
import HiitExerciseStack from './HiitExerciseStack';
import ProfileStack from './ProfileStack';
import { fadeSpec, fade } from './utils';

const AppStack = createStackNavigator(
  {
    Tabs: { screen: TabStack },
    Profile: { screen: ProfileStack },
    Exercise: { screen: ExerciseStack },
    HiitExercise: { screen: HiitExerciseStack },
  },
  {
    initialRouteName: 'Tabs',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    navigationOptions: {
      header: null,
    },
  },
);

export default AppStack;
