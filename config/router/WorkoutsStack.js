import React from 'react';
import { createStackNavigator } from 'react-navigation';
import WorkoutsHomeScreen from '../../src/screens/AppStack/Workouts/WorkoutsHomeScreen';
import WorkoutsLocationScreen from '../../src/screens/AppStack/Workouts/WorkoutsLocationScreen';
import WorkoutsSelectionScreen from '../../src/screens/AppStack/Workouts/WorkoutsSelectionScreen';
import WorkoutInfoScreen from '../../src/screens/AppStack/Workouts/WorkoutInfoScreen';
import Header from '../../src/components/Header';
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
            withStartButton={routeName === 'WorkoutInfo'}
            withProfileButton={routeName === 'WorkoutsHome'}
            stack="workouts"
          />
        );
      },
    }),
  },
);

export default WorkoutsStack;
