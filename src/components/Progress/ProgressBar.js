import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default class ProgressBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      progressBarType,
      completedWorkouts,
    } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.progressBarLabel}>
          {`${progressBarType} `}
          {completedWorkouts}/{progressBarType === 'Resistance' ? 3 : 2}
        </Text>
        <View style={styles.progressBarOuter}>
          <View
            style={[
              styles.progressBarEmpty,
              completedWorkouts === 0 && styles.progressBarEmpty,
              progressBarType === 'Resistance' && completedWorkouts === 1 && styles.resistance1,
              progressBarType === 'Resistance' && completedWorkouts === 2 && styles.resistance2,
              progressBarType === 'Resistance' && completedWorkouts >= 3 && styles.progressBarFull,
              progressBarType === 'HIIT' && completedWorkouts === 1 && styles.hiit1,
              progressBarType === 'HIIT' && completedWorkouts >= 2 && styles.progressBarFull,
            ]}
          />
        </View>
      </View>
    );
  }
}

ProgressBar.propTypes = {
  progressBarType: PropTypes.oneOf(['Resistance', 'HIIT']).isRequired,
  completedWorkouts: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
  },
  progressBarLabel: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.grey.dark,
    marginTop: 3,
    marginBottom: 3,
  },
  progressBarOuter: {
    width: '100%',
    height: 8,
    borderColor: colors.offWhite,
    borderRadius: 5,
    backgroundColor: colors.grey.light,
  },
  progressBarEmpty: {
    width: '4%',
    height: 8,
    backgroundColor: colors.coral.standard,
    borderRadius: 5,
  },
  resistance1: {
    width: '33%',
    height: 8,
    backgroundColor: colors.yellow.standard,
    borderRadius: 4,
  },
  resistance2: {
    width: '66%',
    height: 8,
    backgroundColor: colors.yellow.standard,
    borderRadius: 5,
  },
  hiit1: {
    width: '50%',
    height: 8,
    backgroundColor: colors.yellow.standard,
    borderRadius: 5,
  },
  progressBarFull: {
    width: '100%',
    height: 8,
    backgroundColor: colors.green.standard,
    borderRadius: 5,
  },
});
