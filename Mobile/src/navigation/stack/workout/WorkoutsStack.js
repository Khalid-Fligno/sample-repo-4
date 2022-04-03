import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import WorkoutsHomeScreen2 from "../../../screens/AppStack/Workouts/WorkoutsHomeScreen2";
import WorkoutsSelectionScreen2 from "../../../screens/AppStack/Workouts/WorkoutsSelectionScreen2";
import WorkoutInfoScreen2V2 from "../../../screens/AppStack/Workouts/WorkoutInfoScreen2V2";
import Header from "../../../components/Shared/Header";
import {
  workoutsBackButtonMap,
  fadeSpec,
  fade,
} from "../utils";

const WorkoutsStack = createStackNavigator(
  {
    WorkoutsHome: WorkoutsHomeScreen2,
    WorkoutsSelection: WorkoutsSelectionScreen2,
    WorkoutInfo: WorkoutInfoScreen2V2,
  },
  {
    initialRouteName: "WorkoutsHome",
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (sceneProps) => {
        const { scene, index, scenes } = sceneProps;
        const toIndex = index;
        const lastSceneIndex = scenes[scenes.length - 1].index;
        // Test whether we're skipping back more than one screen
        if (lastSceneIndex - toIndex > 1) {
          // Do not transform the screen being navigated to
          if (scene.index === toIndex) {
            return {};
          }
          // Hide all screens in between
          if (scene.index !== lastSceneIndex) {
            return { opacity: 0 };
          }
        }
        return fade(sceneProps);
      },
    }),
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            withBackButton={workoutsBackButtonMap[routeName]}
            withProfileButton={
              routeName === "WorkoutsHome" || routeName === "WorkoutsSelection"
            }
            stack="workouts"
          />
        );
      },
    }),
  }
);

export default WorkoutsStack;
