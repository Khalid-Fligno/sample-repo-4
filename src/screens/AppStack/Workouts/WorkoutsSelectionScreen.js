import React from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { FileSystem } from 'expo';
// import moment from 'moment';
import sortBy from 'lodash.sortby';
import { db } from '../../../../config/firebase';
import { findReps } from '../../../utils/index';
import Loader from '../../../components/Shared/Loader';
import WorkoutTile from '../../../components/Workouts/WorkoutTile';
import colors from '../../../styles/colors';

export default class WorkoutsSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
      loading: false,
      cycleTargets: undefined,
    };
  }
  componentDidMount = async () => {
    await this.fetchWorkouts();
    this.fetchTargetInfo();
  }
  componentWillUnmount = async () => {
    await this.unsubscribe();
    await this.unsubscribe2();
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
      await Promise.all(exercises.map(async (exercise, index) => {
        await FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
        );
      }));
      this.setState({ loading: false });
      this.props.navigation.navigate('WorkoutInfo', { workout, reps: findReps(fitnessLevel) });
    } catch (err) {
      Alert.alert('Filesystem download error', `${err}`);
    }
  }
  render() {
    const { workouts, loading, cycleTargets } = this.state;
    const workoutList = sortBy(workouts, 'resistanceCategoryId').map((workout) => (
      <WorkoutTile
        key={workout.id}
        title1={workout.displayName}
        // image={require('../../../../assets/images/workouts-upper.jpg')}
        onPress={() => this.loadExercises(workout)}
        disabled={workout.disabled}
        cycleTargets={cycleTargets}
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
});
