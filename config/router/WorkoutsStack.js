import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import WorkoutsHomeScreen2 from '../../src/screens/AppStack/Workouts/WorkoutsHomeScreen2';
import WorkoutsSelectionScreen2 from '../../src/screens/AppStack/Workouts/WorkoutsSelectionScreen2';
import Header from '../../src/components/Shared/Header';
import {
  workoutsBackButtonMap,
  workoutsStartButtonMap,
  fadeSpec,
  fade,
  findWorkoutsSelectionTitle,
} from './utils';
import WorkoutInfoScreen2 from '../../src/screens/AppStack/Workouts/WorkoutInfoScreen2';

const WorkoutsStack = createStackNavigator(
  {
    WorkoutsHome: WorkoutsHomeScreen2,
    WorkoutsSelection: WorkoutsSelectionScreen2,
    WorkoutInfo: WorkoutInfoScreen2,
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
            withBackButton={workoutsBackButtonMap[routeName]}
            withStartButton={workoutsStartButtonMap[routeName]}
            withProfileButton={routeName === 'WorkoutsHome' ||routeName === 'WorkoutsSelection'}
            // withHandleBackToCalendar = {routeName === 'WorkoutInfo'}
            // withHelpButton={routeName === 'WorkoutsHome'}
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
