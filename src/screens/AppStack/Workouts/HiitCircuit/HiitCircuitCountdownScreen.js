import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, AppState, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import CountdownTimer from '../../../../components/Workouts/CountdownTimer';
import CountdownPauseModal from '../../../../components/Workouts/CountdownPauseModal';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

export default class HiitCircuitCountdownScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: this.props.navigation.getParam('exerciseList', null),
      fitnessLevel: this.props.navigation.getParam('fitnessLevel', null),
      countdownDuration: 5,
      timerStart: false,
      pauseModalVisible: false,
      appState: AppState.currentState,
    };
  }
  componentDidMount() {
    this.startTimer();
    this.checkVideoCache();
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  handleAppStateChange = async (nextAppState) => {
    const { appState } = this.state;
    if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.handlePause();
      await Audio.setIsEnabledAsync(true);
    }
    this.setState({ appState: nextAppState });
  }
  startTimer = () => {
    this.setState({ timerStart: true });
  }
  handlePause = () => {
    this.setState({
      timerStart: false,
      pauseModalVisible: true,
    });
  }
  handleUnpause = () => {
    this.setState({
      timerStart: true,
      pauseModalVisible: false,
    });
  }
  handleQuitWorkout = () => {
    this.setState({ pauseModalVisible: false });
    this.props.navigation.navigate('Workouts');
    const exerciseVideos = [
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
  checkVideoCache = async () => {
    const { exerciseList } = this.state;
    const video1 = await FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}exercise-hiit-circuit-1.mp4`);
    if (!video1.exists) {
      Promise.all(exerciseList.map(async (exercise, index) => {
        FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-hiit-circuit-${index + 1}.mp4`,
        );
      }));
    }
  }
  finishCountdown = (exerciseList, fitnessLevel) => {
    this.props.navigation.replace('HiitCircuitExercise1', {
      exerciseList,
      fitnessLevel,
    });
  }
  render() {
    const {
      exerciseList,
      countdownDuration,
      fitnessLevel,
      timerStart,
      pauseModalVisible,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.countdownContainer}>
          <CountdownTimer
            totalDuration={countdownDuration}
            start={timerStart}
            handleFinish={() => this.finishCountdown(exerciseList, fitnessLevel)}
          />
          <Text style={styles.countdownText}>
            GET READY!
          </Text>
          <CountdownPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleUnpause={this.handleUnpause}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  countdownContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.standard,
  },
});
