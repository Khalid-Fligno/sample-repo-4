import React from 'react';
import { Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { timerSound } from '../../../config/audio';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

export default class CountdownTimer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      remainingTime: (props.totalDuration * 1000) + 990,
    };
  }
  componentDidMount() {
    this.start();
  }
  componentWillUnmount() {
    clearInterval(this.interval);
    this.interval = null;
  }
  start = async () => {
    const { handleFinish } = this.props;
    const endTime = new Date().getTime() + this.state.remainingTime;
    this.interval = setInterval(async () => {
      const remaining = endTime - new Date();
      if (remaining <= 1000) {
        this.setState({ remainingTime: 0 });
        this.stop();
        await timerSound.setPositionAsync(0);
        await timerSound.playAsync();
        handleFinish();
        return;
      }
      this.setState({ remainingTime: remaining });
    }, 1000);
  }
  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
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
  options: PropTypes.objectOf(PropTypes.string || PropTypes.number),
  getTime: PropTypes.func,
  handleFinish: PropTypes.func.isRequired,
};

CountdownTimer.defaultProps = {
  getTime: null,
  options: null,
};
