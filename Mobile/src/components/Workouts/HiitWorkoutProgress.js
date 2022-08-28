import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";
import { PieChart } from "react-native-svg-charts";
import Icon from "../Shared/Icon";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

const HiitWorkoutProgress = (props) => {
  const { currentRound, rest, rounds } = props;
  const array = new Array(rounds).fill(undefined).map((val, idx) => idx);
  const pieDataIncomplete = [0, 100].map((value, index) => ({
    value,
    svg: {
      fill: index === 0 ? colors.coral.standard : colors.grey.light,
    },
    key: `pie-${index}`,
  }));

  const pieDataSetHalf = [50, 50].map((value, index) => ({
    value,
    svg: {
      fill: index === 0 ? colors.grey.light : colors.coral.standard,
    },
    key: `pie-${index}`,
  }));

  const pieDataComplete = [100, 0].map((value, index) => ({
    value,
    svg: {
      fill: colors.coral.standard,
    },
    key: `pie-${index}`,
  }));

  const completePieChart = (
    <PieChart
      style={styles.pieChart}
      data={pieDataComplete}
      innerRadius="80%"
    />
  );
  const tickIcon = (
    <View style={styles.invisibleView}>
      <View style={styles.tickContainer}>
        <Icon name="tick-heavy" color={colors.charcoal.dark} size={18} />
      </View>
    </View>
  );
  const currentRoundText = (text) => (
    <View style={styles.invisibleView}>
      <View style={styles.currentRoundTextContainer}>
        <Text style={styles.currentRoundText}>{text}</Text>
      </View>
    </View>
  );
  const currentRoundPieChart = (resting) => (
    <PieChart
      style={styles.pieChart}
      data={resting ? pieDataSetHalf : pieDataIncomplete}
      innerRadius="80%"
      startAngle={Math.PI * 2}
      endAngle={0}
    />
  );
  const incompletePieChart = (
    <PieChart
      style={styles.pieChart}
      data={pieDataIncomplete}
      innerRadius="80%"
    />
  );
  const inactiveRoundText = (text) => (
    <View style={styles.invisibleView}>
      <View style={styles.inactiveRoundTextContainer}>
        <Text style={styles.inactiveRoundText}>{text}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {array.map((item, index) => (
        <View style={styles.exercise} key={index}>
          {currentRound > index + 1 && completePieChart}
          {currentRound > index + 1 && tickIcon}
          {currentRound === index + 1 && currentRoundPieChart(rest)}
          {currentRound === index + 1 && currentRoundText(currentRound)}
          {currentRound < index + 1 && incompletePieChart}
          {currentRound < index + 1 && inactiveRoundText(index + 1)}
        </View>
      ))}
    </View>
  );
};

HiitWorkoutProgress.propTypes = {
  currentRound: PropTypes.number.isRequired,
  rest: PropTypes.bool,
};

HiitWorkoutProgress.defaultProps = {
  rest: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 35,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  exercise: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  pieChart: {
    height: 35,
    width: 35,
  },
  invisibleView: {
    height: 0,
  },
  tickContainer: {
    marginTop: -26,
  },
  currentRoundTextContainer: {
    marginTop: -26,
  },
  currentRoundText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.charcoal.dark,
  },
  inactiveRoundTextContainer: {
    marginTop: -26,
  },
  inactiveRoundText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.grey.light,
  },
});

export default HiitWorkoutProgress;
