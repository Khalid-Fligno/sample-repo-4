import React from "react";
import { Text, View, StyleSheet } from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import PropTypes from "prop-types";
import TimeSvg from "../../../assets/icons/time";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import FastImage from "react-native-fast-image";

const WorkoutListItem = ({
  timeInterval,
  description,
  title,
  url,
  onPress,
  count,
}) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.4}>
    <View style={styles.ItemContainer}>
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.image}
          source={{ uri: url, cache: "immutable" }}
          imageStyle={{ borderRadius: 3 }}
          resizeMode={FastImage.resizeMode.cover}
        >
          <View style={styles.opacityLayer}></View>
        </FastImage>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {!count && (
          <View style={styles.timeContainer}>
            <TimeSvg width={hp("2.5%")} height={hp("2.5%")} />
            <Text style={styles.time}>{timeInterval}m</Text>
          </View>
        )}
        {count && <View style={styles.timeContainer}></View>}
      </View>
    </View>
  </TouchableOpacity>
);

WorkoutListItem.propTypes = {
  timeInterval: PropTypes.number,
  description: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.any,
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  ItemContainer: {
    flexDirection: "row",
    marginVertical: 15,
  },

  imageContainer: { borderRadius: 50 },

  image: { height: 90, width: 90 },

  opacityLayer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparentBlackLightest,
    borderRadius: 3,
  },

  textContainer: {
    marginLeft: 15,
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  title: {
    color: colors.charcoal.standard,
    fontFamily: fonts.StyreneAWebRegular,
    fontSize: 15,
  },
  description: {
    color: colors.grey.dark,
    fontFamily: fonts.StyreneAWebThin,
    fontSize: 10,
    width: wp("50%"),
    lineHeight: wp("3%"),
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  time: {
    color: colors.grey.dark,
    fontFamily: fonts.bold,
    marginLeft: 5,
  },
});

export default WorkoutListItem;
