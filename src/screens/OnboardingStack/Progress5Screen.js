import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { Video } from 'expo';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../components/WorkoutTimer';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

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

export default class Progress5Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      timerReset: false,
      totalDuration: 5,
    };
  }
  componentWillMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
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
  handleFinish = () => {
    this.setState({
      timerStart: false,
      timerReset: false,
    });
    const {
      image,
      weight,
      waist,
      hip,
      isInitial,
    } = this.props.navigation.state.params;
    this.props.navigation.navigate('Progress6', {
      image,
      weight,
      waist,
      hip,
      isInitial,
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
  render() {
    const {
      timerStart,
      timerReset,
      totalDuration,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FadeInView
          duration={1000}
          style={styles.flexContainer}
        >
          <Video
            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/fitazfk-app.appspot.com/o/videos%2Fexercises%2Fair-squats-480x480.mp4?alt=media&token=65b73321-3e9e-47d1-9862-44e7cb426428' }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={{ width, height: width }}
          />
          <View style={styles.currentExerciseTextContainer}>
            <Text style={styles.currentExerciseNameText}>
              BURPEES
            </Text>
            <Text style={styles.currentExerciseRepsText}>
              AMRAP
            </Text>
          </View>
          <WorkoutTimer
            totalDuration={totalDuration}
            start={timerStart}
            reset={timerReset}
            handleFinish={() => this.handleFinish()}
            options={workoutTimerStyle}
          />
          <Text style={styles.bottomText}>REMEMBER TO COUNT YOUR BURPEES!</Text>
        </FadeInView>
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
  currentExerciseTextContainer: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
  },
  currentExerciseNameText: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.coral.standard,
  },
  currentExerciseRepsText: {
    fontFamily: fonts.bold,
    fontSize: 20,
  },
  bottomText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
  },
});
