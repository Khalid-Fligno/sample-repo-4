import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { FileSystem } from 'expo';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import WorkoutTile from '../../../components/Workouts/WorkoutTile';
import colors from '../../../styles/colors';

const homeSplitImages = [
  require('../../../../assets/images/splitImages/NINA-1.jpg'),
  require('../../../../assets/images/splitImages/NINA-2.jpg'),
  require('../../../../assets/images/splitImages/NINA-3.jpg'),
];

const gymSplitImages = [
  require('../../../../assets/images/splitImages/SHARNIE-1.jpg'),
  require('../../../../assets/images/splitImages/SHARNIE-2.jpg'),
  require('../../../../assets/images/splitImages/SHARNIE-3.jpg'),
];

const outdoorsSplitImages = [
  require('../../../../assets/images/splitImages/ELLE-1.jpg'),
  require('../../../../assets/images/splitImages/ELLE-2.jpg'),
  require('../../../../assets/images/splitImages/ELLE-3.jpg'),
];

const images = {
  gym: gymSplitImages,
  home: homeSplitImages,
  outdoors: outdoorsSplitImages,
};

export default class HiitWorkoutsSelectionScreen extends React.PureComponent {
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
    const style = this.props.navigation.getParam('hiitWorkoutStyle', null);
    const location = this.props.navigation.getParam('workoutLocation', null);
    this.unsubscribe = await db.collection('workouts')
      .where(style, '==', true)
      .where(location, '==', true)
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
    const { exercises } = workout;
    const fitnessLevel = await AsyncStorage.getItem('fitnessLevel') || '1';
    if (workout.interval) {
      const exerciseVideos = [
        `${FileSystem.cacheDirectory}exercise-1.mp4`,
        `${FileSystem.cacheDirectory}exercise-2.mp4`,
        `${FileSystem.cacheDirectory}exercise-3.mp4`,
        `${FileSystem.cacheDirectory}exercise-4.mp4`,
        `${FileSystem.cacheDirectory}exercise-5.mp4`,
        `${FileSystem.cacheDirectory}exercise-6.mp4`,
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
      await FileSystem.downloadAsync(
        exercises[0].videoURL,
        `${FileSystem.cacheDirectory}exercise-hiit-1.mp4`,
      );
      this.setState({ loading: false });
      this.props.navigation.navigate('HiitWorkoutInfo', { workout, fitnessLevel });
    } else {
      const exerciseVideos = [
        `${FileSystem.cacheDirectory}exercise-1.mp4`,
        `${FileSystem.cacheDirectory}exercise-2.mp4`,
        `${FileSystem.cacheDirectory}exercise-3.mp4`,
        `${FileSystem.cacheDirectory}exercise-4.mp4`,
        `${FileSystem.cacheDirectory}exercise-5.mp4`,
        `${FileSystem.cacheDirectory}exercise-6.mp4`,
        `${FileSystem.cacheDirectory}exercise-hiit-1.mp4`,
      ];
      Promise.all(exerciseVideos.map(async (exerciseVideoURL) => {
        FileSystem.deleteAsync(exerciseVideoURL, { idempotent: true });
      }));
      await Promise.all(exercises.map(async (exercise, index) => {
        await FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-hiit-circuit-${index + 1}.mp4`,
        );
      }));
      this.setState({ loading: false });
      this.props.navigation.navigate('HiitCircuitWorkoutInfo', { workout, fitnessLevel });
    }
    // try {
    //   await FileSystem.downloadAsync(
    //     exercises[0].videoURL,
    //     `${FileSystem.cacheDirectory}exercise-hiit-1.mp4`,
    //   );
    //   this.setState({ loading: false });
    //   const fitnessLevel = await AsyncStorage.getItem('fitnessLevel') || '1';
    //   this.setState({ loading: false });
    //   this.props.navigation.navigate('HiitWorkoutInfo', { workout, fitnessLevel });
    // } catch (err) {
    //   this.setState({ loading: false });
    //   Alert.alert('Could not download exercise videos', 'Please check your internet connection');
    // }
  }
  render() {
    const {
      workouts,
      loading,
      location,
    } = this.state;
    const locationImages = images[location];
    const workoutList = workouts.map((workout, index) => (
      <WorkoutTile
        key={workout.id}
        title1={workout.displayName}
        image={locationImages[index]}
        onPress={() => this.loadExercises(workout)}
        disabled={workout.disabled}
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
