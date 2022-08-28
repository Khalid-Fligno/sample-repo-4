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

const { width } = Dimensions.get("window");

const FeedCard = (props) => {
  const {
    onPress,
    title,
    cardCustomStyle,
    cardImageStyle,
    customTitleStyle,
    customBtnStyle = {},
    customBtnTitleStyle = {},
    btnTitle,
    image,
  } = props;

  return (
    <View style={[styles.cardContainer, cardCustomStyle]}>
      <ImageBackground
        source={image}
        style={[styles.image, cardImageStyle]}
        resizeMode="stretch"
      >
        <View style={styles.opacityLayer}>
          {title && (
            <View style={styles.titleContainer}>
              <Text style={[styles.title, customTitleStyle]}>{title}</Text>
              <View
                style={{
                  borderTopWidth: 4,
                  width: "15%",
                  marginBottom: wp("5%"),
                  marginTop: wp("1.5%"),
                  borderTopColor: colors.themeColor.color,
                  borderRadius: 50,
                }}
              ></View>
            </View>
          )}

          <View
            style={{
              position: "absolute",
              bottom: 0,
              alignItems: "center",
              width: "100%",
              marginBottom: wp("8%"),
            }}
          >
            <CustomBtn
              Title={btnTitle}
              customBtnStyle={{
                padding: wp("2.2%"),

                backgroundColor: colors.themeColor.color,
                paddingHorizontal: wp("10%"),
                ...customBtnStyle,
              }}
              customBtnTitleStyle={{
                marginTop: 0,
                fontSize: 13,
                fontFamily: fonts.boldNarrow,
                ...customBtnTitleStyle,
              }}
              onPress={onPress}
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default FeedCard;

FeedCard.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string,
  cardCustomStyle: PropTypes.object,
  customTitleStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: wp("110%"),
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
    backgroundColor: "#f7f7f7",
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  titleContainer: {
    paddingTop: wp("8%"),
    paddingLeft: 30,
    alignItems: "flex-start",
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: wp("5.5%"),
    color: colors.black,
    textAlign: "left",
    textTransform: "uppercase",
  },
  innerViewContainer: {
    maxWidth: width / 1.8,
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
