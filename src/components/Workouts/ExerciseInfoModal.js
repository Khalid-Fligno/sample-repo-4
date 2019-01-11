import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

export default class ExerciseInfoModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const {
      exerciseInfoModalVisible,
      hideExerciseInfoModal,
      exercise,
    } = this.props;
    return (
      <Modal
        isVisible={exerciseInfoModalVisible}
        animationIn="fadeIn"
        animationInTiming={400}
        animationOut="fadeOut"
        animationOutTiming={400}
      >
        <View style={styles.helperModalContainer}>
          <View style={styles.exerciseDescriptionContainer}>
            <View style={styles.exerciseTileHeaderBar}>
              <View>
                <Text style={styles.exerciseTileHeaderTextLeft}>
                  {exercise.name}
                </Text>
              </View>
            </View>
            <View style={styles.exerciseDescriptionTextContainer}>
              {
                exercise.recommendedResistance && (
                  <Text style={styles.exerciseDescriptionHeader}>Recommended resistance:</Text>
                )
              }
              {
                exercise.recommendedResistance && (
                  <Text style={styles.exerciseDescriptionText}>{exercise.recommendedResistance}</Text>
                )
              }
              {
                exercise.coachingTip && (
                  <Text style={styles.exerciseDescriptionHeader}>Coaching tip:</Text>
                )
              }
              {
                exercise.coachingTip && exercise.coachingTip.map((tip) => (
                  <Text
                    key={tip}
                    style={styles.exerciseDescriptionText}
                  >
                    {`• ${tip}`}
                  </Text>
                ))
              }
              {
                exercise.scaledVersion && (
                  <Text style={styles.exerciseDescriptionHeader}>Scaled version:</Text>
                )
              }
              {
                exercise.scaledVersion && (
                  <Text style={styles.exerciseDescriptionText}>{exercise.scaledVersion}</Text>
                )
              }
              {
                exercise.otherInfo && exercise.otherInfo.map((text) => (
                  <Text
                    key={text}
                    style={styles.exerciseDescriptionHeader}
                  >
                    {text}
                  </Text>
                ))
              }
            </View>
          </View>
          <View style={styles.helperModalButtonContainer}>
            <TouchableOpacity
              onPress={hideExerciseInfoModal}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>
                CONTINUE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

ExerciseInfoModal.propTypes = {
  exerciseInfoModalVisible: PropTypes.bool.isRequired,
  hideExerciseInfoModal: PropTypes.func.isRequired,
  exercise: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.array])).isRequired,
};

const styles = StyleSheet.create({
  helperModalContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    overflow: 'hidden',
  },
  helperModalButtonContainer: {
    backgroundColor: colors.white,
    width: '100%',
  },
  exerciseTileHeaderBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingBottom: 5,
    backgroundColor: colors.coral.standard,
  },
  exerciseTileHeaderTextLeft: {
    fontFamily: fonts.standardNarrow,
    fontSize: 14,
    color: colors.white,
  },
  exerciseDescriptionContainer: {
    width: '100%',
    marginLeft: 15,
    marginRight: 15,
    borderWidth: 2,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderColor: colors.coral.standard,
    overflow: 'hidden',
  },
  exerciseDescriptionTextContainer: {
    padding: 15,
  },
  exerciseDescriptionHeader: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
  },
  exerciseDescriptionText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.white,
    marginTop: 5,
    marginBottom: 5,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    width: '100%',
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
});
