import React from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage } from 'react-native';
import { FileSystem } from 'expo';
import moment from 'moment';
import sortBy from 'lodash.sortby';
import { db } from '../../../../config/firebase';
import { findReps } from '../../../utils/index';
import Loader from '../../../components/Shared/Loader';
import WorkoutTile from '../../../components/Workouts/WorkoutTile';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class WorkoutsSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
      loading: false,
      completedWorkoutTally: undefined,
    };
  }
  componentDidMount = async () => {
    await this.fetchWorkouts();
    this.fetchTargetInfo();
  }
  componentWillUnmount = async () => {
    await this.unsubscribe();
  }
  fetchWorkouts = async () => {
    this.setState({ loading: true });
    const type = this.props.navigation.getParam('workoutType', null);
    const location = this.props.navigation.getParam('workoutLocation', null);
    this.unsubscribe = await db.collection('workouts')
      .where(type, '==', true)
      .where(location, '==', true)
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
    userRef.onSnapshot(async (doc) => {
      this.setState({
        completedWorkoutTally: await doc.data().completedWorkoutTally,
      });
      if (await doc.data().completedWorkoutTally.cycleStartDate < moment().startOf('week').subtract(11, 'weeks').format('YYYY-MM-DD')) {
        const data = {
          completedWorkoutTally: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
            12: 0,
            cycleStartDate: moment().startOf('week').format('YYYY-MM-DD'),
          },
        };
        await userRef.set(data, { merge: true });
      }
    });
  }
  loadExercises = async (workout) => {
    this.setState({ loading: true });
    const fitnessLevel = await AsyncStorage.getItem('fitnessLevel');
    const { exercises } = workout;
    try {
      await Promise.all(exercises.map(async (exercise, index) => {
        await FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
        );
      }));
      this.setState({ loading: false });
      this.props.navigation.navigate('WorkoutInfo', { workout, reps: findReps(fitnessLevel) });
    } catch (err) {
      console.log(`Filesystem download error: ${err}`);
    }
  }
  render() {
    const { workouts, loading, completedWorkoutTally } = this.state;
    const workoutList = sortBy(workouts, 'resistanceCategoryId').map((workout) => (
      <WorkoutTile
        key={workout.id}
        title1={workout.name.toUpperCase()}
        // image={require('../../../../assets/images/workouts-upper.jpg')}
        onPress={() => this.loadExercises(workout)}
        disabled={workout.disabled}
        completedWorkoutTally={completedWorkoutTally}
        resistanceCategoryId={workout.resistanceCategoryId}
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
  buttonContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    width: width - 30,
    backgroundColor: colors.coral.standard,
    borderRadius: 4,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginTop: 3,
  },
  workoutButton: {
    opacity: 0.9,
    flex: 1,
    justifyContent: 'flex-end',
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
    paddingLeft: 20,
    paddingBottom: 5,
    borderRadius: 4,
    backgroundColor: colors.coral.standard,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  workoutButtonText: {
    fontFamily: fonts.boldItalic,
    fontSize: 34,
    color: colors.white,
  },
});
