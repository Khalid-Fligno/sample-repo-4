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
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

export default class GymWorkout extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
        <View>
          <Text>asdf</Text>
        </View>
    );
  }
}

GymWorkout.propTypes = {
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