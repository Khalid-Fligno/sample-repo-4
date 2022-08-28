import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import PropTypes from "prop-types";
import Icon from "../Shared/Icon";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const WorkoutProgressBar = (props) => {
  const {
    currentExercise,
    currentSet,
    exerciseList,
    workoutReps,
    progressType,
    rounds,
    currentRound,
    rest,
    circleProps,
  } = props;

  const [array, setArray] = useState([]);

  useEffect(() => {
    setArray(exerciseList);
    if (progressType === "onlyOne") {
      const newArray = new Array(rounds).fill(undefined).map((val, idx) => idx);
      setArray(newArray);
    }
  }, [exerciseList, progressType]);

  const getStrengthFill = (index) => {
    if (currentExercise === index + 1) {
      return (currentSet / workoutReps) * 100;
    } else if (currentExercise > index + 1) {
      return 100;
    }

    return 0;
  };
  const getInervalFill = (index) => {
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
  const getCircuitFill = (index) => {
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

  const getFill = (index) => {
    if (progressType === "oneByOne") {
      return getStrengthFill(index);
    } else if (progressType === "onlyOne") {
      return getInervalFill(index);
    } else if (progressType === "circular") {
      return getCircuitFill(index);
    }

    return 0;
  };

  const getStrengthInnerText = (index) => {
    if (currentExercise === index + 1) {
      return <Text style={styles.currentSetText}>{currentSet}</Text>;
    } else if (currentExercise > index + 1) {
      return <Icon name="tick-heavy" color={colors.charcoal.dark} size={22} />;
    }
  };
  const getInervalInnerText = (index) => {
    if (currentRound > index + 1) {
      return <Icon name="tick-heavy" color={colors.charcoal.dark} size={18} />;
    }

    return (
      <Text style={[styles.currentSetText, { fontSize: 20 }]}>{index + 1}</Text>
    );
  };
  const getCircuitInnerText = (index) => {
    if (currentExercise > index + 1 && currentSet === rounds) {
      return <Icon name="tick-heavy" color={colors.charcoal.dark} size={18} />;
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

  const getInnerText = (index) => {
    if (progressType === "oneByOne") {
      return getStrengthInnerText(index);
    } else if (progressType === "onlyOne") {
      return getInervalInnerText(index);
    } else if (progressType === "circular") {
      return getCircuitInnerText(index);
    }

    return "";
  };

  const getTintColor = (index) => {
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
            backgroundColor="lightgray"
            {...circleProps}
          >
            {(fill) => <View>{getInnerText(index)}</View>}
          </AnimatedCircularProgress>
        </View>
      ))}
    </View>
  );
};

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
