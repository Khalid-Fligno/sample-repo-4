import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { Video } from 'expo';
import CustomButton from '../../components/CustomButton';
import WorkoutTimer from '../../components/WorkoutTimer';
import CountdownTimer from '../../components/CountdownTimer';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Onboarding3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      timerReset: false,
      totalDuration: 15,
      countdownDuration: 7,
      countdownActive: false,
    };
  }
  componentWillMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
  }
  toggleTimer = () => {
    this.setState({
      timerStart: true,
      timerReset: false,
    });
  }
  resetTimer = () => {
    this.setState({
      timerStart: false,
      timerReset: true,
    });
  }
  handleFinish = () => {
    Alert.alert(
      'Complete',
      'Well done',
      [
        {
          text: 'Ok', style: 'Cancel',
        },
      ],
      { cancelable: false },
    );
    this.setState({
      timerStart: false,
      timerReset: false,
    });
  }
  handleSkip = () => {
    Alert.alert(
      'Warning',
      'You will need to do this before your first workout',
      [
        {
          text: 'Cancel', style: 'cancel',
        },
        {
          text: 'Ok, got it!', onPress: () => this.props.navigation.navigate('App'),
        },
      ],
      { cancelable: false },
    );
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
    const startButton = (
      <CustomButton
        title="Ready!"
        onPress={() => this.startCountdown()}
      />
    );
    const countdownTimer = (
      <CountdownTimer
        totalDuration={this.state.countdownDuration}
        start={this.state.countdownActive}
        handleFinish={() => this.finishCountdown()}
      />
    );
    const workoutTimer = (
      <TouchableOpacity
        onPress={this.state.timerStart ? () => this.resetTimer() : () => this.toggleTimer()}
      >
        <WorkoutTimer
          totalDuration={this.state.totalDuration}
          start={this.state.timerStart}
          reset={this.state.timerReset}
          handleFinish={() => this.handleFinish()}
        />
      </TouchableOpacity>
    );
    const timerView = () => {
      if (this.state.countdownActive) {
        return countdownTimer;
      } else if (this.state.timerStart) {
        return workoutTimer;
      }
      return startButton;
    };
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.headerText}>
            Burpee Test
          </Text>
          <Text style={styles.bodyText}>
            To assess your current fitness level
          </Text>
          <Video
            source={require('../../../assets/videos/burpees-trimmed.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={{ width, height: 250 }}
          />
        </View>
        <View>
          {timerView()}
        </View>
        <View>
          <CustomButton
            title="Next Step"
            onPress={() => this.props.navigation.navigate('App')}
            primary
          />
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
  headerText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  bodyText: {
    textAlign: 'center',
    fontFamily: fonts.standard,
    fontSize: 14,
  },
});
