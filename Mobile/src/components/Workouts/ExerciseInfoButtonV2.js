import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import PropTypes from "prop-types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import fonts from "../../styles/fonts";

const { width } = Dimensions.get("window");

const ExerciseInfoButtonV2 = ({ onPress }) => (
  <View style={styles.invisibleView}>
    <TouchableOpacity onPress={onPress} style={styles.helpButton}>
      <Icon name="information" size={20} style={styles.icon} />
      <Text style={styles.text}>Instructions</Text>
    </TouchableOpacity>
  </View>
);

ExerciseInfoButtonV2.propTypes = {
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
    height: 30,
    width: 150,
    position: "absolute",
    marginTop: -35,

    borderTopLeftRadius: 4,
    flexDirection: "row",
  },
  icon: {
    marginTop: 2,
    marginLeft: 2,
    paddingRight: 8,
  },
  text: {
    fontFamily: fonts.bold,
  },
});

export default ExerciseInfoButtonV2;
