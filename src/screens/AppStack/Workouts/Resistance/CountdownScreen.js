import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FileSystem } from 'expo';
import { SafeAreaView } from 'react-navigation';
import CountdownTimer from '../../../../components/Workouts/CountdownTimer';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

export default class CountdownScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: this.props.navigation.getParam('exerciseList', null),
      reps: this.props.navigation.getParam('reps', null),
      resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
      countdownDuration: 5,
    };
  }
  componentDidMount() {
    this.checkVideoCache();
  }
  checkVideoCache = async () => {
    const { exerciseList } = this.state;
    const video1 = await FileSystem.getInfoAsync(`${FileSystem.cacheDirectory}exercise-1.mp4`);
    if (!video1.exists) {
      Promise.all(exerciseList.map(async (exercise, index) => {
        FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
        );
      }));
    }
  }
  finishCountdown = (exerciseList, reps, resistanceCategoryId) => {
    this.props.navigation.navigate('Exercise1', {
      exerciseList,
      reps,
      resistanceCategoryId,
    });
  }
  render() {
    const {
      exerciseList,
      countdownDuration,
      reps,
      resistanceCategoryId,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.countdownContainer}>
          <CountdownTimer
            totalDuration={countdownDuration}
            handleFinish={() => this.finishCountdown(exerciseList, reps, resistanceCategoryId)}
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
