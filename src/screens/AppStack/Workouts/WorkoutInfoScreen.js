import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { FileSystem } from 'expo';
import { db, auth } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

const findReps = (fitnessLevel) => {
  if (fitnessLevel === '1') {
    return 8;
  } else if (fitnessLevel === '2') {
    return 12;
  } else if (fitnessLevel === '3') {
    return 16;
  }
  return 12;
};

export default class WorkoutInfoScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      workout: null,
      reps: null,
    };
  }
  componentDidMount = async () => {
    const workout = this.props.navigation.getParam('workout', null);
    this.setState({ workout });
    this.props.navigation.setParams({
      handleStart: () => this.loadExercises(workout.exercises),
    });
    const user = auth.currentUser;
    if (user) {
      db.collection('users')
        .doc(user.uid)
        .get()
        .then(async (doc) => {
          if (doc.exists) {
            const reps = findReps(await doc.data().fitnessLevel);
            this.setState({ reps });
          }
        });
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
    const { loading, workout, reps } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
      );
    }
    let workoutName;
    let exerciseDisplay;
    if (workout) {
      workoutName = workout.name;
      exerciseDisplay = workout.exercises.map((exercise, index) => {
        return (
          <View
            key={exercise.id}
            style={{
              width: width - 30,
              height: 100,
              marginTop: 7.5,
              marginBottom: 7.5,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: colors.grey.light,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 22,
                  }}
                >
                  {index + 1}. {exercise.name}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 22,
                  }}
                >
                  {reps} reps
                </Text>
              </View>
            </View>
          </View>
        );
      });
    }
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: 'center',
            paddingTop: 7.5,
            paddingBottom: 7.5,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 72,
              paddingRight: 10,
            }}
          >
            {workoutName}
          </Text>
          {exerciseDisplay}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
});
