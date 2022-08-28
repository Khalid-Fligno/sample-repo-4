import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const { width } = Dimensions.get("window");

const ProgressBar = (props) => {
  const {
    title,
    completed,
    total,
    customTitleStyle,
    size,
    customProgressNumberStyle,
    customProgessTotalStyle,
  } = props;
  return (
    <View style={styles.container}>
      <AnimatedCircularProgress
        size={size}
        width={4}
        fill={(completed / total) * 100}
        tintColor={colors.themeColor.color}
        backgroundColor="lightgray"
        rotation={0}
      >
        {(fill) => (
          <View>
            <Text style={[styles.progressBarLabel, customProgessTotalStyle]}>
              <Text
                style={[styles.progressCircleNumber, customProgressNumberStyle]}
              >
                {completed}
              </Text>
            </Text>
            {title && (
              <Text style={[styles.progressCircleText, customTitleStyle]}>
                {title}
              </Text>
            )}
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default ProgressBar;

ProgressBar.propTypes = {
  title: PropTypes.string,
  completed: PropTypes.number.isRequired,
  total: PropTypes.number,
  customTitleStyle: PropTypes.object,
  size: PropTypes.any,
  customProgressNumberStyle: PropTypes.object,
  customProgessTotalStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
  },
  progressBarLabel: {
    fontFamily: fonts.standardNarrow,
    fontSize: hp("2%"),
    color: colors.grey.dark,
    textAlign: "center",
    marginTop: -20,
    marginBottom: -5,
  },

  progressCircleText: {
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: wp("2.5%"),
    fontFamily: fonts.standardNarrow,
    color: colors.transparentBlackMid,
    letterSpacing: 0.7,
    paddingTop: 5,
  },
  progressCircleNumber: {
    fontSize: wp("19%"),
    fontFamily: fonts.standardNarrow,
    color: "#4c4d52",
    fontVariant: ["lining-nums"],
  },
});
