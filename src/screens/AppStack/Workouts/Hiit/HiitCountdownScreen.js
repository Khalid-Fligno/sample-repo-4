import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
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
      countdownDuration: 5,
    };
  }
  componentDidMount() {
    this.checkVideoCache();
  }
  checkVideoCache = async () => {
    const { exerciseList } = this.state;
    const video1 = await FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}exercise-hiit-1.mp4`);
    if (!video1.exists) {
      FileSystem.downloadAsync(exerciseList[0].videoURL, `${FileSystem.cacheDirectory}exercise-hiit-1.mp4`);
    }
  }
  finishCountdown = (exerciseList, fitnessLevel) => {
    this.props.navigation.replace('HiitExercise1', {
      exerciseList,
      fitnessLevel,
    });
  }
  render() {
    const {
      exerciseList,
      countdownDuration,
      fitnessLevel,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.countdownContainer}>
          <CountdownTimer
            totalDuration={countdownDuration}
            handleFinish={() => this.finishCountdown(exerciseList, fitnessLevel)}
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
