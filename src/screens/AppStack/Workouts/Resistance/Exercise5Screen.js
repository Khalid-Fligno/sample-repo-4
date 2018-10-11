import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Video, FileSystem } from 'expo';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import WorkoutProgress from '../../../../components/Workouts/WorkoutProgress';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get('window');

export const workoutTimerStyle = {
  container: {
    width,
    backgroundColor: colors.charcoal.standard,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: 72,
    color: colors.white,
  },
};

export default class Exercise5Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      currentExercise: {},
      timerStart: false,
      timerReset: false,
      totalDuration: 60,
      reps: null,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ exerciseList, currentExercise: exerciseList[4], reps });
  }
  componentDidMount() {
    this.startTimer();
    try {
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-4.mp4`, { idempotent: true });
    } catch (err) {
      console.log(err);
    }
  }
  startTimer = () => {
    this.setState({
      timerStart: true,
      timerReset: false,
    });
  }
  handleFinish = (exerciseList, reps) => {
    this.setState({
      timerStart: false,
      timerReset: false,
    });
    let setCount = this.props.navigation.getParam('setCount', 0);
    setCount += 1;
    if (setCount === 3) {
      this.props.navigation.replace('Exercise6', {
        exerciseList,
        reps,
      });
    } else {
      this.props.navigation.replace('Exercise5', {
        exerciseList,
        reps,
        setCount,
      });
    }
  }
  render() {
    const {
      currentExercise,
      exerciseList,
      timerStart,
      timerReset,
      totalDuration,
      reps,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FadeInView
          duration={1000}
          style={styles.flexContainer}
        >
          <Video
            source={{ uri: `${FileSystem.cacheDirectory}exercise-5.mp4` }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={{ width, height: width }}
          />
          <View style={styles.currentExerciseTextContainer}>
            <View style={styles.currentExerciseNameTextContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.currentExerciseNameText}
              >
                {currentExercise.name.toUpperCase()}
              </Text>
            </View>
            <View style={styles.currentExerciseRepsTextContainer}>
              <Text style={styles.currentExerciseRepsText}>
                {reps} REPS
              </Text>
            </View>
          </View>
          <WorkoutTimer
            totalDuration={totalDuration}
            start={timerStart}
            reset={timerReset}
            handleFinish={() => this.handleFinish(exerciseList, reps)}
            options={workoutTimerStyle}
          />
          <WorkoutProgress
            currentExercise={5}
            currentSet={this.props.navigation.getParam('setCount', 0) + 1}
          />
          <Text>
            <Text style={styles.nextExercise}> NEXT EXERCISE: </Text>
            <Text style={styles.nextExerciseName}>{exerciseList[5].name.toUpperCase()}</Text>
          </Text>
        </FadeInView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  currentExerciseTextContainer: {
    width,
    flexDirection: 'row',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  currentExerciseNameTextContainer: {
    width: width - 100,
  },
  currentExerciseNameText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.coral.standard,
  },
  currentExerciseRepsTextContainer: {
    width: 100,
  },
  currentExerciseRepsText: {
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  nextExercise: {
    fontFamily: fonts.standard,
    fontSize: 12,
  },
  nextExerciseName: {
    fontFamily: fonts.bold,
    fontSize: 12,
  },
});
