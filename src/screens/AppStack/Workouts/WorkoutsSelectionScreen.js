import React from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
// import moment from 'moment';
import sortBy from 'lodash.sortby';
import { db } from '../../../../config/firebase';
import { findReps } from '../../../utils/index';
import Loader from '../../../components/Shared/Loader';
import WorkoutTile from '../../../components/Workouts/WorkoutTile';
import colors from '../../../styles/colors';

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
      cycleTargets: undefined,
      location: props.navigation.getParam('workoutLocation', null),
    };
  }
  componentDidMount = async () => {
    await this.fetchWorkouts();
    await this.fetchTargetInfo();
  }
  componentWillUnmount = async () => {
    await this.unsubscribe();
    await this.unsubscribe2();
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
  fetchTargetInfo = async () => {
    const uid = await AsyncStorage.getItem('uid', null);
    const userRef = db.collection('users').doc(uid);
    this.unsubscribe2 = userRef.onSnapshot(async (doc) => {
      this.setState({
        cycleTargets: await doc.data().cycleTargets,
      });
      // if (await doc.data().cycleTargets.cycleStartDate < moment().startOf('week').subtract(11, 'weeks').format('YYYY-MM-DD')) {
      //   const data = {
      //     cycleTargets: {
      //       1: 0,
      //       2: 0,
      //       3: 0,
      //       4: 0,
      //       5: 0,
      //       6: 0,
      //       7: 0,
      //       8: 0,
      //       9: 0,
      //       10: 0,
      //       11: 0,
      //       12: 0,
      //       cycleStartDate: moment().startOf('week').format('YYYY-MM-DD'),
      //     },
      //   };
      //   await userRef.set(data, { merge: true });
      // }
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
      cycleTargets,
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
        cycleTargets={cycleTargets}
      />
    ));

    return (
      <View style={styles.container}>
        {workoutList}
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
});
