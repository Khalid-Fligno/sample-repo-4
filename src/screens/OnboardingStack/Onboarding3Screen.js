import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import { Video } from 'expo';
import SelectInput from 'react-native-select-input-ios';
import { db } from '../../../config/firebase';
import CustomButton from '../../components/CustomButton';
import WorkoutTimer from '../../components/WorkoutTimer';
import CountdownTimer from '../../components/CountdownTimer';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const burpeeOptions = [
  { value: null, label: 'Select your completed burpee count' },
];

const populateBurpeeOptions = () => {
  for (let i = 0; i < 50; i += 1) {
    burpeeOptions.push({
      value: i,
      label: `${i}`,
    });
  }
};
populateBurpeeOptions();

const findFitnessLevel = (burpeeCount) => {
  if (burpeeCount < 7) {
    return 1;
  } else if (burpeeCount > 15) {
    return 3;
  }
  return 2;
};

export default class Onboarding3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      timerReset: false,
      totalDuration: 15,
      countdownDuration: 7,
      countdownActive: false,
      burpeeCount: null,
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
  handleSubmit = async () => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const fitnessLevel = findFitnessLevel(this.state.burpeeCount);
      await userRef.set({
        fitnessLevel,
      }, { merge: true });
      this.props.navigation.navigate('App');
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    const {
      countdownDuration,
      countdownActive,
      timerStart,
      timerReset,
      totalDuration,
      burpeeCount,
    } = this.state;
    const startButton = (
      <CustomButton
        title="Ready!"
        onPress={() => this.startCountdown()}
      />
    );
    const countdownTimer = (
      <CountdownTimer
        totalDuration={countdownDuration}
        start={countdownActive}
        handleFinish={() => this.finishCountdown()}
      />
    );
    const workoutTimer = (
      <TouchableOpacity
        onPress={timerStart ? () => this.resetTimer() : () => this.toggleTimer()}
      >
        <WorkoutTimer
          totalDuration={totalDuration}
          start={timerStart}
          reset={timerReset}
          handleFinish={() => this.handleFinish()}
        />
      </TouchableOpacity>
    );
    const timerView = () => {
      if (countdownActive) {
        return countdownTimer;
      } else if (timerStart) {
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
        <View
          style={{
            alignItems: 'center',
          }}
        >
          {timerView()}
          <SelectInput
            onSubmitEditing={(value) => this.setState({ burpeeCount: value })}
            value={burpeeCount}
            options={burpeeOptions}
            style={{
              borderColor: colors.grey.light,
              borderWidth: 1,
              borderRadius: 4,
              width: width - 30,
              marginTop: 30,
              padding: 10,
              alignItems: 'center',
            }}
            labelStyle={{
              fontFamily: fonts.bold,
            }}
          />
        </View>
        <View>
          <CustomButton
            title="Next Step"
            onPress={() => this.handleSubmit()}
            primary
            disabled={countdownActive || timerStart || burpeeCount === null}
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
