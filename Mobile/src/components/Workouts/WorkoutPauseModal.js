import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import CustomBtn from "../Shared/CustomBtn";

const customBtnStyle = {
  borderRadius: 50,
  marginTop: 10,
  backgroundColor: colors.white,
  padding: 20,
};
const customBtnTitleStyle = {
  color: colors.transparentBlackDark,
};

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
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={styles.pauseIconContainer}>
        <Icon name="pause" size={100} color={colors.white} />
      </View>
      <View style={styles.pauseModalContainer}>
        <CustomBtn
          customBtnStyle={customBtnStyle}
          customBtnTitleStyle={customBtnTitleStyle}
          titleCapitalise={true}
          Title="QUIT WORKOUT"
          onPress={handleQuit}
        />
        <CustomBtn
          customBtnStyle={customBtnStyle}
          customBtnTitleStyle={customBtnTitleStyle}
          titleCapitalise={true}
          Title="RESTART THIS SET"
          onPress={() =>
            handleRestart(
              exerciseList,
              fitnessLevel || reps,
              currentExerciseIndex
            )
          }
        />

        {handleSkip && (
          <CustomBtn
            customBtnStyle={customBtnStyle}
            customBtnTitleStyle={customBtnTitleStyle}
            titleCapitalise={true}
            Title="SKIP THIS EXERCISE"
            onPress={() =>
              handleSkip(
                exerciseList,
                fitnessLevel || reps,
                currentExerciseIndex
              )
            }
          />
        )}
        <CustomBtn
          customBtnStyle={customBtnStyle}
          outline={true}
          titleCapitalise={true}
          Title="CONTINUE"
          onPress={handleUnpause}
        />
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
    borderRadius: 4,
    overflow: "hidden",
  },
  pauseIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
});

export default WorkoutPauseModal;
