import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import CountdownTimer from '../../../../components/Workouts/CountdownTimer';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

export default class HiitCountdownScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: this.props.navigation.getParam('exerciseList', null),
      fitnessLevel: this.props.navigation.getParam('fitnessLevel', null),
      selectedHiitWorkoutIndex: this.props.navigation.getParam('selectedHiitWorkoutIndex', null),
      countdownDuration: 5,
      countdownActive: false,
    };
  }
  componentDidMount() {
    this.startCountdown();
  }
  startCountdown = () => {
    this.setState({
      countdownActive: true,
    });
  }
  finishCountdown = (exerciseList, fitnessLevel, selectedHiitWorkoutIndex) => {
    this.setState({ countdownActive: false });
    this.props.navigation.replace('HiitExercise1', {
      exerciseList,
      fitnessLevel,
      selectedHiitWorkoutIndex,
    });
  }
  render() {
    const {
      exerciseList,
      countdownDuration,
      countdownActive,
      fitnessLevel,
      selectedHiitWorkoutIndex,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.countdownContainer}>
          <CountdownTimer
            totalDuration={countdownDuration}
            start={countdownActive}
            handleFinish={() => this.finishCountdown(exerciseList, fitnessLevel, selectedHiitWorkoutIndex)}
          />
          <Text style={styles.countdownText}>
            GET READY!
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
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
});
