import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  View,
} from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import CustomBtn from "../Shared/CustomBtn";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

const PhaseCard = (props) => {
  const { image, cardCustomStyle, phase, phaseData, openLink } = props;

  return (
    <View style={[styles.cardContainer, cardCustomStyle]}>
      <TouchableOpacity style={styles.cardContainer} onPress={openLink}>
        <ImageBackground
          source={{ uri: image, cache: "force-cache" }}
          style={styles.image}
          resizeMode="stretch"
        >
          <View style={styles.opacityLayer}>
            <View style={styles.titleContainer}>
              <CustomBtn
                Title={`${phase.name.substring(0, 5)} ${phase.name.substring(
                  5,
                  6
                )}`}
                outline={true}
                customBtnStyle={{
                  padding: wp("1.7%"),

                  width: "50%",
                  backgroundColor: "transparent",
                  justifyContent: "space-between",
                  paddingStart: wp("5%"),
                  paddingEnd: wp("3%"),
                  marginBottom: wp("2%"),
                  borderWidth: 1.5,
                }}
                isRightIcon={true}
                rightIconName="chevron-right"
                rightIconColor={colors.offWhite}
                customBtnTitleStyle={{
                  fontFamily: fonts.SimplonMonoMedium,
                  color: colors.offWhite,
                  textTransform: "capitalize",
                }}
                onPress={openLink}
              />
              <Text style={styles.title}>{phaseData.description}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

export default PhaseCard;

PhaseCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  image: PropTypes.any,
  recommendedWorkout: PropTypes.array,
  cardCustomStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  cardContainer: {
    height: wp("26%"),
    marginTop: wp("1.5%"),
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
    backgroundColor: colors.grey.medium,
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    backgroundColor: colors.transparentBlackLightest,
  },
  titleContainer: {
    maxWidth: "100%",
    height: "100%",
    paddingVertical: wp("4%"),
    paddingHorizontal: wp("5%"),
    flexDirection: "column",
  },
  title: {
    fontFamily: fonts.GothamMedium,
    fontSize: wp("3%"),
    color: colors.grey.medium,
    textAlign: "left",
    maxWidth: "50%",
    lineHeight: wp("4%"),
    maxHeight: "70%",
  },
  innerViewContainer: {
    maxWidth: width / 1.8,
    paddingTop: 12,
    paddingLeft: 30,
    paddingTop: 5,
    flexDirection: "row",
  },
  recTextLabel: {
    color: colors.themeColor.color,
    fontFamily: fonts.bold,
  },
});
