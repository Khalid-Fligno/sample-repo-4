import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Video, FileSystem } from 'expo';
import FadeInView from 'react-native-fade-in-view';
import Icon from '../../../../components/Shared/Icon';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import HiitWorkoutProgress from '../../../../components/Workouts/HiitWorkoutProgress';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get('window');

const restIntervalMap = {
  1: 90,
  2: 60,
  3: 30,
};

export default class HiitExercise2Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      currentExercise: {},
      timerStart: false,
      timerReset: false,
      totalDuration: null,
      fitnessLevel: null,
      pauseModalVisible: false,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const fitnessLevel = this.props.navigation.getParam('fitnessLevel', null);
    this.setState({
      exerciseList,
      currentExercise: exerciseList[1],
      fitnessLevel,
      totalDuration: restIntervalMap[fitnessLevel],
    });
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
  handleFinish = (exerciseList, fitnessLevel) => {
    this.setState({
      timerStart: false,
      timerReset: false,
    });
    let roundCount = this.props.navigation.getParam('roundCount', 0);
    roundCount += 1;
    if (roundCount === 8) {
      this.props.navigation.replace('HiitWorkoutComplete', {
        exerciseList,
        fitnessLevel,
      });
    } else {
      this.props.navigation.replace('HiitExercise1', {
        exerciseList,
        fitnessLevel,
        roundCount,
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
  restartWorkout = (exerciseList, fitnessLevel) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to restart this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.replace('HiitCountdown', { exerciseList, fitnessLevel });
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
      fitnessLevel,
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
            source={{ uri: `${FileSystem.cacheDirectory}exercise-2.mp4` }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={{ width, height: width }}
          />
          <View style={styles.currentExerciseTextContainer}>
            <Text style={styles.currentExerciseNameText}>
              {currentExercise.name.toUpperCase()}
            </Text>
          </View>
          <WorkoutTimer
            totalDuration={totalDuration}
            start={timerStart}
            reset={timerReset}
            handleFinish={() => this.handleFinish(exerciseList, fitnessLevel)}
          />
          <HiitWorkoutProgress
            currentRound={this.props.navigation.getParam('roundCount', 0) + 1}
            rest
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
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
  },
  currentExerciseNameText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.coral.standard,
  },
  pauseButtonContainer: {
    width,
    alignItems: 'center',
  },
  pauseButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  pauseButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.coral.standard,
    marginLeft: 5,
    marginTop: 4,
  },
});
