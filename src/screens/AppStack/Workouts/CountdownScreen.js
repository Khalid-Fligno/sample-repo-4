import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import CountdownTimer from '../../../components/CountdownTimer';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

export default class CountdownScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      countdownDuration: 5,
      countdownActive: false,
      reps: null,
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ exerciseList, reps });
  }
  componentDidMount() {
    this.startCountdown();
  }
  startCountdown = () => {
    this.setState({
      countdownActive: true,
    });
  }
  finishCountdown = (exerciseList, reps) => {
    this.setState({ countdownActive: false });
    this.props.navigation.navigate('Exercise1', {
      exerciseList,
      reps,
    });
  }
  render() {
    const {
      exerciseList,
      countdownDuration,
      countdownActive,
      reps,
    } = this.state;
    return (
      <View style={styles.countdownContainer}>
        <CountdownTimer
          totalDuration={countdownDuration}
          start={countdownActive}
          handleFinish={() => this.finishCountdown(exerciseList, reps)}
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
