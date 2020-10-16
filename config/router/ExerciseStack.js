import { createStackNavigator } from 'react-navigation-stack';
import CountdownScreen2 from '../../src/screens/AppStack/Workouts/CommonExercises/CountdownScreen';
import ExercisesScreen from '../../src/screens/AppStack/Workouts/CommonExercises/ExercisesScreen';
import WorkoutCompleteScreen from '../../src/screens/AppStack/Workouts/CommonExercises/ExercisesScreen';

import { fadeSpec, fade } from './utils';

const ExerciseStack = createStackNavigator(
  {
    Countdown: CountdownScreen2,
    Exercise:ExercisesScreen, 
  
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
