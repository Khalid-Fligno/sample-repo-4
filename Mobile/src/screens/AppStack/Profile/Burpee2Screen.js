import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  AppState,
} from "react-native";
import CountdownTimer from "../../../components/Workouts/CountdownTimer";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";

export default class Burpee2Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      countdownDuration: 3,
      timerStart: false,
      pauseModalVisible: false,
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount = async () => {
    if (this.subscribed) this.subscribed.remove();
  };

  startTimer = () => {
    this.setState({ timerStart: true });
  };

  finishCountdown = () => {
    const {
      isInitial,
      navigateTo,
      updateBurpees,
      photoExist2
    } = this.props.navigation.state.params;

    if (this.props.navigation.getParam("fromScreen")) {
      const screen = this.props.navigation.getParam("fromScreen");
      const params = this.props.navigation.getParam("screenReturnParams");
      this.props.navigation.replace("Burpee3", {
        fromScreen: screen,
        screenReturnParams: params,
        strengthAssessmentInfo: this.props.navigation.getParam("strengthAssessmentInfo"),
      })
    } else {
      this.props.navigation.replace("Burpee3", {
        isInitial: isInitial,
        navigateTo: navigateTo,
        updateBurpees: updateBurpees,
        photoExist2: photoExist2,
        strengthAssessmentInfo: this.props.navigation.getParam("strengthAssessmentInfo"),
      })
    }
  };

  render() {
    const {
      countdownDuration,
      timerStart,
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
            <Text style={styles.countdownText}>GET READY!</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  countdownText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.standard,
  },
});
