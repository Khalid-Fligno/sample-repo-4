import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FileSystem } from 'expo';
import Video from 'react-native-video';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import WorkoutProgress from '../../../../components/Workouts/WorkoutProgress';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
import PauseButtonRow from '../../../../components/Workouts/PauseButtonRow';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Exercise1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: props.navigation.getParam('exerciseList', null),
      currentExercise: props.navigation.getParam('exerciseList', null)[0],
      reps: props.navigation.getParam('reps', null),
      resistanceCategoryId: props.navigation.getParam('resistanceCategoryId', null),
      timerStart: false,
      timerReset: false,
      totalDuration: 60,
      pauseModalVisible: false,
      videoPaused: false,
    };
  }
  componentDidMount() {
    this.startTimer();
    this.manageVideoCache();
  }
  manageVideoCache = () => {
    const setCount = this.props.navigation.getParam('setCount', 0);
    const { exerciseList } = this.state;
    if (setCount === 0) {
      const exerciseVideos = [
        `${FileSystem.cacheDirectory}exercise-2.mp4`,
        `${FileSystem.cacheDirectory}exercise-3.mp4`,
        `${FileSystem.cacheDirectory}exercise-4.mp4`,
        `${FileSystem.cacheDirectory}exercise-5.mp4`,
        `${FileSystem.cacheDirectory}exercise-6.mp4`,
      ];
      Promise.all(exerciseVideos.map(async (exerciseVideoURL) => {
        FileSystem.deleteAsync(exerciseVideoURL, { idempotent: true });
      }));
    } else if (setCount === 2) {
      FileSystem.downloadAsync(
        exerciseList[1].videoURL,
        `${FileSystem.cacheDirectory}exercise-2.mp4`,
      );
    }
  }
  startTimer = () => {
    this.setState({
      timerStart: true,
      timerReset: false,
    });
  }
  handleFinish = async (exerciseList, reps, resistanceCategoryId) => {
    this.setState({
      timerStart: false,
      timerReset: false,
    });
    let setCount = this.props.navigation.getParam('setCount', 0);
    setCount += 1;
    if (setCount === 3) {
      this.props.navigation.replace('Exercise2', {
        exerciseList,
        reps,
        resistanceCategoryId,
      });
    } else {
      this.props.navigation.replace('Exercise1', {
        exerciseList,
        reps,
        setCount,
        resistanceCategoryId,
      });
    }
  }
  handlePause = () => {
    this.setState({
      videoPaused: true,
      timerStart: false,
      timerReset: false,
    });
    this.togglePauseModal();
  }
  handleUnpause = () => {
    this.togglePauseModal();
    this.setState({
      videoPaused: false,
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
      resistanceCategoryId,
      videoPaused,
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
              source={{ uri: `${FileSystem.cacheDirectory}exercise-1.mp4` || exerciseList[0].videoURL }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              repeat
              paused={videoPaused}
              style={{ width, height: width }}
            />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              reset={timerReset}
              handleFinish={() => this.handleFinish(exerciseList, reps, resistanceCategoryId)}
            />
          </View>
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
                x{reps}
              </Text>
            </View>
          </View>
          <WorkoutProgress
            currentExercise={1}
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
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.white,
  },
  currentExerciseNameTextContainer: {
    width: width - 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.coral.standard,
  },
  currentExerciseRepsTextContainer: {
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  currentExerciseRepsText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
  },
});
