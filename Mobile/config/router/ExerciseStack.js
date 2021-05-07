import { createStackNavigator } from 'react-navigation-stack';
import CountdownScreen2 from '../../src/screens/AppStack/Workouts/CommonExercises/CountdownScreen';
import ExercisesScreen from '../../src/screens/AppStack/Workouts/CommonExercises/ExercisesScreen';
import WarmUpCoolDownScreen from '../../src/screens/AppStack/Workouts/CommonExercises/WarmUpCoolDownScreen';
import WorkoutCompleteScreen from '../../src/screens/AppStack/Workouts/CommonExercises/WorkoutCompleteScreen';

import { fadeSpec, fade } from './utils';

const ExerciseStack = createStackNavigator(
  {
    Countdown: CountdownScreen2,
    Exercise:ExercisesScreen, 
    ExerciseWC:WarmUpCoolDownScreen,
    WorkoutComplete: WorkoutCompleteScreen,
  },
  {
    // initialRouteName: 'Countdown',
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

export default ExerciseStack;
