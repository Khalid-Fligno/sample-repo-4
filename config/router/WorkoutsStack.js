import React from 'react';
import { createStackNavigator } from 'react-navigation';
import WorkoutsHomeScreen from '../../src/screens/AppStack/Workouts/WorkoutsHomeScreen';
import WorkoutsLocationScreen from '../../src/screens/AppStack/Workouts/WorkoutsLocationScreen';
import WorkoutsSelectionScreen from '../../src/screens/AppStack/Workouts/WorkoutsSelectionScreen';
import WorkoutInfoScreen from '../../src/screens/AppStack/Workouts/WorkoutInfoScreen';
import HiitWorkoutInfoScreen from '../../src/screens/AppStack/Workouts/HiitWorkoutInfoScreen';
import Header from '../../src/components/Shared/Header';
import {
  workoutsBackButtonMap,
  fadeSpec,
  fade,
} from './utils';

const WorkoutsStack = createStackNavigator(
  {
    WorkoutsHome: WorkoutsHomeScreen,
    WorkoutsLocation: WorkoutsLocationScreen,
    WorkoutsSelection: WorkoutsSelectionScreen,
    WorkoutInfo: WorkoutInfoScreen,
    HiitWorkoutInfo: HiitWorkoutInfoScreen,
  },
  {
    initialRouteName: 'WorkoutsHome',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
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
          />
        );
      },
    }),
  },
);

export default WorkoutsStack;
