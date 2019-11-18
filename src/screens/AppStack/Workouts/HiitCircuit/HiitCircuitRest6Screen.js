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
import FastImage from 'react-native-fast-image';
import FadeInView from 'react-native-fade-in-view';
import appsFlyer from 'react-native-appsflyer';
import { db } from '../../../../../config/firebase';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import HiitCircuitWorkoutProgress from '../../../../components/Workouts/HiitCircuitWorkoutProgress';
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
const restIntervalMap = {
  1: 30,
  2: 20,
  3: 10,
};

export default class HiitCircuitRest6Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: props.navigation.getParam('exerciseList', null),
      fitnessLevel: props.navigation.getParam('fitnessLevel', null),
      timerStart: false,
      totalDuration: restIntervalMap[this.props.navigation.getParam('fitnessLevel', null)],
      pauseModalVisible: false,
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
        const newHiitWeeklyComplete = userDoc.data().weeklyTargets.hiitWeeklyComplete + 1;
        const oldWeeklyTargets = userDoc.data().weeklyTargets;
        const newWeeklyTargets = updateWeeklyTargets(oldWeeklyTargets, 'hiitWeeklyComplete', newHiitWeeklyComplete);
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
  handleFinish = async (exerciseList, fitnessLevel) => {
    this.setState({ timerStart: false });
    const setCount = this.props.navigation.getParam('setCount', 1) + 1;
    if (setCount === 4) {
      appsFlyer.trackEvent('complete_hiit_circuit_workout');
      this.updateWeekly();
      this.props.navigation.replace('HiitCircuitWorkoutComplete', {
        exerciseList,
        fitnessLevel,
      });
    } else {
      this.props.navigation.replace('HiitCircuitExercise1', {
        exerciseList,
        fitnessLevel,
        setCount,
      });
    }
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
  handleQuitWorkout = async () => {
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
  restartWorkout = (exerciseList, fitnessLevel) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to restart this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.replace('HiitCircuitExercise6', {
              exerciseList,
              fitnessLevel,
              setCount: this.props.navigation.getParam('setCount', 0),
            });
          },
        },
      ],
      { cancelable: false },
    );
  }
  skipExercise = (exerciseList, fitnessLevel) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to skip this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => this.handleFinish(exerciseList, fitnessLevel),
        },
      ],
      { cancelable: false },
    );
  }
  showExerciseInfoModal = () => {
    this.setState({
      timerStart: false,
      exerciseInfoModalVisible: true,
    });
  }
  hideExerciseInfoModal = () => {
    this.setState({
      timerStart: true,
      exerciseInfoModalVisible: false,
    });
  }
  render() {
    const {
      exerciseList,
      timerStart,
      totalDuration,
      fitnessLevel,
      pauseModalVisible,
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
            <FastImage
              source={require('../../../../../assets/images/hiit-rest-placeholder.jpg')}
              style={{ width, height: width }}
            />
            <ExerciseInfoButton onPress={this.showExerciseInfoModal} />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              handleFinish={() => this.handleFinish(exerciseList, fitnessLevel)}
            />
          </View>
          <View style={styles.currentExerciseTextContainer}>
            <View style={styles.currentExerciseNameTextContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.currentExerciseNameText}
              >
                REST
              </Text>
            </View>
            <View style={styles.currentExerciseRepsTextContainer}>
              <Text style={styles.currentExerciseRepsText}>
                {restIntervalMap[this.props.navigation.getParam('fitnessLevel', null)]} sec
              </Text>
            </View>
          </View>
          <HiitCircuitWorkoutProgress
            currentExercise={6}
            currentSet={this.props.navigation.getParam('setCount', 1)}
          />
          <PauseButtonRow
            handlePause={this.handlePause}
            nextExerciseName={(this.props.navigation.getParam('setCount', 1) === 3 && 'NEARLY DONE!') || exerciseList[0].name}
          />
          <WorkoutPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleRestart={this.restartWorkout}
            handleSkip={this.skipExercise}
            handleUnpause={this.handleUnpause}
            exerciseList={exerciseList}
            fitnessLevel={fitnessLevel}
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
