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
    const { 
      nextExerciseName, 
      handlePause, 
      lastExercise,
      showNextExercise ,
      isNextButton,
      handleNextButton
    } = this.props;
    console.log(showNextExercise,"<><><>")
    return (
      <View style={styles.pauseButtonRow}>
        <View style={styles.pauseButtonContainer}>
          <TouchableOpacity
            onPress={handlePause}
            style={styles.pauseButton}
          >
            <Icon
              name="pause"
              size={15}
              color={colors.themeColor.color}
            />
            <Text style={styles.pauseButtonText}>
              PAUSE
            </Text>
          </TouchableOpacity>
        </View>
          {
            showNextExercise && 
            (
              <View style={styles.nextExerciseContainer}>
                <Text style={styles.nextExercise}>{!lastExercise ? 'NEXT EXERCISE:' : 'LAST EXERCISE'}</Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles.nextExerciseName}
                >
                  {nextExerciseName.toUpperCase()}
                </Text>
              </View>
            )
        }  
        {
          isNextButton &&
            <View style={styles.pauseButtonContainer}>
                <TouchableOpacity
                  onPress={handleNextButton}
                  style={styles.pauseButton}
                >
                
                  <Text style={styles.pauseButtonText}>
                    NEXT
                  </Text>
                  <Icon
                    name="chevron-right"
                    size={15}
                    color={colors.themeColor.color}
                  />
                </TouchableOpacity>
            </View>
        }
    
      </View>
    );
  }
}

PauseButtonRow.propTypes = {
  nextExerciseName: PropTypes.string.isRequired,
  handlePause: PropTypes.func.isRequired,
  lastExercise: PropTypes.bool,
  showNextExercise:PropTypes.bool.isRequired
};

PauseButtonRow.defaultProps = {
  lastExercise: false,
  showNextExercise: false,
};

const styles = StyleSheet.create({
  pauseButtonRow: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.grey.light,
    padding: 5,
    // paddingTop: 0,
  },
  pauseButtonContainer: {
    width: 117.5,
    height: 40,
  },
  pauseButton: {
    width: 117.5,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 2,
    borderColor: colors.themeColor.color,
    borderRadius: 4,
    shadowColor: colors.charcoal.light,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  pauseButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.themeColor.color,
    marginTop: 4,
    marginLeft: 5,
    marginRight: 5,
  },
  nextExerciseContainer: {
    width: width/3,
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
