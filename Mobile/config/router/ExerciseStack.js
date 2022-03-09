import { createStackNavigator } from "react-navigation-stack";
import CountdownScreen2 from "../../src/screens/AppStack/Workouts/CommonExercises/CountdownScreen";
import ExercisesScreen from "../../src/screens/AppStack/Workouts/CommonExercises/ExercisesScreen";
import ExercisesScreenV2 from "../../src/screens/AppStack/Workouts/CommonExercises/ExercisesScreenV2";
import WarmUpCoolDownScreenV2 from "../../src/screens/AppStack/Workouts/CommonExercises/WarmUpCoolDownScreenV2";
import WorkoutCompleteScreen from "../../src/screens/AppStack/Workouts/CommonExercises/WorkoutCompleteScreen";
import CountDownScreenV2 from "../../src/screens/AppStack/Workouts/CommonExercises/CountdownScreenV2";

import { fadeSpec, fade } from "./utils";

const ExerciseStack = createStackNavigator(
  {
    Countdown: CountDownScreenV2,
    //Countdown: CountdownScreen2,
    Exercise: ExercisesScreenV2,
    ExerciseWC: WarmUpCoolDownScreenV2,
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
  }
);

export default ExerciseStack;
