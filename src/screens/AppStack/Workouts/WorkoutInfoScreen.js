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
    };
  }
  componentWillMount = async () => {
    const exercises = this.props.navigation.getParam('exercises', null);
    await this.fetchWorkout(exercises);
  }
  fetchWorkout = (exercises) => {
    try {
      const exerciseList = [];
      exercises.forEach((exercise) => {
        db.collection('exercises')
          .doc(exercise.id)
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
    await Promise.all(exerciseList.map(async (exercise, index) => {
      await FileSystem.downloadAsync(
        exercise.videoURL,
        `${FileSystem.documentDirectory}exercise-${index + 1}.mp4`,
      );
    }));
    this.setState({ loading: false });
    this.props.navigation.navigate('Exercise1', { exerciseList });
  }
  render() {
    const { exerciseList, loading } = this.state;
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
          Workout Info Screen
        </Text>
        <Text
          onPress={() => this.loadExercises(exerciseList)}
        >
          Start
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
