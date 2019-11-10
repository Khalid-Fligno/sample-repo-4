import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from '../../components/Shared/Icon';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const CountdownPauseModal = ({
  isVisible,
  handleQuit,
  handleUnpause,
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

CountdownPauseModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  handleQuit: PropTypes.func.isRequired,
  handleUnpause: PropTypes.func.isRequired,
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
  modalButtonContinue: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
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

export default CountdownPauseModal;
