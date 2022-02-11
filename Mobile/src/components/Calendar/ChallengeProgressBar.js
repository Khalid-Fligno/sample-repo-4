import React from "react";
import { StyleSheet, View, Text } from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ChallengeProgressBar = (props) => {
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
        width={wp("1.2%")}
        fill={(completed / total) * 100}
        tintColor={colors.themeColor.color}
        backgroundColor={colors.smoke}
        rotation={0}
      >
        {(fill) => (
          <View>
            <Text style={styles.label}>DAY</Text>
            <Text style={[styles.progressBarLabel, customProgessTotalStyle]}>
              <Text
                style={[styles.progressCircleNumber, customProgressNumberStyle]}
              >
                {completed}
              </Text>
            </Text>
            <Text style={styles.label}>/ {total}</Text>
          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};

export default ChallengeProgressBar;

ChallengeProgressBar.propTypes = {
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
  label: {
    fontFamily: fonts.SimplonMonoLight,
    fontSize: wp("3%"),
    color: colors.grey.dark,
    textAlign: "center",
  },
  progressBarLabel: {
    fontFamily: fonts.standardNarrow,
    fontSize: hp("2%"),
    color: colors.grey.dark,
    textAlign: "center",
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
    fontSize: wp("10%"),
    fontFamily: fonts.SimplonMonoMedium,
    color: colors.black,
    fontVariant: ["lining-nums"],
  },
});
