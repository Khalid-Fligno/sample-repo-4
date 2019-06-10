import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import CountdownTimer from '../../../components/Workouts/CountdownTimer';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

export default class Progress4Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countdownDuration: 5,
    };
  }
  finishCountdown = () => {
    this.props.navigation.navigate('Burpee3');
  }
  render() {
    const {
      countdownDuration,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.contentContainer}>
            <CountdownTimer
              totalDuration={countdownDuration}
              handleFinish={() => this.finishCountdown()}
            />
            <Text style={styles.countdownText}>
              GET READY!
            </Text>
          </View>
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
