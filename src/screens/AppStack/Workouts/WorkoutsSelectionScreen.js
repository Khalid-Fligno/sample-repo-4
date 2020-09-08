import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as FileSystem from 'expo-file-system';
// import moment from 'moment';
import sortBy from 'lodash.sortby';
import { db } from '../../../../config/firebase';
import { findReps } from '../../../utils/index';
import Loader from '../../../components/Shared/Loader';
import WorkoutTile from '../../../components/Workouts/WorkoutTile';
import colors from '../../../styles/colors';
import globalStyle from '../../../styles/globalStyles';
<<<<<<< HEAD

=======
>>>>>>> 86aeefdae6edb82ca139e702ed8edd4324a41641
const homeSplitImages = [
  require('../../../../assets/images/splitImages/NINA-1.jpg'),
  require('../../../../assets/images/splitImages/NINA-2.jpg'),
  require('../../../../assets/images/splitImages/NINA-3.jpg'),
  require('../../../../assets/images/splitImages/NINA-4.jpg'),
];

const gymSplitImages = [
  require('../../../../assets/images/splitImages/SHARNIE-1.jpg'),
  require('../../../../assets/images/splitImages/SHARNIE-2.jpg'),
  require('../../../../assets/images/splitImages/SHARNIE-3.jpg'),
  require('../../../../assets/images/splitImages/SHARNIE-4.jpg'),
];

const outdoorsSplitImages = [
  require('../../../../assets/images/splitImages/ELLE-1.jpg'),
  require('../../../../assets/images/splitImages/ELLE-2.jpg'),
  require('../../../../assets/images/splitImages/ELLE-3.jpg'),
  require('../../../../assets/images/splitImages/ELLE-4.jpg'),
];

const images = {
  gym: gymSplitImages,
  home: homeSplitImages,
  outdoors: outdoorsSplitImages,
};

export default class WorkoutsSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
      loading: false,
      location: props.navigation.getParam('workoutLocation', null),
    };
  }
  componentDidMount = async () => {
    await this.fetchWorkouts();
  }
  componentWillUnmount = async () => {
    await this.unsubscribe();
  }
  fetchWorkouts = async () => {
    this.setState({ loading: true });
    const focus = this.props.navigation.getParam('workoutFocus', null);
    const location = this.props.navigation.getParam('workoutLocation', null);
    this.unsubscribe = await db.collection('workouts')
      .where(focus, '==', true)
      .where(location, '==', true)
      .where('workoutRotation', '==', 2)
      .onSnapshot(async (querySnapshot) => {
        const workouts = [];
        await querySnapshot.forEach(async (doc) => {
          await workouts.push(await doc.data());
        });
        this.setState({ workouts, loading: false });
      });
  }
  loadExercises = async (workout) => {
    this.setState({ loading: true });
    const fitnessLevel = await AsyncStorage.getItem('fitnessLevel');
    const { exercises } = workout;
    try {
      const exerciseVideos = [
        `${FileSystem.cacheDirectory}exercise-hiit-1.mp4`,
        `${FileSystem.cacheDirectory}exercise-hiit-circuit-1.mp4`,
        `${FileSystem.cacheDirectory}exercise-hiit-circuit-2.mp4`,
        `${FileSystem.cacheDirectory}exercise-hiit-circuit-3.mp4`,
        `${FileSystem.cacheDirectory}exercise-hiit-circuit-4.mp4`,
        `${FileSystem.cacheDirectory}exercise-hiit-circuit-5.mp4`,
        `${FileSystem.cacheDirectory}exercise-hiit-circuit-6.mp4`,
      ];
      Promise.all(exerciseVideos.map(async (exerciseVideoURL) => {
        FileSystem.deleteAsync(exerciseVideoURL, { idempotent: true });
      }));
      await Promise.all(exercises.map(async (exercise, index) => {
        await FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
        );
      }));
      this.setState({ loading: false });
      this.props.navigation.navigate('WorkoutInfo', { workout, reps: findReps(fitnessLevel) });
    } catch (err) {
      this.setState({ loading: false });
      Alert.alert('Could not download exercise videos', 'Please check your internet connection');
    }
  }
  render() {
    const {
      workouts,
      loading,
      location,
    } = this.state;
    const locationImages = images[location];
    const workoutList = sortBy(workouts, 'sortOrder').map((workout, index) => (
      <WorkoutTile
        key={workout.id}
        title1={workout.displayName}
        image={locationImages[index]}
        onPress={() => this.loadExercises(workout)}
        disabled={workout.disabled}
      />
    ));

    return (
      <View style={[globalStyle.container,{paddingHorizontal:0}]}>
        {workoutList}
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
      </View>
    );
  }
}

