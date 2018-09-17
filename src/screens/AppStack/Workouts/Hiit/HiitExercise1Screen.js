import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Video, FileSystem } from 'expo';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../../components/WorkoutTimer';
// import WorkoutProgress from '../../../../components/WorkoutProgress';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get('window');

const workIntervalMap = {
  1: 30,
  2: 60,
  3: 90,
};

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

export default class HiitExercise1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      currentExercise: {},
      timerStart: false,
      timerReset: false,
      totalDuration: null,
      fitnessLevel: null,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const fitnessLevel = this.props.navigation.getParam('fitnessLevel', null);
    this.setState({
      exerciseList,
      currentExercise: exerciseList[0],
      fitnessLevel,
      totalDuration: workIntervalMap[fitnessLevel],
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
    const setCount = this.props.navigation.getParam('setCount', 0);
    this.props.navigation.replace('HiitExercise2', {
      exerciseList,
      fitnessLevel,
      setCount,
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
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <FadeInView
          duration={1000}
          style={styles.flexContainer}
        >
          <Video
            source={{ uri: `${FileSystem.cacheDirectory}exercise-1.mp4` }}
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
            <Text style={styles.currentExerciseRepsText}>
              {/* {fitnessLevel} REPS */}
            </Text>
          </View>
          <WorkoutTimer
            totalDuration={totalDuration}
            start={timerStart}
            reset={timerReset}
            handleFinish={() => this.handleFinish(exerciseList, fitnessLevel)}
            options={workoutTimerStyle}
          />
          {/* <WorkoutProgress
            currentExercise={1}
            currentSet={this.props.navigation.getParam('setCount', 0) + 1}
          /> */}
          {/* <Text>
            <Text style={styles.nextExercise}> NEXT EXERCISE: </Text>
            <Text style={styles.nextExerciseName}>{exerciseList[1].name.toUpperCase()}</Text>
          </Text> */}
        </FadeInView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
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
