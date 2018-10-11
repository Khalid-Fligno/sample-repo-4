import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Video, FileSystem } from 'expo';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import WorkoutProgress from '../../../../components/Workouts/WorkoutProgress';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
import PauseButtonRow from '../../../../components/Workouts/PauseButtonRow';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Exercise3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      currentExercise: {},
      timerStart: false,
      timerReset: false,
      totalDuration: 3,
      reps: null,
      pauseModalVisible: false,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ exerciseList, currentExercise: exerciseList[2], reps });
  }
  componentDidMount() {
    this.startTimer();
    try {
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-2.mp4`, { idempotent: true });
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
      this.props.navigation.replace('Exercise4', {
        exerciseList,
        reps,
      });
    } else {
      this.props.navigation.replace('Exercise3', {
        exerciseList,
        reps,
        setCount,
      });
    }
  }
  handlePause = () => {
    this.setState({
      timerStart: false,
      timerReset: false,
    });
    this.togglePauseModal();
  }
  handleUnpause = () => {
    this.togglePauseModal();
    this.setState({
      timerStart: true,
      timerReset: false,
    });
  }
  togglePauseModal = () => {
    this.setState((prevState) => ({ pauseModalVisible: !prevState.pauseModalVisible }));
  }
  quitWorkout = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to quit this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.togglePauseModal();
            this.props.navigation.navigate('WorkoutsHome');
          },
        },
      ],
      { cancelable: false },
    );
  }
  restartWorkout = (exerciseList, reps) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to restart this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.replace('Countdown', { exerciseList, reps });
          },
        },
      ],
      { cancelable: false },
    );
  }
  render() {
    const {
      currentExercise,
      exerciseList,
      timerStart,
      timerReset,
      totalDuration,
      reps,
      pauseModalVisible,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FadeInView
          duration={1000}
          style={styles.flexContainer}
        >
          <Video
            source={{ uri: `${FileSystem.cacheDirectory}exercise-3.mp4` }}
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
          />
          <WorkoutProgress
            currentExercise={3}
            currentSet={this.props.navigation.getParam('setCount', 0) + 1}
          />
          <PauseButtonRow
            handlePause={this.handlePause}
            nextExerciseName={exerciseList[1].name}
          />
          <WorkoutPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleRestart={this.restartWorkout}
            handleUnpause={this.handleUnpause}
            exerciseList={exerciseList}
            reps={reps}
          />
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
});
