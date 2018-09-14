import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import CountdownTimer from '../../components/CountdownTimer';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default class Progress4Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countdownDuration: 5,
      countdownActive: false,
    };
  }
  componentWillMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
  }
  componentDidMount() {
    this.startCountdown();
  }
  startCountdown = () => {
    this.setState({
      countdownActive: true,
    });
  }
  finishCountdown = () => {
    this.setState({ countdownActive: false });
    const {
      image,
      weight,
      waist,
      hip,
      isInitial,
    } = this.props.navigation.state.params;
    this.props.navigation.navigate('Progress5', {
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
      countdownActive,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.contentContainer}>
            <CountdownTimer
              totalDuration={countdownDuration}
              start={countdownActive}
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
