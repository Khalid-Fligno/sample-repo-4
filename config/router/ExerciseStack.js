import { createStackNavigator } from 'react-navigation';
import CountdownScreen from '../../src/screens/AppStack/Workouts/Resistance/CountdownScreen';
import Exercise1Screen from '../../src/screens/AppStack/Workouts/Resistance/Exercise1Screen';
import Exercise2Screen from '../../src/screens/AppStack/Workouts/Resistance/Exercise2Screen';
import Exercise3Screen from '../../src/screens/AppStack/Workouts/Resistance/Exercise3Screen';
import Exercise4Screen from '../../src/screens/AppStack/Workouts/Resistance/Exercise4Screen';
import Exercise5Screen from '../../src/screens/AppStack/Workouts/Resistance/Exercise5Screen';
import Exercise6Screen from '../../src/screens/AppStack/Workouts/Resistance/Exercise6Screen';
import WorkoutCompleteScreen from '../../src/screens/AppStack/Workouts/Resistance/WorkoutCompleteScreen';

import { fadeSpec, fade } from './utils';

const ExerciseStack = createStackNavigator(
  {
    Countdown: CountdownScreen,
    Exercise1: Exercise1Screen,
    Exercise2: Exercise2Screen,
    Exercise3: Exercise3Screen,
    Exercise4: Exercise4Screen,
    Exercise5: Exercise5Screen,
    Exercise6: Exercise6Screen,
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
    navigationOptions: {
      header: null,
    },
  },
);

export default ExerciseStack;
