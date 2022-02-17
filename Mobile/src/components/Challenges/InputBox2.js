import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
const { width } = Dimensions.get("window");

const InputBox2 = (props) => {
  return (
    <View style={[styles.inputContainer, props.customContainerStyle]}>
      <Text style={styles.inputFieldTitle}>{props.title}</Text>
      <TouchableOpacity onPress={props.onPress} style={styles.inputButton}>
        {
          <Text style={styles.inputSelectionText}>
            {props.value} {props.extension}
          </Text>
        }
      </TouchableOpacity>
    </View>
  );
};

InputBox2.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  value: PropTypes.number,
  extension: PropTypes.string,
  customContainerStyle: PropTypes.object,
};

export default InputBox2;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputButton: {
    width: width / 2,
    padding: 15,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderWidth: colors.themeColor.themeBorderWidth,
    borderColor: colors.themeColor.themeBorderColor,
    borderRadius: 2,
    marginLeft: 20,
  },
  inputSelectionText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.dark,
  },
  inputFieldTitle: {
    marginLeft: 2,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
});
