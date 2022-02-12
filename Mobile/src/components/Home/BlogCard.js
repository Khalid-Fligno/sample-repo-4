import React from "react";
import {
  Dimensions,
  Text,
  StyleSheet,
  ImageBackground,
  View,
  Linking,
} from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import CustomBtn from "../Shared/CustomBtn";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { containerPadding } from "../../styles/globalStyles";
import Carousel from "react-native-snap-carousel";
import { Image } from "react-native";
const { width } = Dimensions.get("window");
import * as Haptics from "expo-haptics";

const BlogCard = (props) => {
  const { title, cardCustomStyle, cardImageStyle, data } = props;

  const openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide} key={index}>
        <Image
          source={{ uri: item.coverImage }}
          resizeMode="cover"
          style={{
            width: "100%",
            height: "55%",
            borderRadius: 3,
            backgroundColor: colors.grey.medium,
          }}
        />
        <Text style={styles.slideTitle}>{item.title}</Text>
        <View
          style={{
            alignItems: "center",
            width: "100%",
            marginBottom: wp("5%"),
          }}
        >
          <CustomBtn
            Title="Read more"
            customBtnStyle={{
              padding: wp("2.2%"),
              borderRadius: 50,
              backgroundColor: colors.themeColor.color,
              paddingHorizontal: wp("10%"),
            }}
            customBtnTitleStyle={{
              marginTop: 0,
              fontSize: 13,
              fontFamily: fonts.boldNarrow,
            }}
            onPress={() => openLink(item.urlLink)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.cardContainer, cardCustomStyle]}>
      <ImageBackground
        style={[styles.image, cardImageStyle]}
        resizeMode="stretch"
      >
        <View style={styles.opacityLayer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <View
              style={{
                borderTopWidth: 4,
                width: wp("14%"),
                marginBottom: wp("5%"),
                marginTop: wp("1.5%"),
                borderTopColor: colors.themeColor.color,
                borderRadius: 50,
              }}
            ></View>
          </View>
          <Carousel
            data={data}
            renderItem={_renderItem}
            sliderWidth={wp("100%")}
            itemWidth={wp("75%")}
            containerCustomStyle={{
              marginTop: wp("2%"),
            }}
            slideStyle={{
              paddingLeft: 0,
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default BlogCard;

BlogCard.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  cardCustomStyle: PropTypes.object,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: wp("130%"),
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
    backgroundColor: colors.black,
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
  },
  titleContainer: {
    maxWidth: wp("80%"),
    paddingTop: wp("8%"),
    paddingLeft: 30,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: wp("5.5%"),
    color: colors.offWhite,
    textAlign: "left",
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
  slide: {
    backgroundColor: colors.offWhite,
    height: "92%",
    borderRadius: 3,
  },
  slideTitle: {
    fontFamily: fonts.bold,
    fontSize: wp("4%"),
    color: colors.black,
    textAlign: "left",
    paddingHorizontal: "10%",
    paddingVertical: "8%",
    textAlign: "center",
    height: "30%",
  },
});
