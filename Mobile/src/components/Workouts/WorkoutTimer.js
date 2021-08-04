import React from "react";
import { Text, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import { timerSound } from "../../../config/audio";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";

const { width, height } = Dimensions.get("window");

export const defaultStyles = {
  container: {
    width,
    backgroundColor: colors.black,
    paddingTop: height > 800 ? 25 : 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: height > 800 ? 80 : 60,
    color: colors.white,
  },
};

const warningStyles = {
  container: {
    width,
    backgroundColor: colors.black,
    paddingTop: height > 800 ? 25 : 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: height > 800 ? 80 : 60,
    color: colors.coral.standard,
  },
};

export default class WorkoutTimer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      remainingTime: props.totalDuration * 1000 + 990,
      start: undefined,
      exerciseIndex: props.exerciseIndex,
    };
  }
  static getDerivedStateFromProps(props, state) {
    const now = state.remainingTime;
    let seconds = Math.floor(now / 1000);
    // console.log("KKKKK",seconds,props.exerciseIndex);
    if (
      state.remainingTime === 0 &&
      state.exerciseIndex !== props.exerciseIndex
    ) {
      return {
        remainingTime: props.totalDuration * 1000 + 990,
        exerciseIndex: props.exerciseIndex,
        start: props.start,
      };
    }
    if (props.start !== state.start) {
      return { start: props.start };
    }
    return null;
  }
  componentDidMount = async () => {
    this.setState({ start: true });
  };
  componentDidUpdate(props, prevState) {
    if (prevState.start !== this.state.start) {
      this.onPropsChange();
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
  }
  onPropsChange = () => {
    if (this.state.start) {
      this.start();
    } else {
      this.stop();
    }
  };
  start = async () => {
    const { handleFinish } = this.props;
    const endTime = new Date().getTime() + this.state.remainingTime;
    this.interval = setInterval(async () => {
      const remaining = endTime - new Date();
      if (remaining <= 1000) {
        this.setState({ remainingTime: 0 });
        this.stop();
        if (Platform.OS === "ios") {
          await timerSound.setPositionAsync(0);
          await timerSound.playAsync();
        } else {
          try {
            await timerSound.playFromPositionAsync(0);
          } catch (ex) {}
        }
        handleFinish();
        return;
      }
      this.setState({ remainingTime: remaining });
    }, 1000);
  };
  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
  };
  formatTime = () => {
    const now = this.state.remainingTime;
    let seconds = Math.floor(now / 1000);
    const minutes = Math.floor(now / 60000);
    seconds -= minutes * 60;
    const formatted = `${minutes < 10 ? 0 : ""}${minutes}:${
      seconds < 10 ? 0 : ""
    }${seconds}`;
    if (typeof this.props.getTime === "function") {
      this.props.getTime(formatted);
    }
    return formatted;
  };
  findStyles = (remainingTime) => {
    if (remainingTime < 1000) {
      return defaultStyles;
    } else if (remainingTime < 2000) {
      return warningStyles;
    } else if (remainingTime < 3000) {
      return defaultStyles;
    } else if (remainingTime < 4000) {
      return warningStyles;
    } else if (remainingTime < 5000) {
      return defaultStyles;
    } else if (remainingTime < 6000) {
      return warningStyles;
    }
    return defaultStyles;
  };
  render() {
    const styles = this.findStyles(this.state.remainingTime);
    return (
      <View style={[styles.container, this.props.customContainerStyle]}>
        <Text
          style={[styles.text, this.props.customTextStyle, { fontSize: 50 }]}
        >
          {this.formatTime()}
        </Text>
      </View>
    );
  }
}

WorkoutTimer.propTypes = {
  totalDuration: PropTypes.number.isRequired,
  start: PropTypes.bool.isRequired,
  getTime: PropTypes.func,
  handleFinish: PropTypes.func,
  customContainerStyle: PropTypes.object,
};

WorkoutTimer.defaultProps = {
  getTime: null,
  handleFinish: null,
};
