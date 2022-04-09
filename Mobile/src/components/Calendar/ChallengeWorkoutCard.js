import React, { useEffect, useState } from "react";
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  View,
  TouchableWithoutFeedback
} from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";
import { CALENDARIMG } from "../../library/images/calendar/calendar";

const { width } = Dimensions.get("window");

const ChallengeWorkoutCard = (props) => {
  const { onPress, res, cardCustomStyle } = props;
  const [target, setTarget] = useState("");
  const [focus, setFocus] = useState("");

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

  useEffect(() => {
    let _target = "";
    let _focus = "";
    if (res && res.target === "rest") {
      setTarget("rest");
    } else {
      _target = res && res.filters ? getTarget(res.filters) : "";
      setTarget(_target);
      _focus = res && res.filters ? getFocus(res.filters) : "";
      setFocus(_focus);
    }
  }, [res, getTarget, getFocus]);

  return (
    <View style={[styles.cardContainer, cardCustomStyle]}>
      <TouchableWithoutFeedback style={styles.cardContainer} onPress={onPress}>
        <ImageBackground
          source={target ? CALENDARIMG.CHALLENGEWORKOUTCARDBG : CALENDARIMG.RESTCOVERIMAGE}
          style={styles.image}
        >
          <View style={target ? styles.opacityLayer : styles.opacityLayerRest}>
            {
              target === "" ?
              null
              :
              <View style={styles.innerViewContainer}>
                <Text
                  key={res}
                  style={[
                    styles.recTextLabel,
                    { color: colors.themeColor.color },
                  ]}
                >
                  Today's Workout
                </Text>
              </View>
            }
            <View style={styles.titleContainer}>
              {target !== "rest" && (
                <Text key={res} style={styles.target}>
                  {target}
                  {focus ? " - " + focus : ""}
                </Text>
              )}
            </View>
            {
              target === "" && (
                <View style={styles.innerViewContainerRest}>
                    <Text key={res} style={styles.targetRest}>
                      Today is a rest day
                    </Text>
                </View>
            )}
            {
              target === "" ?
                <View style={{ flex: 1, paddingTop: 5 }}>
                  <Text style={styles.startButton}>(no workout)</Text>  
                </View>
                :
                <View style={{ flex: 1, paddingTop: 10 }}>
                  <TouchableOpacity onPress={onPress} disabled={target === "rest"}>
                    <Text style={styles.startButton}>Start</Text>
                    <View
                      style={{
                        borderBottomColor: "white",
                        borderBottomWidth: 1,
                        width: 57,
                        paddingTop: 3,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          marginTop: -19,
                          paddingLeft: 45,
                          alignItems: "flex-start",
                        }}
                      >
                        <Icon
                          name="arrow-right"
                          size={13}
                          style={{ color: "white" }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
            }
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default ChallengeWorkoutCard;

ChallengeWorkoutCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  cardCustomStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: wp("35%"),
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
  opacityLayerRest: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
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
  innerViewContainerRest: {
    maxWidth: width / 1.8,
    flexDirection: "row",
    paddingTop: 12,
  },
  recTextLabel: {
    color: colors.offWhite,
    fontFamily: fonts.StyreneAWebRegular,
    textTransform: "capitalize",
    fontSize: wp("3%"),
  },
  target: {
    color: colors.offWhite,
    fontFamily: fonts.StyreneAWebRegular,
    textTransform: "capitalize",
    fontSize: wp("4%"),
  },
  targetRest: {
    color: colors.offWhite,
    fontFamily: fonts.StyreneAWebRegular,
    fontSize: wp("4%"),
  },
  startButton: {
    color: colors.offWhite,
    fontFamily: fonts.StyreneAWebRegular,
    fontSize: 14,
  },
});
