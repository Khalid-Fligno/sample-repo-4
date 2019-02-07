import React, { Component } from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Audio } from 'expo';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

export default class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remainingTime: (props.totalDuration * 1000) + 900,
    };
  }
  componentDidMount() {
    if (this.props.start) {
      this.start();
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.start) {
      this.start();
    } else {
      this.stop();
    }
    if (newProps.reset) {
      this.reset(newProps.totalDuration);
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
  }
  start = async () => {
    await Audio.setIsEnabledAsync(true);
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(require('../../../assets/sounds/ding.mp3'));
    const { handleFinish } = this.props;
    const endTime = new Date().getTime() + this.state.remainingTime;
    this.interval = setInterval(() => {
      const remaining = endTime - new Date();
      if (remaining <= 1000) {
        this.setState({ remainingTime: 0 });
        this.stop();
        soundObject.playAsync();
        handleFinish();
        return;
      }
      this.setState({ remainingTime: remaining });
    }, 1);
  }
  stop = () => {
    clearInterval(this.interval);
  }
  reset = (newDuration) => {
    this.setState({
      remainingTime: this.props.totalDuration !== newDuration ? newDuration : this.props.totalDuration,
    });
  }
  formatTime = () => {
    const now = this.state.remainingTime;
    const seconds = Math.floor(now / 1000);
    const formatted = `${seconds}`;
    if (typeof this.props.getTime === 'function') {
      this.props.getTime(formatted);
    }
    return formatted;
  }
  render() {
    const styles = this.props.options ? this.props.options : defaultStyles;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.formatTime()}</Text>
      </View>
    );
  }
}

const defaultStyles = {
  container: {
    backgroundColor: colors.white,
    paddingTop: 5,
    paddingRight: 5,
    paddingBottom: 0,
    paddingLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: 84,
    color: colors.charcoal.standard,
  },
};

CountdownTimer.propTypes = {
  totalDuration: PropTypes.number.isRequired,
  start: PropTypes.bool.isRequired,
  options: PropTypes.objectOf(PropTypes.string || PropTypes.number),
  getTime: PropTypes.func,
  handleFinish: PropTypes.func.isRequired,
};

CountdownTimer.defaultProps = {
  getTime: null,
  options: null,
};
