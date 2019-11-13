import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  Alert,
  AppState,
  AsyncStorage,
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import Video from 'react-native-video';
import FadeInView from 'react-native-fade-in-view';
import appsFlyer from 'react-native-appsflyer';
import { db } from '../../../../../config/firebase';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import WorkoutProgress from '../../../../components/Workouts/WorkoutProgress';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
import ExerciseInfoModal from '../../../../components/Workouts/ExerciseInfoModal';
import ExerciseInfoButton from '../../../../components/Workouts/ExerciseInfoButton';
import PauseButtonRow from '../../../../components/Workouts/PauseButtonRow';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get('window');

const updateWeeklyTargets = (obj, field, newTally) => {
  return Object.assign({}, obj, { [field]: newTally });
};

export default class Exercise6Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: props.navigation.getParam('exerciseList', null),
      currentExercise: props.navigation.getParam('exerciseList', null)[5],
      reps: props.navigation.getParam('reps', null),
      resistanceCategoryId: props.navigation.getParam('resistanceCategoryId', null),
      timerStart: false,
      totalDuration: 60,
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
  updateWeekly = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newResistanceWeeklyComplete = userDoc.data().weeklyTargets.resistanceWeeklyComplete + 1;
        const oldWeeklyTargets = userDoc.data().weeklyTargets;
        const newWeeklyTargets = updateWeeklyTargets(oldWeeklyTargets, 'resistanceWeeklyComplete', newResistanceWeeklyComplete);
        transaction.update(userRef, { weeklyTargets: newWeeklyTargets });
      });
    });
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
  handleFinish = (exerciseList, reps, resistanceCategoryId) => {
    this.setState({ timerStart: false });
    let setCount = this.props.navigation.getParam('setCount', 0);
    setCount += 1;
    if (setCount === 3) {
      appsFlyer.trackEvent('resistance_workout_complete');
      this.updateWeekly();
      this.props.navigation.replace('WorkoutComplete', {
        exerciseList,
        reps,
        resistanceCategoryId,
      });
    } else {
      this.props.navigation.replace('Exercise6', {
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
  handleQuitWorkout = async () => {
    this.setState({ pauseModalVisible: false });
    this.props.navigation.navigate('Workouts');
    const exerciseVideos = [
      `${FileSystem.cacheDirectory}exercise-1.mp4`,
      `${FileSystem.cacheDirectory}exercise-2.mp4`,
      `${FileSystem.cacheDirectory}exercise-3.mp4`,
      `${FileSystem.cacheDirectory}exercise-4.mp4`,
      `${FileSystem.cacheDirectory}exercise-5.mp4`,
      `${FileSystem.cacheDirectory}exercise-6.mp4`,
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
  restartWorkout = (exerciseList, reps) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to restart this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.replace('Exercise6', {
              exerciseList,
              reps,
              setCount: this.props.navigation.getParam('setCount', 0),
              resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
            });
          },
        },
      ],
      { cancelable: false },
    );
  }
  skipExercise = (exerciseList, reps) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to skip this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            appsFlyer.trackEvent('resistance_workout_complete');
            this.updateWeekly();
            this.props.navigation.replace('WorkoutComplete', {
              exerciseList,
              reps,
              resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
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
      reps,
      pauseModalVisible,
      resistanceCategoryId,
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
              source={{ uri: `${FileSystem.cacheDirectory}exercise-6.mp4` || exerciseList[5].videoURL }}
              resizeMode="contain"
              repeat
              muted
              paused={videoPaused}
              style={{ width, height: width }}
            />
            <ExerciseInfoButton onPress={this.showExerciseInfoModal} />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
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
            currentExercise={6}
            currentSet={this.props.navigation.getParam('setCount', 0) + 1}
          />
          <PauseButtonRow
            handlePause={this.handlePause}
            nextExerciseName="NEARLY DONE!"
            lastExercise
          />
          <WorkoutPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleRestart={this.restartWorkout}
            handleSkip={this.skipExercise}
            handleUnpause={this.handleUnpause}
            exerciseList={exerciseList}
            reps={reps}
          />
          <ExerciseInfoModal
            exercise={exerciseList[5]}
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
