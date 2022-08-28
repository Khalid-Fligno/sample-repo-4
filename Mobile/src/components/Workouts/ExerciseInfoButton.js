import React from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Icon from "../Shared/Icon";
import colors from "../../styles/colors";

const { width } = Dimensions.get("window");

const ExerciseInfoButton = ({ onPress }) => (
  <View style={styles.invisibleView}>
    <TouchableOpacity onPress={onPress} style={styles.helpButton}>
      <Icon
        name="question-speech-bubble"
        size={35}
        color={colors.white}
        style={styles.icon}
      />
    </TouchableOpacity>
  </View>
);

ExerciseInfoButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  invisibleView: {
    height: 0,
    width,
    alignItems: "flex-end",
  },
  helpButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 52,
    width: 52,
    position: "absolute",
    marginTop: -52,
    backgroundColor: colors.transparentBlackLight,
    borderTopLeftRadius: 4,
  },
  icon: {
    marginTop: 2,
    marginLeft: 2,
  },
});

export default ExerciseInfoButton;
