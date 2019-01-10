import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { FileSystem } from 'expo';
import Video from 'react-native-video';
import FadeInView from 'react-native-fade-in-view';
import Icon from '../../../../components/Shared/Icon';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import HiitWorkoutProgress from '../../../../components/Workouts/HiitWorkoutProgress';
import ExerciseInfoModal from '../../../../components/Workouts/ExerciseInfoModal';
import ExerciseInfoButton from '../../../../components/Workouts/ExerciseInfoButton';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get('window');

const workIntervalMap = {
  1: 30,
  2: 60,
  3: 90,
};

export default class HiitExercise1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: this.props.navigation.getParam('exerciseList', null),
      currentExercise: this.props.navigation.getParam('exerciseList', null)[0],
      fitnessLevel: this.props.navigation.getParam('fitnessLevel', null),
      totalDuration: workIntervalMap[this.props.navigation.getParam('fitnessLevel', null)],
      selectedHiitWorkoutIndex: this.props.navigation.getParam('selectedHiitWorkoutIndex', null),
      timerStart: false,
      timerReset: false,
      pauseModalVisible: false,
      videoPaused: false,
      exerciseInfoModalVisible: false,
    };
  }
  componentDidMount() {
    this.startTimer();
  }
  startTimer = () => {
    this.setState({
      timerStart: true,
      timerReset: false,
    });
  }
  handleFinish = (exerciseList, fitnessLevel, selectedHiitWorkoutIndex) => {
    this.setState({
      timerStart: false,
      timerReset: false,
    });
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
      timerReset: false,
      pauseModalVisible: true,
    });
  }
  handleUnpause = () => {
    this.setState({
      videoPaused: false,
      timerStart: true,
      timerReset: false,
      pauseModalVisible: false,
    });
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
            this.setState({ pauseModalVisible: false });
            this.props.navigation.navigate('WorkoutsHome');
          },
        },
      ],
      { cancelable: false },
    );
  }
  restartWorkout = (exerciseList, fitnessLevel, selectedHiitWorkoutIndex) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to restart this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.replace('HiitCountdown', { exerciseList, fitnessLevel, selectedHiitWorkoutIndex });
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
      timerReset: false,
      exerciseInfoModalVisible: true,
    });
  }
  hideExerciseInfoModal = () => {
    this.setState({
      videoPaused: false,
      timerStart: true,
      timerReset: false,
      exerciseInfoModalVisible: false,
    });
  }
  render() {
    const {
      currentExercise,
      exerciseList,
      timerStart,
      timerReset,
      totalDuration,
      fitnessLevel,
      pauseModalVisible,
      selectedHiitWorkoutIndex,
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
              source={{ uri: `${FileSystem.cacheDirectory}exercise-hiit-${selectedHiitWorkoutIndex}.mp4` || exerciseList[0].videoURL }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              repeat
              paused={videoPaused}
              style={{ width, height: width }}
            />
            <ExerciseInfoButton onPress={() => this.showExerciseInfoModal()} />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              reset={timerReset}
              handleFinish={() => this.handleFinish(exerciseList, fitnessLevel, selectedHiitWorkoutIndex)}
            />
          </View>
          <View style={styles.currentExerciseTextContainer}>
            <Text style={styles.currentExerciseNameText}>
              {currentExercise.name.toUpperCase()}
            </Text>
          </View>
          <HiitWorkoutProgress
            currentRound={this.props.navigation.getParam('roundCount', 0) + 1}
            currentSet={1}
          />
          <View style={styles.pauseButtonContainer}>
            <TouchableOpacity
              onPress={this.handlePause}
              style={styles.pauseButton}
            >
              <Icon
                name="pause"
                size={15}
                color={colors.coral.standard}
              />
              <Text style={styles.pauseButtonText}>
                PAUSE
              </Text>
            </TouchableOpacity>
          </View>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.coral.standard,
  },
  pauseButtonContainer: {
    width,
    alignItems: 'flex-start',
    padding: 5,
    backgroundColor: colors.grey.light,
  },
  pauseButton: {
    width: 117.5,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 2,
    borderColor: colors.coral.standard,
    borderRadius: 4,
    shadowColor: colors.charcoal.light,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  pauseButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.coral.standard,
    marginTop: 4,
    marginLeft: 5,
    marginRight: 5,
  },
});
