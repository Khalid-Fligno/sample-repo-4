import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Animated,
  TouchableHighlight,
  TextInput,
} from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import CustomBtn from "../Shared/CustomBtn";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";

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

    const resx = res.length > 1 ? res[0] : res[0];

    const animatedStyle = {
      transform: [{ scale: this.animatedValue }],
    };
    let target = "";
    let focus = "";
    if (resx && resx.target === "rest") {
      target = "rest";
    } else {
      target = resx && resx.filters ? getTarget(resx.filters) : "";
      focus = resx && resx.filters ? getFocus(resx.filters) : "";
    }
    return (
      <View style={[styles.cardContainer, cardCustomStyle]}>
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
        <ImageBackground
          source={require("../../../assets/images/Calendar/challengeWorkoutCardBg.png")}
          style={styles.image}
        >
          <View style={styles.opacityLayer}>
            <View style={styles.innerViewContainer}>
              <Text
                key={resx}
                style={[
                  styles.recTextLabel,
                  { color: colors.themeColor.color },
                ]}
              >
                Today's Workout
              </Text>
            </View>
            <View style={styles.titleContainer}>
              {target !== "rest" && (
                <Text key={resx} style={styles.target}>
                  {target}
                  {focus ? " - " + focus : ""}
                </Text>
              )}
            </View>
            <View style={styles.innerViewContainer}>
              {target === '' && (
                <Text key={resx} style={styles.target}>
                  Today is your rest day
                </Text>
              )}
            </View>

            {/* 
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
             */}
             <View style={{flex: 1,paddingTop: 10,}}>
               <TouchableOpacity onPress={onPress} disabled={target === "rest"}>
               <Text 
               style={styles.startButton}
               >
                 Start
               </Text>
               <View 
               style=
               {{
                 borderBottomColor: 'white',
                 borderBottomWidth: 1,
                 width:57,
                 paddingTop: 3,
                }}
                 >
               <View style={{flex: 1,marginTop: -19,paddingLeft: 45,alignItems: 'flex-start'}}>
                   <Icon name="arrow-right" size={13} style={{ color: 'white'}}/>  
               </View>

               </View>
               </TouchableOpacity>

             </View>

          </View>
        </ImageBackground>
        </TouchableOpacity>
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
  target:{
    color: colors.offWhite,
    fontFamily: fonts.StyreneAWebRegular,
    textTransform: "capitalize",
    fontSize: wp("4%"),

  },
  startButton:{
    color: colors.offWhite,
    fontFamily: fonts.StyreneAWebRegular,
    fontSize: 14,
  }
  
});