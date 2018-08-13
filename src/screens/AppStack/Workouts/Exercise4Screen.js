import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Video, FileSystem } from 'expo';
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

export default class Exercise4Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      currentExercise: {},
      timerStart: false,
      timerReset: false,
      totalDuration: 6,
      reps: null,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ exerciseList, currentExercise: exerciseList[3], reps });
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
      this.props.navigation.navigate('Exercise5', {
        exerciseList,
        reps,
      });
    } else {
      this.props.navigation.push('Exercise4', {
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
        <View style={styles.flexContainer}>
          <Video
            source={{ uri: `${FileSystem.cacheDirectory}exercise-4.mp4` }}
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
            handleFinish={() => this.handleFinish(exerciseList, reps)}
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
            <WorkoutProgress
              currentExercise={4}
              currentSet={this.props.navigation.getParam('setCount', 0) + 1}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
    overflow: 'hidden',
  },
  exerciseInfoTileHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    paddingBottom: 5,
    backgroundColor: colors.charcoal.standard,
    borderRadius: 4,
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
