import { createStackNavigator } from 'react-navigation-stack';
import HiitCountdownScreen from '../../src/screens/AppStack/Workouts/Hiit/HiitCountdownScreen';
import HiitExercise1Screen from '../../src/screens/AppStack/Workouts/Hiit/HiitExercise1Screen';
import HiitExercise2Screen from '../../src/screens/AppStack/Workouts/Hiit/HiitExercise2Screen';
import HiitWorkoutCompleteScreen from '../../src/screens/AppStack/Workouts/Hiit/HiitWorkoutCompleteScreen';

import { fadeSpec, fade } from './utils';

const HiitExerciseStack = createStackNavigator(
  {
    HiitCountdown: HiitCountdownScreen,
    HiitExercise1: HiitExercise1Screen,
    HiitExercise2: HiitExercise2Screen,
    HiitWorkoutComplete: HiitWorkoutCompleteScreen,
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

export default HiitExerciseStack;
