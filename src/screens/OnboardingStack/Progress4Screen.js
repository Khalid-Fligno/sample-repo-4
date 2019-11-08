import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  AppState,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import CountdownPauseModal from '../../components/Workouts/CountdownPauseModal';
import CountdownTimer from '../../components/Workouts/CountdownTimer';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default class Progress4Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countdownDuration: 5,
      timerStart: false,
      pauseModalVisible: false,
      appState: AppState.currentState,
    };
  }
  componentDidMount() {
    this.startTimer();
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  handleAppStateChange = async (nextAppState) => {
    const { appState } = this.state;
    if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.handlePause();
    }
    this.setState({ appState: nextAppState });
  }
  startTimer = () => {
    this.setState({ timerStart: true });
  }
  handlePause = () => {
    this.setState({
      timerStart: false,
      pauseModalVisible: true,
    });
  }
  handleUnpause = () => {
    this.setState({
      timerStart: true,
      pauseModalVisible: false,
    });
  }
  handleQuitWorkout = () => {
    this.setState({ pauseModalVisible: false }, () => {
      this.props.navigation.navigate('Home');
    });
    FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-burpees.mp4`, { idempotent: true });
  }
  quitWorkout = () => {
    Alert.alert(
      'Stop burpee test?',
      'Stopping means you will lose any information you have already entered',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: this.handleQuitWorkout,
        },
      ],
      { cancelable: false },
    );
  }
  finishCountdown = () => {
    const {
      image,
      weight,
      waist,
      hip,
      isInitial,
    } = this.props.navigation.state.params;
    this.props.navigation.replace('Progress5', {
      image,
      weight,
      waist,
      hip,
      isInitial,
    });
  }
  render() {
    const {
      countdownDuration,
      timerStart,
      pauseModalVisible,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.contentContainer}>
            <CountdownTimer
              totalDuration={countdownDuration}
              start={timerStart}
              handleFinish={() => this.finishCountdown()}
            />
            <Text style={styles.countdownText}>
              GET READY!
            </Text>
          </View>
          <CountdownPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleUnpause={this.handleUnpause}
          />
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
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.standard,
  },
});
