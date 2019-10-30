import { createStackNavigator } from 'react-navigation-stack';
import HiitCircuitCountdownScreen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitCountdownScreen';
import HiitCircuitExercise1Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitExercise1Screen';
import HiitCircuitExercise2Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitExercise2Screen';
import HiitCircuitExercise3Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitExercise3Screen';
import HiitCircuitExercise4Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitExercise4Screen';
import HiitCircuitExercise5Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitExercise5Screen';
import HiitCircuitExercise6Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitExercise6Screen';
import HiitCircuitRest1Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitRest1Screen';
import HiitCircuitRest2Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitRest2Screen';
import HiitCircuitRest3Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitRest3Screen';
import HiitCircuitRest4Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitRest4Screen';
import HiitCircuitRest5Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitRest5Screen';
import HiitCircuitRest6Screen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitRest6Screen';
import HiitCircuitWorkoutCompleteScreen from '../../src/screens/AppStack/Workouts/HiitCircuit/HiitCircuitWorkoutCompleteScreen';

import { fadeSpec, fade } from './utils';

const HiitCircuitExerciseStack = createStackNavigator(
  {
    HiitCircuitCountdown: HiitCircuitCountdownScreen,
    HiitCircuitExercise1: HiitCircuitExercise1Screen,
    HiitCircuitExercise2: HiitCircuitExercise2Screen,
    HiitCircuitExercise3: HiitCircuitExercise3Screen,
    HiitCircuitExercise4: HiitCircuitExercise4Screen,
    HiitCircuitExercise5: HiitCircuitExercise5Screen,
    HiitCircuitExercise6: HiitCircuitExercise6Screen,
    HiitCircuitRest1: HiitCircuitRest1Screen,
    HiitCircuitRest2: HiitCircuitRest2Screen,
    HiitCircuitRest3: HiitCircuitRest3Screen,
    HiitCircuitRest4: HiitCircuitRest4Screen,
    HiitCircuitRest5: HiitCircuitRest5Screen,
    HiitCircuitRest6: HiitCircuitRest6Screen,
    HiitCircuitWorkoutComplete: HiitCircuitWorkoutCompleteScreen,
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

export default HiitCircuitExerciseStack;
