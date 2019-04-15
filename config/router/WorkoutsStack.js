import React from 'react';
import { createStackNavigator } from 'react-navigation';
import WorkoutsHomeScreen from '../../src/screens/AppStack/Workouts/WorkoutsHomeScreen';
import WorkoutsSelectionScreen from '../../src/screens/AppStack/Workouts/WorkoutsSelectionScreen';
import HiitWorkoutsSelectionScreen from '../../src/screens/AppStack/Workouts/HiitWorkoutsSelectionScreen';
import WorkoutInfoScreen from '../../src/screens/AppStack/Workouts/WorkoutInfoScreen';
import HiitWorkoutInfoScreen from '../../src/screens/AppStack/Workouts/HiitWorkoutInfoScreen';
import Header from '../../src/components/Shared/Header';
import {
  workoutsBackButtonMap,
  fadeSpec,
  fade,
<<<<<<< HEAD
  findWorkoutsSelectionTitle,
=======
  workoutLocationMap,
  workoutFocusMap,
>>>>>>> Correct naming for workout focus variables
} from './utils';

const WorkoutsStack = createStackNavigator(
  {
    WorkoutsHome: WorkoutsHomeScreen,
    WorkoutsSelection: WorkoutsSelectionScreen,
    HiitWorkoutsSelection: HiitWorkoutsSelectionScreen,
    WorkoutInfo: WorkoutInfoScreen,
    HiitWorkoutInfo: HiitWorkoutInfoScreen,
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
    navigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;
        return (
          <Header
            navigation={navigation}
            withBackButton={workoutsBackButtonMap[routeName]}
            withStartButton={routeName === 'WorkoutInfo' || routeName === 'HiitWorkoutInfo'}
            withProfileButton={routeName === 'WorkoutsHome'}
            withHelpButton={routeName === 'WorkoutsHome'}
            stack="workouts"
<<<<<<< HEAD
            headerTitleParams={findWorkoutsSelectionTitle(routeName, navigation.getParam('workoutLocation', null), navigation.getParam('workoutFocus', null), navigation.getParam('hiitWorkoutStyle', null))}
=======
            headerTitleParams={routeName === 'WorkoutsSelection' ? `${workoutLocationMap[navigation.getParam('workoutLocation', null)]} / ${workoutFocusMap[navigation.getParam('workoutFocus', null)]}` : null}
>>>>>>> Correct naming for workout focus variables
          />
        );
      },
    }),
  },
);

export default WorkoutsStack;
