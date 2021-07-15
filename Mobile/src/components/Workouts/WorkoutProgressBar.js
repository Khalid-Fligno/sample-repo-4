import React from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes, { number } from "prop-types";
import { PieChart } from "react-native-svg-charts";
import Icon from "../Shared/Icon";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { round } from "react-native-reanimated";

class WorkoutProgressBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      currentExercise,
      currentSet,
      exerciseList,
      workoutReps,
      progressType,
      rounds,
      currentRound,
      rest,
    } = this.props;

    let array = exerciseList;
    if (progressType === "onlyOne") {
      array = new Array(rounds).fill(undefined).map((val, idx) => idx);
    }

    // console.log(currentExercise, currentSet)

    let getStrengthFill = (index) => {
      if (currentExercise === index + 1) {
        return (currentSet / workoutReps) * 100;
      } else if (currentExercise > index + 1) {
        return 100;
      }

      return 0;
    };
    let getInervalFill = (index) => {
      // console.log(currentRound)
      if (currentRound < index + 1) {
        return 0;
      } else if (currentRound > index + 1) {
        return 100;
      } else if (currentRound === index + 1) {
        if (rest) return 100;

        return 50;
      }

      return 0;
    };
    let getCircuitFill = (index) => {
      for (let i = 1; i <= rounds; i++) {
        if (currentSet === i) {
          if (currentExercise < index + 1 && i === 1) {
            return 0;
          } else if (currentExercise === index + 1) {
            return (currentSet / rounds) * 100;
          } else if (currentExercise > index + 1) {
            return (currentSet / rounds) * 100;
          } else if (currentExercise < index + 1 && i !== 1) {
            return ((currentSet - 1) / rounds) * 100;
          }

          return 0;
        }
      }
    };

    let getFill = (index) => {
      if (progressType === "oneByOne") {
        return getStrengthFill(index);
      } else if (progressType === "onlyOne") {
        return getInervalFill(index);
      } else if (progressType === "circular") {
        return getCircuitFill(index);
      }

      return 0;
    };

    let getStrengthInnerText = (index) => {
      if (currentExercise === index + 1) {
        return <Text style={styles.currentSetText}>{currentSet}</Text>;
      } else if (currentExercise > index + 1) {
        return (
          <Icon name="tick-heavy" color={colors.charcoal.dark} size={22} />
        );
      }
    };
    let getInervalInnerText = (index) => {
      if (currentRound > index + 1) {
        return (
          <Icon name="tick-heavy" color={colors.charcoal.dark} size={18} />
        );
      }

      return (
        <Text style={[styles.currentSetText, { fontSize: 20 }]}>
          {index + 1}
        </Text>
      );
    };
    let getCircuitInnerText = (index) => {
      // console.log(currentSet,rounds)
      if (currentExercise > index + 1 && currentSet === rounds) {
        return (
          <Icon name="tick-heavy" color={colors.charcoal.dark} size={18} />
        );
      } else if (currentExercise > index + 1) {
        return (
          <Text style={[styles.currentSetText, { fontSize: 20 }]}>
            {currentSet}
          </Text>
        );
      } else if (currentExercise < index + 1) {
        return (
          <Text style={[styles.currentSetText, { fontSize: 20 }]}>
            {currentSet - 1 === 0 ? "" : currentSet - 1}
          </Text>
        );
      } else if (currentExercise === index + 1) {
        return (
          <Text style={[styles.currentSetText, { fontSize: 20 }]}>
            {currentSet}
          </Text>
        );
      }
    };

    let getInnerText = (index) => {
      if (progressType === "oneByOne") {
        return getStrengthInnerText(index);
      } else if (progressType === "onlyOne") {
        return getInervalInnerText(index);
      } else if (progressType === "circular") {
        return getCircuitInnerText(index);
      }

      return "";
    };

    let getTintColor = (index) => {
      if (progressType === "circular") {
        if (currentExercise < index + 1) return colors.grey.dark;
      }

      return colors.citrus;
    };
    return (
      <View style={styles.container}>
        {array.map((res, index) => (
          <View style={styles.exercise} key={index}>
            <AnimatedCircularProgress
              size={progressType === "onlyOne" ? 39 : 45}
              width={5}
              fill={getFill(index)}
              rotation={0}
              tintColor={getTintColor(index)}
              // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="lightgray"
              {...this.props.circleProps}
            >
              {(fill) => <View>{getInnerText(index)}</View>}
            </AnimatedCircularProgress>
          </View>
        ))}
      </View>
    );
  }
}

WorkoutProgressBar.propTypes = {
  currentExercise: PropTypes.number.isRequired,
  currentSet: PropTypes.number.isRequired,
  exerciseList: PropTypes.array.isRequired,
  currentRound: PropTypes.number,
  rest: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flex: 0.5,
    flexDirection: "row",
    flexWrap: "wrap",
    height: 48,
    // paddingLeft: 5,
    // paddingRight: 5,
    backgroundColor: colors.themeColor.themeBackgroundColor,
    width: "100%",
    paddingHorizontal: 10,
    justifyContent: "space-around",
  },
  exercise: {
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  currentSetText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.dark,
  },
});

export default WorkoutProgressBar;
