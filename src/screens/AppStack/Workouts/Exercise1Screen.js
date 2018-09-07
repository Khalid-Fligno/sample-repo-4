import React from 'react';
import { StyleSheet, View, Text, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Video, FileSystem } from 'expo';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../components/WorkoutTimer';
import WorkoutProgress from '../../../components/WorkoutProgress';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';


const { width } = Dimensions.get('window');

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

export default class Exercise1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      currentExercise: {},
      timerStart: false,
      timerReset: false,
      totalDuration: 5,
      reps: null,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ exerciseList, currentExercise: exerciseList[0], reps });
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
  handleFinish = (exerciseList, reps) => {
    this.setState({
      timerStart: false,
      timerReset: false,
    });
    let setCount = this.props.navigation.getParam('setCount', 0);
    setCount += 1;
    if (setCount === 3) {
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({
      //     routeName: 'Exercise2',
      //     params: {
      //       exerciseList,
      //       reps,
      //     },
      //   })],
      // });
      // this.props.navigation.dispatch(resetAction);
      this.props.navigation.replace('Exercise2', {
        exerciseList,
        reps,
      });
    } else {
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({
      //     routeName: 'Exercise1',
      //     params: {
      //       exerciseList,
      //       reps,
      //       setCount,
      //     },
      //   })],
      // });
      // this.props.navigation.dispatch(resetAction);
      this.props.navigation.replace('Exercise1', {
        exerciseList,
        reps,
        setCount,
      });
    }
  }
  render() {
    const {
      currentExercise,
      exerciseList,
      timerStart,
      timerReset,
      totalDuration,
      reps,
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
              {reps} REPS
            </Text>
          </View>
          <WorkoutTimer
            totalDuration={totalDuration}
            start={timerStart}
            reset={timerReset}
            handleFinish={() => this.handleFinish(exerciseList, reps)}
            options={workoutTimerStyle}
          />
          <WorkoutProgress
            currentExercise={1}
            currentSet={this.props.navigation.getParam('setCount', 0) + 1}
          />
          <Text>
            <Text style={styles.nextExercise}> NEXT EXERCISE: </Text>
            <Text style={styles.nextExerciseName}>{exerciseList[1].name.toUpperCase()}</Text>
          </Text>
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
