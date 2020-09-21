import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from '../../components/Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const WorkoutPauseModal = ({
  isVisible,
  handleQuit,
  handleRestart,
  handleSkip,
  handleUnpause,
  exerciseList,
  fitnessLevel,
  currentExerciseIndex,
  reps,
}) => (
  <Modal
    isVisible={isVisible}
    animationIn="fadeIn"
    animationInTiming={800}
    animationOut="fadeOut"
    animationOutTiming={800}
  >
    <View>
      <View style={styles.pauseIconContainer}>
        <Icon
          name="pause"
          size={100}
          color={colors.white}
        />
      </View>
      <View style={styles.pauseModalContainer}>
        <TouchableOpacity
          onPress={handleQuit}
          style={styles.modalButtonQuit}
        >
          <Text style={styles.modalButtonTextDark}>
            QUIT WORKOUT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRestart(exerciseList, fitnessLevel || reps,currentExerciseIndex)}
          style={styles.modalButtonRestart}
        >
          <Text style={styles.modalButtonText}>
            RESTART THIS SET
          </Text>
        </TouchableOpacity>
        {
          handleSkip && (
            <TouchableOpacity
              onPress={() => handleSkip(exerciseList, fitnessLevel || reps,currentExerciseIndex)}
              style={styles.modalButtonSkip}
            >
              <Text style={styles.modalButtonText}>
                SKIP THIS EXERCISE
              </Text>
            </TouchableOpacity>
          )
        }
        <TouchableOpacity
          onPress={handleUnpause}
          style={styles.modalButtonContinue}
        >
          <Text style={styles.modalButtonText}>
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

WorkoutPauseModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleQuit: PropTypes.func.isRequired,
  handleRestart: PropTypes.func.isRequired,
  handleSkip: PropTypes.func,
  handleUnpause: PropTypes.func.isRequired,
  exerciseList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fitnessLevel: PropTypes.string,
  reps: PropTypes.string,
};

WorkoutPauseModal.defaultProps = {
  fitnessLevel: undefined,
  reps: undefined,
  handleSkip: undefined,
};

const styles = StyleSheet.create({
  pauseModalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  pauseIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
  },
  modalButtonQuit: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonRestart: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.charcoal.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonSkip: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.charcoal.darkest,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonContinue: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.themeColor.color,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 4,
  },
  modalButtonTextDark: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
    marginTop: 4,
  },
});

export default WorkoutPauseModal;
