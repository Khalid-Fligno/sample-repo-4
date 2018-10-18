import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from '../../components/Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

export default class PauseButtonRow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { nextExerciseName, handlePause, lastExercise } = this.props;
    return (
      <View style={styles.pauseButtonRow}>
        <TouchableOpacity
          onPress={handlePause}
          style={styles.pauseButton}
        >
          <Icon
            name="pause"
            size={15}
            color={colors.coral.standard}
          />
          <Text style={styles.pauseButtonText}>
            PAUSE
          </Text>
        </TouchableOpacity>
        <View style={styles.nextExerciseContainer}>
          <Text style={styles.nextExercise}>{!lastExercise ? 'NEXT EXERCISE:' : 'LAST EXERCISE'}</Text>
          <Text style={styles.nextExerciseName}>{nextExerciseName.toUpperCase()}</Text>
        </View>
      </View>
    );
  }
}

PauseButtonRow.propTypes = {
  nextExerciseName: PropTypes.string.isRequired,
  handlePause: PropTypes.func.isRequired,
  lastExercise: PropTypes.bool,
};

PauseButtonRow.defaultProps = {
  lastExercise: false,
};

const styles = StyleSheet.create({
  pauseButtonRow: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  pauseButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 2,
    borderColor: colors.coral.standard,
    borderRadius: 4,
  },
  pauseButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.coral.standard,
    marginTop: 4,
    marginLeft: 5,
    marginRight: 5,
  },
  nextExerciseContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingTop: 8,
  },
  nextExercise: {
    fontFamily: fonts.standard,
    fontSize: 10,
  },
  nextExerciseName: {
    fontFamily: fonts.bold,
    fontSize: 12,
    marginRight: 5,
  },
});
