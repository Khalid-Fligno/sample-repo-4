import { createStackNavigator } from "react-navigation-stack";
import ExercisesScreenV2 from "../../src/screens/AppStack/Workouts/CommonExercises/ExercisesScreenV2";
import WarmUpCoolDownScreenV2 from "../../src/screens/AppStack/Workouts/CommonExercises/WarmUpCoolDownScreenV2";
import WorkoutCompleteScreen from "../../src/screens/AppStack/Workouts/CommonExercises/WorkoutCompleteScreen";
import CountDownScreenV2 from "../../src/screens/AppStack/Workouts/CommonExercises/CountdownScreenV2";

import { fadeSpec, fade } from "./utils";

const ExerciseStack = createStackNavigator(
  {
    Countdown: CountDownScreenV2,
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
      headerShown: false,
    },
  }
);

export default ExerciseStack;
