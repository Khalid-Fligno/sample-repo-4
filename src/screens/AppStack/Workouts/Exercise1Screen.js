import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Video, FileSystem } from 'expo';
import WorkoutTimer from '../../../components/WorkoutTimer';
import CountdownTimer from '../../../components/CountdownTimer';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

export default class Exercise1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      currentExercise: {},
      timerStart: false,
      timerReset: false,
      totalDuration: 6,
      countdownDuration: 4,
      countdownActive: false,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    this.setState({ exerciseList, currentExercise: exerciseList[0] });
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
    } = this.state;
    if (countdownActive) {
      return (
        <View style={styles.container}>
          <CountdownTimer
            totalDuration={countdownDuration}
            start={countdownActive}
            handleFinish={() => this.finishCountdown()}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text>
          Exercise 1
        </Text>
        <Text>
          {currentExercise.name}
        </Text>
        <Video
          source={{ uri: `${FileSystem.documentDirectory}exercise-1.mp4` }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay
          isLooping
          style={{ width, height: width }}
        />
        <WorkoutTimer
          totalDuration={totalDuration}
          start={timerStart}
          reset={timerReset}
          handleFinish={() => this.handleFinish(exerciseList)}
        />
        <Text
          onPress={() => this.handleFinish(exerciseList)}
        >
          Next
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
