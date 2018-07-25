import React from 'react';
import { StyleSheet, View, Text, Dimensions, SafeAreaView } from 'react-native';
import { Video, FileSystem } from 'expo';
import WorkoutTimer from '../../../components/WorkoutTimer';
import CountdownTimer from '../../../components/CountdownTimer';
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
      countdownDuration: 5,
      countdownActive: false,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ exerciseList, currentExercise: exerciseList[0], reps });
  }
  componentDidMount() {
    this.startCountdown();
  }
  startTimer = () => {
    this.setState({
      timerStart: true,
      timerReset: false,
    });
  }
  handleFinish = (exerciseList) => {
    this.setState({
      timerStart: false,
      timerReset: false,
    });
    this.props.navigation.navigate('Exercise2', {
      exerciseList,
    });
  }
  startCountdown = () => {
    this.setState({
      countdownActive: true,
    });
  }
  finishCountdown = () => {
    this.setState({ timerStart: true, countdownActive: false });
  }
  render() {
    const {
      currentExercise,
      exerciseList,
      countdownDuration,
      countdownActive,
      timerStart,
      timerReset,
      totalDuration,
      reps,
    } = this.state;
    if (countdownActive) {
      return (
        <View style={styles.countdownContainer}>
          <CountdownTimer
            totalDuration={countdownDuration}
            start={countdownActive}
            handleFinish={() => this.finishCountdown()}
          />
          <Text style={styles.countdownText}>
            GET READY!
          </Text>
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
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
        </View>
        <View style={styles.flexContainer}>
          <WorkoutTimer
            totalDuration={totalDuration}
            start={timerStart}
            reset={timerReset}
            handleFinish={() => this.handleFinish(exerciseList)}
            options={workoutTimerStyle}
          />
          <View style={styles.exerciseInfoContainer}>
            <View style={styles.exerciseInfoTile}>
              <View style={styles.exerciseInfoTileHeader}>
                <Text style={styles.exerciseInfoTileHeaderText}>
                  {currentExercise.name}
                </Text>
              </View>
              <View style={styles.exerciseInfoTileContent}>
                <Text style={styles.exerciseInfoTileTextLarge}>
                  {reps}
                </Text>
                <Text style={styles.exerciseInfoTileTextSmall}>
                  reps
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexContainer: {
    flex: 1,
  },
  exerciseInfoContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfoTile: {
    marginTop: 7.5,
    marginBottom: 7.5,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.charcoal.standard,
    overflow: 'hidden',
  },
  exerciseInfoTileHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    paddingBottom: 5,
    backgroundColor: colors.charcoal.standard,
  },
  exerciseInfoTileHeaderText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    paddingLeft: 10,
    paddingRight: 10,
  },
  exerciseInfoTileContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciseInfoTileTextLarge: {
    marginTop: 15,
    fontFamily: fonts.bold,
    fontSize: 48,
    color: colors.charcoal.standard,
  },
  exerciseInfoTileTextSmall: {
    marginBottom: 10,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.standard,
  },
});
