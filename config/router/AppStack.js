import { createStackNavigator } from 'react-navigation';
import TabStack from './TabStack';
import ExerciseStack from './ExerciseStack';
import HiitExerciseStack from './HiitExerciseStack';
import HiitCircuitExerciseStack from './HiitCircuitExerciseStack';
import ProfileStack from './ProfileStack';
import { fadeSpec, fade } from './utils';

const AppStack = createStackNavigator(
  {
    Tabs: { screen: TabStack },
    Profile: { screen: ProfileStack },
    Exercise: { screen: ExerciseStack },
    HiitExercise: { screen: HiitExerciseStack },
    HiitCircuitExercise: { screen: HiitCircuitExerciseStack },
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
