import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";

const SavingsBadge = ({ text }) => (
  <View style={styles.newRecipeBadgeContainer}>
    <Text style={styles.newRecipeBadgeText}>{text}</Text>
  </View>
);

SavingsBadge.propTypes = {
  text: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  newRecipeBadgeContainer: {
    backgroundColor: colors.themeColor.color,
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  newRecipeBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.white,
  },
});

export default SavingsBadge;
