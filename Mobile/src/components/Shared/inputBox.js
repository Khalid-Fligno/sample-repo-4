import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { Input } from "react-native-elements";
import { containerPadding } from "../../styles/globalStyles";
const { width } = Dimensions.get("window");

const InputBox = (props) => {
  let [isFocused, setFocused] = useState(false);
  return (
    <Input
      placeholderTextColor={colors.grey.standard}
      returnKeyType="next"
      autoCorrect={false}
      autoCapitalize="none"
      containerStyle={styles.inputComponentContainer}
      inputContainerStyle={
        isFocused ? styles.inputContainer1 : styles.inputContainer
      }
      clearButtonMode="while-editing"
      onFocus={() => setFocused(true)}
      {...props}
      onEndEditing={() => setFocused(false)}
    />
  );
};

const styles = StyleSheet.create({
  inputComponentContainer: {
    width: width - containerPadding * 2,
    alignItems: "center",
  },
  inputContainer: {
    width: width - containerPadding * 2,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 2,
    backgroundColor: colors.transparentWhiteLight,
    borderBottomColor: colors.grey.light,
  },
  inputContainer1: {
    width: width - containerPadding * 2,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 2,
    backgroundColor: colors.transparentWhiteLight,
    borderBottomColor: colors.themeColor.color,
  },
  input: {
    width: width - containerPadding * 2,
    padding: 12,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    borderWidth: 1,
    borderColor: colors.grey.light,
    borderRadius: 4,
  },
});

export default InputBox;
