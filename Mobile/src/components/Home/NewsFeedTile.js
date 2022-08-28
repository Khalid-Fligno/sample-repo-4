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

const { width } = Dimensions.get("window");

const NewsFeedTile = (props) => {
  const { onPress, title, image } = props;

  const animatedValue = new Animated.Value(1);
  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };
  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      delayPressIn={60}
      onPress={onPress}
      style={styles.cardContainer}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.flexContainer, animatedStyle]}>
        <ImageBackground source={image} style={styles.image}>
          <View style={styles.opacityLayer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title.toUpperCase()}</Text>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default NewsFeedTile;

NewsFeedTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    height: (width - 30) / 2.2,
    margin: 5,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  flexContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparentBlackLight,
  },
  titleContainer: {
    maxWidth: width / 1.8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    shadowColor: colors.black,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
  },
});
