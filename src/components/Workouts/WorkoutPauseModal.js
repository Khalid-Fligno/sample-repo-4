import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

export default class WorkoutPauseModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {
      isVisible,
      handleQuit,
      handleRestart,
      handleUnpause,
      exerciseList,
      fitnessLevel,
      reps,
    } = this.props;
    return (
      <Modal
        isVisible={isVisible}
        animationIn="fadeIn"
        animationInTiming={800}
        animationOut="fadeOut"
        animationOutTiming={800}
        onBackdropPress={handleUnpause}
      >
        <View style={styles.pauseModalContainer}>
          <TouchableOpacity
            onPress={handleQuit}
            style={styles.modalButtonQuit}
          >
            <Text style={styles.modalButtonText}>
              QUIT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRestart(exerciseList, fitnessLevel || reps)}
            style={styles.modalButtonRestart}
          >
            <Text style={styles.modalButtonText}>
              RESTART
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUnpause}
            style={styles.modalButtonContinue}
          >
            <Text style={styles.modalButtonText}>
              CONTINUE
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

WorkoutPauseModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleQuit: PropTypes.func.isRequired,
  handleRestart: PropTypes.func.isRequired,
  handleUnpause: PropTypes.func.isRequired,
  exerciseList: PropTypes.arrayOf(PropTypes.object).isRequired,
  fitnessLevel: PropTypes.string,
  reps: PropTypes.string,
};

WorkoutPauseModal.defaultProps = {
  fitnessLevel: undefined,
  reps: undefined,
};

const styles = StyleSheet.create({
  pauseModalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalButtonQuit: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonRestart: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonContinue: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.charcoal.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
});
