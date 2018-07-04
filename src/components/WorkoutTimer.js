import React, { Component } from 'react';
import { Text, View, Alert } from 'react-native';
import PropTypes from 'prop-types';
import fonts from '../styles/fonts';
import colors from '../styles/colors';

export default class WorkoutTimer extends Component {
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
  finishAlert = () => {
    Alert.alert(
      'Timer Complete',
      'Timer name here',
      [
        { text: 'OK', style: 'cancel' },
      ],
      { cancelable: false },
    );
  }
  start = () => {
    const handleFinish = this.props.handleFinish ? this.props.handleFinish : () => this.finishAlert();
    const endTime = new Date().getTime() + this.state.remainingTime;
    this.interval = setInterval(() => {
      const remaining = endTime - new Date();
      if (remaining <= 1000) {
        this.setState({ remainingTime: 0 });
        this.stop();
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
    let seconds = Math.floor(now / 1000);
    const minutes = Math.floor(now / 60000);
    seconds -= (minutes * 60);
    const formatted = `${minutes < 10 ? 0 : ''}${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
    if (typeof this.props.getTime === 'function') {
      this.props.getTime(formatted);
    }
    return formatted;
  }
  render() {
    const presetStyles = this.state.remainingTime < 10000 ? warningStyles : defaultStyles;
    const styles = this.props.options ? this.props.options : presetStyles;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{this.formatTime()}</Text>
      </View>
    );
  }
}

const warningStyles = {
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
    fontSize: 72,
    color: colors.coral.standard,
  },
};

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
    fontSize: 72,
    color: colors.charcoal.standard,
  },
};

WorkoutTimer.propTypes = {
  totalDuration: PropTypes.number.isRequired,
  start: PropTypes.bool.isRequired,
  options: PropTypes.objectOf(PropTypes.string || PropTypes.number),
  getTime: PropTypes.func,
  handleFinish: PropTypes.func,
};

WorkoutTimer.defaultProps = {
  getTime: null,
  options: null,
  handleFinish: null,
};
