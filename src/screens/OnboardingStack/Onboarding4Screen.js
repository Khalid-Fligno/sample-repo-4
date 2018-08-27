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
import { burpeeOptions, findFitnessLevel } from '../../utils/index';
import CustomButton from '../../components/CustomButton';
import WorkoutTimer from '../../components/WorkoutTimer';
import CountdownTimer from '../../components/CountdownTimer';
import Loader from '../../components/Loader';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Onboarding4Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      timerReset: false,
      totalDuration: 10,
      countdownDuration: 7,
      countdownActive: false,
      burpeeCount: null,
      loading: false,
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
    this.setState({ loading: true });
    try {
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const fitnessLevel = findFitnessLevel(this.state.burpeeCount);
      await userRef.set({
        fitnessLevel,
      }, { merge: true });
      this.setState({ loading: false });
      this.props.navigation.navigate('App');
    } catch (err) {
      console.log(err);
      this.setState({ loading: false });
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
      loading,
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
            source={require('../../../assets/videos/burpees-trimmed-square.mp4')}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={{ width, height: width }}
          />
        </View>
        <View style={styles.selectorContainer}>
          {timerView()}
          <SelectInput
            onSubmitEditing={(value) => this.setState({ burpeeCount: value })}
            value={burpeeCount}
            options={burpeeOptions}
            style={styles.selector}
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
        {
          loading && <Loader loading={loading} color={colors.charcoal.standard} />
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
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
  selectorContainer: {
    alignItems: 'center',
  },
  selector: {
    borderColor: colors.grey.light,
    borderWidth: 1,
    borderRadius: 4,
    width: width - 30,
    marginTop: 30,
    padding: 10,
    alignItems: 'center',
  },
});
