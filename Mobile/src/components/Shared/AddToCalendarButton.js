import React from "react";
import PropTypes from "prop-types";
import { Text, StyleSheet } from "react-native";
import colors from "../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import CalenderSvg from "../../../assets/icons/calender";

const AddToCalendarButton = (props) => {
  const { onPress } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.addToCalendarButton}
      activeOpacity={0.8}
    >
      <CalenderSvg fill={colors.themeColor.color} />
      <Text style={styles.addToCalendarButtonText}>Add to calendar</Text>
    </TouchableOpacity>
  );
};

export default AddToCalendarButton;

AddToCalendarButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  addToCalendarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 3,
    borderWidth: 2,
    backgroundColor: colors.themeColor.themeBackgroundColor,
    borderColor: colors.grey.standard,
    borderRadius: 50,
    shadowColor: colors.charcoal.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    padding: 5,
    paddingLeft: 15,
    paddingRight: 10,
  },
  addToCalendarButtonText: {
    letterSpacing: 0.5,
    fontSize: 14,
    color: colors.themeColor.color,
    marginLeft: 8,
    marginRight: 5,
    fontWeight: "600",
  },
});
