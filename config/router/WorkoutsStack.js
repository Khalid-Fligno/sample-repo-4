import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import WorkoutsHomeScreen from '../../src/screens/AppStack/Workouts/WorkoutsHomeScreen';
import WorkoutsHomeScreen2 from '../../src/screens/AppStack/Workouts/WorkoutsHomeScreen2';
import WorkoutsSelectionScreen from '../../src/screens/AppStack/Workouts/WorkoutsSelectionScreen';
import WorkoutsSelectionScreen2 from '../../src/screens/AppStack/Workouts/WorkoutsSelectionScreen2';
import HiitWorkoutsSelectionScreen from '../../src/screens/AppStack/Workouts/HiitWorkoutsSelectionScreen';
import WorkoutInfoScreen from '../../src/screens/AppStack/Workouts/WorkoutInfoScreen';
import HiitWorkoutInfoScreen from '../../src/screens/AppStack/Workouts/HiitWorkoutInfoScreen';
import HiitCircuitWorkoutInfoScreen from '../../src/screens/AppStack/Workouts/HiitCircuitWorkoutInfoScreen';
import Header from '../../src/components/Shared/Header';
import {
  workoutsBackButtonMap,
  workoutsStartButtonMap,
  fadeSpec,
  fade,
  findWorkoutsSelectionTitle,
} from './utils';

const WorkoutsStack = createStackNavigator(
  {
    //WorkoutsHome: WorkoutsHomeScreen,
    WorkoutsHome: WorkoutsHomeScreen2,
    // WorkoutsSelection: WorkoutsSelectionScreen,
    WorkoutsSelection: WorkoutsSelectionScreen2,
    HiitWorkoutsSelection: HiitWorkoutsSelectionScreen,
    WorkoutInfo: WorkoutInfoScreen,
    HiitWorkoutInfo: HiitWorkoutInfoScreen,
    HiitCircuitWorkoutInfo: HiitCircuitWorkoutInfoScreen,
  },
  {
    initialRouteName: 'WorkoutsHome',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (sceneProps) => {
        const {
          scene,
          index,
          scenes,
        } = sceneProps;
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
            // withBackButton={workoutsBackButtonMap[routeName]}
            withStartButton={workoutsStartButtonMap[routeName]}
            withProfileButton={routeName === 'WorkoutsHome' ||routeName === 'WorkoutsSelection'}
            withHelpButton={routeName === 'WorkoutsHome'}
            stack="workouts"
            // headerTitleParams={
            //   findWorkoutsSelectionTitle(routeName, navigation.getParam('workoutLocation', null), navigation.getParam('workoutFocus', null), navigation.getParam('hiitWorkoutStyle', null))
            // }
          />
        );
      },
    }),
  },
);

export default WorkoutsStack;
