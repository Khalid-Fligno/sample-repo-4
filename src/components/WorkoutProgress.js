import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import Icon from '../components/Icon';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

const WorkoutProgress = ({
  currentExercise,
  currentSet,
}) => (
  <View style={styles.container}>
    <View style={styles.exercise}>
      <View
        style={[
          styles.outlineIncomplete,
          currentExercise === 1 && styles.outlineActive,
          currentExercise > 1 && styles.outlineComplete,
        ]}
      >
        {
          currentExercise > 1 && (
            <Icon
              name="tick-heavy"
              color={colors.grey.light}
              size={22}
            />
          )
        }
        {
          currentExercise === 1 && (
            <Text style={styles.currentSetText}>
              {currentSet}
            </Text>
          )
        }
      </View>
    </View>
    <View style={styles.exercise}>
      <View
        style={[
          styles.outlineIncomplete,
          currentExercise === 2 && styles.outlineActive,
          currentExercise > 2 && styles.outlineComplete,
        ]}
      >
        {
          currentExercise > 2 && (
            <Icon
              name="tick-heavy"
              color={colors.grey.light}
              size={22}
            />
          )
        }
        {
          currentExercise === 2 && (
            <Text style={styles.currentSetText}>
              {currentSet}
            </Text>
          )
        }
      </View>
    </View>
    <View style={styles.exercise}>
      <View
        style={[
          styles.outlineIncomplete,
          currentExercise === 3 && styles.outlineActive,
          currentExercise > 3 && styles.outlineComplete,
        ]}
      >
        {
          currentExercise > 3 && (
            <Icon
              name="tick-heavy"
              color={colors.grey.light}
              size={22}
            />
          )
        }
        {
          currentExercise === 3 && (
            <Text style={styles.currentSetText}>
              {currentSet}
            </Text>
          )
        }
      </View>
    </View>
    <View style={styles.exercise}>
      <View
        style={[
          styles.outlineIncomplete,
          currentExercise === 4 && styles.outlineActive,
          currentExercise > 4 && styles.outlineComplete,
        ]}
      >
        {
          currentExercise > 4 && (
            <Icon
              name="tick-heavy"
              color={colors.grey.light}
              size={22}
            />
          )
        }
        {
          currentExercise === 4 && (
            <Text style={styles.currentSetText}>
              {currentSet}
            </Text>
          )
        }
      </View>
    </View>
    <View style={styles.exercise}>
      <View
        style={[
          styles.outlineIncomplete,
          currentExercise === 5 && styles.outlineActive,
          currentExercise > 5 && styles.outlineComplete,
        ]}
      >
        {
          currentExercise > 5 && (
            <Icon
              name="tick-heavy"
              color={colors.grey.light}
              size={22}
            />
          )
        }
        {
          currentExercise === 5 && (
            <Text style={styles.currentSetText}>
              {currentSet}
            </Text>
          )
        }
      </View>
    </View>
    <View style={styles.exercise}>
      <View
        style={[
          styles.outlineIncomplete,
          currentExercise === 6 && styles.outlineActive,
          currentExercise > 6 && styles.outlineComplete,
        ]}
      >
        {
          currentExercise > 6 && (
            <Icon
              name="tick-heavy"
              color={colors.grey.light}
              size={22}
            />
          )
        }
        {
          currentExercise === 6 && (
            <Text style={styles.currentSetText}>
              {currentSet}
            </Text>
          )
        }
      </View>
    </View>
  </View>
);

WorkoutProgress.propTypes = {
  currentExercise: PropTypes.number.isRequired,
  currentSet: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
  },
  exercise: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineIncomplete: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: colors.grey.light,
    borderWidth: 4,
  },
  outlineActive: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: colors.coral.standard,
    borderWidth: 4,
  },
  outlineComplete: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    borderRadius: 25,
    borderColor: colors.grey.light,
    borderWidth: 4,
  },
  currentSetText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    marginTop: 4,
    color: colors.coral.standard,
  },
});

export default WorkoutProgress;
