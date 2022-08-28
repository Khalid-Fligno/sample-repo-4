import React from "react";
import {
  Dimensions,
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
import { containerPadding } from "../../styles/globalStyles";
import DownArrow from "./DownArrow";

const { width } = Dimensions.get("window");

const WorkOutCard = (props) => {
  const animatedValue = new Animated.Value(1);
  const {
    onPress,
    title,
    image,
    recommendedWorkout,
    cardCustomStyle,
    cardImageStyle,
  } = props;

  return (
    <View style={[styles.cardContainer, cardCustomStyle]}>
      <ImageBackground
        source={image}
        style={[styles.image, cardImageStyle]}
        resizeMode="stretch"
      >
        <View style={styles.opacityLayer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>TODAY'S</Text>
            <Text style={styles.title2}>WORKOUT</Text>
          </View>
          <View style={styles.innerViewContainer}>
            <View
              style={{
                borderTopWidth: 4,
                width: wp("20%"),
                marginBottom: wp("5%"),
                marginTop: wp("3%"),
                borderTopColor: colors.offWhite,
                borderRadius: 50,
              }}
            ></View>
            {recommendedWorkout.map((res, i) => (
              <Text key={i} style={styles.recTextLabel}>
                {res}
              </Text>
            ))}
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              alignItems: "center",
              width: "100%",
              marginBottom: wp("11%"),
            }}
          >
            <CustomBtn
              Title="View Workout"
              customBtnStyle={{
                padding: wp("2.2%"),

                backgroundColor: colors.themeColor.color,
                paddingHorizontal: wp("10%"),
              }}
              customBtnTitleStyle={{
                marginTop: 0,
                fontSize: 13,
                fontFamily: fonts.boldNarrow,
                color: colors.black,
              }}
              onPress={onPress}
            />
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          marginTop: -wp("7.5%"),
          alignItems: "center",
        }}
      >
        <DownArrow />
      </View>
    </View>
  );
};

export default WorkOutCard;

WorkOutCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
  recommendedWorkout: PropTypes.array,
  cardCustomStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: wp("115%"),
    marginHorizontal: containerPadding,
    borderRadius: 3,
  },
  flexContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 3,
    backgroundColor: "#f14a42",
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  titleContainer: {
    maxWidth: wp("80%"),
    paddingTop: wp("13%"),
    paddingLeft: 30,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: wp("7%"),
    color: colors.black,
    textAlign: "left",
  },
  title2: {
    fontSize: wp("11%"),
    color: colors.offWhite,
    textAlign: "left",
    fontStyle: "italic",
    fontWeight: "700",
  },
  innerViewContainer: {
    maxWidth: "80%",
    paddingTop: 12,
    paddingLeft: 30,
    paddingTop: 5,
    flexDirection: "column",
  },
  recTextLabel: {
    color: colors.offWhite,
    fontFamily: fonts.bold,
    marginBottom: wp("1%"),
  },
});
