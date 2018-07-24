import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
import { FileSystem, Video } from 'expo';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

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
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ workout, reps });
    this.props.navigation.setParams({
      handleStart: () => this.props.navigation.navigate('Exercise1', { exerciseList: workout.exercises }),
    });
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
            style={styles.exerciseTile}
          >
            <View style={styles.exerciseTileHeaderBar}>
              <View>
                <Text style={styles.exerciseTileHeaderTextLeft}>
                  {index + 1}. {exercise.name}
                </Text>
              </View>
              <View>
                <Text style={styles.exerciseTileHeaderBarRight}>
                  {reps} reps
                </Text>
              </View>
            </View>
            <Video
              source={{ uri: `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4` }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              isLooping
              style={{ width, height: width }}
            />
          </View>
        );
      });
    }
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          <Text style={styles.workoutName}>
            {workoutName}
          </Text>
          <View style={styles.workoutPreviewHeaderContainer}>
            <Text style={styles.workoutPreviewHeaderText}>
              Workout Preview
            </Text>
          </View>
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
  scrollView: {
    alignItems: 'center',
    paddingTop: 7.5,
    paddingBottom: 7.5,
  },
  workoutName: {
    fontFamily: fonts.knucklebones,
    fontSize: 72,
    paddingRight: 10,
  },
  workoutPreviewHeaderContainer: {
    width,
    backgroundColor: colors.coral.standard,
    marginBottom: 7.5,
  },
  workoutPreviewHeaderText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
    paddingTop: 8,
    paddingBottom: 5,
  },
  exerciseTile: {
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.coral.standard,
    overflow: 'hidden',
  },
  exerciseTileHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingBottom: 5,
    backgroundColor: colors.coral.standard,
  },
  exerciseTileHeaderTextLeft: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: 'white',
  },
  exerciseTileHeaderBarRight: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: 'white',
  },
});
