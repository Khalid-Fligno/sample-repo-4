import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import Video from 'react-native-video';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../components/Workouts/WorkoutTimer';
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

export default class Progress5Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      totalDuration: 60,
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({ handleCancel: this.handleCancel });
    this.startTimer();
  }
  startTimer = () => {
    this.setState({ timerStart: true });
  }
  handleFinish = () => {
    this.setState({ timerStart: false });
    const {
      image,
      weight,
      waist,
      hip,
    } = this.props.navigation.state.params;
    this.props.navigation.navigate('Burpee4', {
      image,
      weight,
      waist,
      hip,
    });
  }
  handleCancel = () => {
    this.setState({ timerStart: false });
    Alert.alert(
      'Stop burpee test?',
      '',
      [
        {
          text: 'Cancel', style: 'cancel', onPress: () => this.cancelSkip(),
        },
        {
          text: 'Yes', onPress: () => this.props.navigation.navigate('Home'),
        },
      ],
      { cancelable: false },
    );
  }
  cancelSkip = () => {
    this.setState({ timerStart: true });
  }
  render() {
    const {
      timerStart,
      totalDuration,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <FadeInView
          duration={1000}
          style={styles.flexContainer}
        >
          <View>
            <Video
              source={{ uri: `${FileSystem.cacheDirectory}exercise-burpees.mp4` }}
              resizeMode="contain"
              repeat
              muted
              style={{ width, height: width }}
            />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              handleFinish={() => this.handleFinish()}
              options={workoutTimerStyle}
            />
          </View>
          <View style={styles.currentExerciseTextContainer}>
            <Text style={styles.currentExerciseNameText}>
              BURPEES
            </Text>
            <Text style={styles.currentExerciseRepsText}>
              MAX
            </Text>
          </View>
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
    paddingLeft: 10,
    paddingRight: 10,
  },
  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.coral.standard,
  },
  currentExerciseRepsText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
  },
  bottomText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    marginTop: 10,
    marginBottom: 10,
  },
});
