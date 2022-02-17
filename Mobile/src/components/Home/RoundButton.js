import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { containerPadding } from "../../styles/globalStyles";

const { width } = Dimensions.get("window");
const RoundButton = (props) => {
  const [BorderColor, setBorderColor] = useState({
    borderColor: colors.grey.medium,
  });

  let onPressIn = () => {
    setBorderColor({
      borderColor: colors.themeColor.color,
    });
  };
  let onPressOut = () => {
    setBorderColor({
      borderColor: colors.grey.medium,
    });
  };
  return (
    <View style={styles.Container}>
      <TouchableOpacity
        style={[styles.btnContainer, props.customBtnStyle, BorderColor]}
        onPress={props.onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <View style={styles.roundButtonInnerContainer}>
          <Text style={styles.btnText}>{props.title}</Text>
          <Icon
            name={props.rightIcon}
            size={15}
            color={colors.grey.standard}
            style={{ marginLeft: 10 }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RoundButton;

const styles = StyleSheet.create({
  Container: {
    width: (width - containerPadding * 2) / 2,
  },
  btnContainer: {
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.grey.medium,
    padding: 10,
    backgroundColor: colors.citrus,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 8,
  },
  roundButtonInnerContainer: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8,
    width: "100%",
    justifyContent: "center",
  },
  btnText: {
    fontFamily: fonts.bold,
    alignSelf: "center",
    fontSize: 12,
    color: colors.transparentBlackDark,
    marginLeft: 10,
  },
});
