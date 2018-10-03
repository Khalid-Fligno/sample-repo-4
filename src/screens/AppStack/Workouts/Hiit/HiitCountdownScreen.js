import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CountdownTimer from '../../../../components/CountdownTimer';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

export default class HiitCountdownScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      countdownDuration: 5,
      countdownActive: false,
      fitnessLevel: null,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const fitnessLevel = this.props.navigation.getParam('fitnessLevel', null);
    this.setState({ exerciseList, fitnessLevel });
  }
  componentDidMount() {
    this.startCountdown();
  }
  startCountdown = () => {
    this.setState({
      countdownActive: true,
    });
  }
  finishCountdown = (exerciseList, fitnessLevel) => {
    this.setState({ countdownActive: false });
    this.props.navigation.replace('HiitExercise1', {
      exerciseList,
      fitnessLevel,
    });
  }
  render() {
    const {
      exerciseList,
      countdownDuration,
      countdownActive,
      fitnessLevel,
    } = this.state;
    return (
      <View style={styles.countdownContainer}>
        <CountdownTimer
          totalDuration={countdownDuration}
          start={countdownActive}
          handleFinish={() => this.finishCountdown(exerciseList, fitnessLevel)}
        />
        <Text style={styles.countdownText}>
          GET READY!
        </Text>
      </View>
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
});
