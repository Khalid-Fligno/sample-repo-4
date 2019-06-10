import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, Alert, AppState } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FileSystem } from 'expo';
import Video from 'react-native-video';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import HiitWorkoutProgress from '../../../../components/Workouts/HiitWorkoutProgress';
import ExerciseInfoModal from '../../../../components/Workouts/ExerciseInfoModal';
import ExerciseInfoButton from '../../../../components/Workouts/ExerciseInfoButton';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
import PauseButtonRow from '../../../../components/Workouts/PauseButtonRow';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get('window');

const workIntervalMap = {
  1: 40,
  2: 60,
  3: 80,
};

export default class HiitExercise1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: this.props.navigation.getParam('exerciseList', null),
      currentExercise: this.props.navigation.getParam('exerciseList', null)[0],
      fitnessLevel: this.props.navigation.getParam('fitnessLevel', null),
      totalDuration: workIntervalMap[this.props.navigation.getParam('fitnessLevel', null)],
      timerStart: false,
      pauseModalVisible: false,
      videoPaused: false,
      exerciseInfoModalVisible: false,
      appState: AppState.currentState,
    };
  }
  componentDidMount() {
    this.startTimer();
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  handleAppStateChange = (nextAppState) => {
    const { appState } = this.state;
    if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.handlePause();
    }
    this.setState({ appState: nextAppState });
  }
  startTimer = () => {
    this.setState({ timerStart: true });
  }
  handleFinish = (exerciseList, fitnessLevel, selectedHiitWorkoutIndex) => {
    this.setState({ timerStart: false });
    const roundCount = this.props.navigation.getParam('roundCount', 0);
    this.props.navigation.replace('HiitExercise2', {
      exerciseList,
      fitnessLevel,
      roundCount,
      selectedHiitWorkoutIndex,
    });
  }
  handlePause = () => {
    this.setState({
      videoPaused: true,
      timerStart: false,
      pauseModalVisible: true,
    });
  }
  handleUnpause = () => {
    this.setState({
      videoPaused: false,
      timerStart: true,
      pauseModalVisible: false,
    });
  }
  handleQuitWorkout = () => {
    this.setState({ pauseModalVisible: false });
    this.props.navigation.navigate('Workouts');
    FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-hiit-1.mp4`, { idempotent: true });
  }
  quitWorkout = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to quit this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: this.handleQuitWorkout,
        },
      ],
      { cancelable: false },
    );
  }
  restartWorkout = (exerciseList, fitnessLevel) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to restart this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.replace('HiitExercise1', {
              exerciseList,
              fitnessLevel,
              roundCount: this.props.navigation.getParam('roundCount', 0),
            });
          },
        },
      ],
      { cancelable: false },
    );
  }
  showExerciseInfoModal = () => {
    this.setState({
      videoPaused: true,
      timerStart: false,
      exerciseInfoModalVisible: true,
    });
  }
  hideExerciseInfoModal = () => {
    this.setState({
      videoPaused: false,
      timerStart: true,
      exerciseInfoModalVisible: false,
    });
  }
  render() {
    const {
      currentExercise,
      exerciseList,
      timerStart,
      totalDuration,
      fitnessLevel,
      pauseModalVisible,
      videoPaused,
      exerciseInfoModalVisible,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FadeInView
          duration={1000}
          style={styles.flexContainer}
        >
          <View>
            <Video
              ref={(ref) => this.videoRef = ref}
              source={{ uri: `${FileSystem.cacheDirectory}exercise-hiit-1.mp4` || exerciseList[0].videoURL }}
              muted
              resizeMode="contain"
              repeat
              paused={videoPaused}
              style={{ width, height: width }}
            />
            <ExerciseInfoButton onPress={() => this.showExerciseInfoModal()} />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              handleFinish={() => this.handleFinish(exerciseList, fitnessLevel)}
            />
          </View>
          <View style={styles.currentExerciseTextContainer}>
            <View style={styles.currentExerciseNameTextContainer}>
              <Text style={styles.currentExerciseNameText}>
                {currentExercise.name.toUpperCase()}
              </Text>
            </View>
            <View style={styles.currentExerciseRepsTextContainer}>
              <Text style={styles.currentExerciseRepsText}>
                {workIntervalMap[this.props.navigation.getParam('fitnessLevel', null)]} sec
              </Text>
            </View>
          </View>
          <HiitWorkoutProgress
            currentRound={this.props.navigation.getParam('roundCount', 0) + 1}
            currentSet={1}
          />
          <PauseButtonRow
            handlePause={this.handlePause}
            nextExerciseName="REST"
          />
          <WorkoutPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleRestart={this.restartWorkout}
            handleUnpause={this.handleUnpause}
            exerciseList={exerciseList}
            fitnessLevel={fitnessLevel}
          />
          <ExerciseInfoModal
            exercise={exerciseList[0]}
            exerciseInfoModalVisible={exerciseInfoModalVisible}
            hideExerciseInfoModal={this.hideExerciseInfoModal}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
    backgroundColor: colors.white,
  },
  currentExerciseNameTextContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.coral.standard,
    marginLeft: 15,
  },
  currentExerciseRepsTextContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  currentExerciseRepsText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    marginRight: 15,
  },
});
