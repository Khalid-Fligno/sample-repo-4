import { createStackNavigator } from "react-navigation-stack";
import ExercisesScreenV2 from "../../../screens/AppStack/Workouts/CommonExercises/ExercisesScreenV2";
import WarmUpCoolDownScreenV2 from "../../../screens/AppStack/Workouts/CommonExercises/WarmUpCoolDownScreenV2";
import WorkoutCompleteScreen from "../../../screens/AppStack/Workouts/CommonExercises/WorkoutCompleteScreen";
import CountDownScreenV2 from "../../../screens/AppStack/Workouts/CommonExercises/CountdownScreenV2";

import { fadeSpec, fade } from "../utils";

const ExerciseStack = createStackNavigator(
  {
    Countdown: CountDownScreenV2,
    Exercise: ExercisesScreenV2,
    ExerciseWC: WarmUpCoolDownScreenV2,
    WorkoutComplete: WorkoutCompleteScreen,
  },
  {
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
