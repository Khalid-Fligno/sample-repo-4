import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-navigation';
// import { Video, FileSystem } from 'expo';
import FadeInView from 'react-native-fade-in-view';
import FastImage from 'react-native-fast-image';
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
      exerciseList: this.props.navigation.getParam('exerciseList', null),
      fitnessLevel: this.props.navigation.getParam('fitnessLevel', null),
      totalDuration: restIntervalMap[this.props.navigation.getParam('fitnessLevel', null)],
      selectedHiitWorkoutIndex: this.props.navigation.getParam('selectedHiitWorkoutIndex', null),
      timerStart: false,
      timerReset: false,
      pauseModalVisible: false,
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
        selectedHiitWorkoutIndex,
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
      exerciseList,
      timerStart,
      timerReset,
      totalDuration,
      fitnessLevel,
      pauseModalVisible,
      selectedHiitWorkoutIndex,
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
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              reset={timerReset}
              handleFinish={() => this.handleFinish(exerciseList, fitnessLevel, selectedHiitWorkoutIndex)}
            />
          </View>
          <View style={styles.currentExerciseTextContainer}>
            <Text style={styles.currentExerciseNameText}>
              REST
            </Text>
          </View>
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.white,
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
  },
  pauseButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 2,
    borderColor: colors.coral.standard,
    borderRadius: 4,
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
