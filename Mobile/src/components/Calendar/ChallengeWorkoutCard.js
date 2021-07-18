import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Animated,
} from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import CustomBtn from "../Shared/CustomBtn";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

const getTarget = (filters) => {
  if (filters.includes("strength")) {
    return "Strength";
  } else if (filters.includes("interval")) {
    return "Interval";
  } else if (filters.includes("circuit")) {
    return "Circuit";
  } else if (filters.includes("rest")) {
    return "rest";
  }
};

const getFocus = (filters) => {
  if (filters.includes("fullBody")) {
    return "Full Body";
  } else if (filters.includes("upperBody")) {
    return "Upper Body";
  } else if (filters.includes("lowerBody")) {
    return "Lower Body";
  } else if (filters.includes("core")) {
    return "Core";
  }
};

export default class ChallengeWorkoutCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(1);
  }
  handlePressIn = () => {
    Animated.spring(this.animatedValue, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };
  handlePressOut = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  render() {
    const {
      onPress,
      res,
      currentDay,
      // title,
      // image,
      // recommendedWorkout,
      cardCustomStyle,
      title,
    } = this.props;
    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    let target = "";
    let focus = "";
    if (res && res.target === "rest") {
      target = "rest";
    } else {
      target = res && res.filters ? getTarget(res.filters) : "";
      focus = res && res.filters ? getFocus(res.filters) : "";
    }
    return (
      <View style={[styles.cardContainer, cardCustomStyle]}>
        <ImageBackground
          source={require("../../../assets/images/Calendar/challengeWorkoutCardBg.png")}
          style={styles.image}
        >
          <View style={styles.opacityLayer}>
            <View style={styles.innerViewContainer}>
              <Text
                key={res}
                style={[
                  styles.recTextLabel,
                  { color: colors.themeColor.color },
                ]}
              >
                {title}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Day {currentDay}</Text>
            </View>
            <View style={styles.innerViewContainer}>
              {target !== "rest" && (
                <Text key={res} style={styles.recTextLabel}>
                  {target}
                  {focus ? " - " + focus : ""}
                </Text>
              )}
              {target === "rest" && (
                <Text key={res} style={styles.recTextLabel}>
                  Today is your rest day
                </Text>
              )}
            </View>
            <CustomBtn
              Title="View Workout"
              customBtnStyle={{
                padding: wp("1%"),

                backgroundColor: colors.themeColor.color,
                width: wp("30%"),
                marginTop: wp("1%"),
              }}
              customBtnTitleStyle={{
                marginTop: 0,
                fontSize: wp("3%"),
                fontFamily: fonts.boldNarrow,
              }}
              onPress={onPress}
              disabled={target === "rest"}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

ChallengeWorkoutCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  // title: PropTypes.string.isRequired,
  // image: PropTypes.number.isRequired,
  // recommendedWorkout: PropTypes.array,
  cardCustomStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: wp("33%"),
  },
  flexContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.grey.medium,
    borderRadius: 3,
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    paddingVertical: wp("4%"),
  },
  titleContainer: {
    maxWidth: width / 1.8,
  },
  title: {
    fontFamily: fonts.boldNarrow,
    fontSize: wp("6%"),
    color: colors.offWhite,
    textAlign: "left",
    textTransform: "uppercase",
  },
  innerViewContainer: {
    maxWidth: width / 1.8,
    flexDirection: "row",
  },
  recTextLabel: {
    color: colors.offWhite,
    fontFamily: fonts.StyreneAWebRegular,
    textTransform: "capitalize",
    fontSize: wp("3%"),
  },
});
