import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FileSystem } from 'expo';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';

export default class WorkoutInfoScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      loading: false,
      workout: null,
    };
  }
  componentWillMount = async () => {
    const exercises = this.props.navigation.getParam('exercises', null);
    const workout = this.props.navigation.getParam('workout', null);
    this.setState({ workout });
    await this.fetchWorkout(exercises);
    this.props.navigation.setParams({
      handleStart: () => this.loadExercises(this.state.exerciseList),
    });
  }
  fetchWorkout = (exercises) => {
    try {
      const exerciseList = [];
      exercises.forEach((exercise) => {
        db.collection('exercises')
          .doc(exercise)
          .onSnapshot(async (doc) => {
            const exerciseObject = await doc.data();
            exerciseList.push(exerciseObject);
          });
      });
      this.setState({ exerciseList });
    } catch (err) {
      console.log(err);
    }
  }
  loadExercises = async (exerciseList) => {
    this.setState({ loading: true });
    try {
      await Promise.all(exerciseList.map(async (exercise, index) => {
        await FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
        );
      }));
      this.setState({ loading: false });
      this.props.navigation.navigate('Exercise1', { exerciseList });
    } catch (err) {
      console.log(`Filesystem download error: ${err}`);
    }
  }
  render() {
    const { loading } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
      );
    }
    return (
      <View style={styles.container}>
        <Text>
          Workout Info Screen {this.state.workout && this.state.workout.name}
        </Text>
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
  },
});
