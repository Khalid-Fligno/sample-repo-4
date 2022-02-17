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

const DoubleNewsFeedTile = (props) => {
  const {
    imageLeft,
    imageRight,
    titleLeft1,
    titleLeft2,
    titleRight1,
    titleRight2,
    onPressLeft,
    onPressRight,
  } = props;
  const animatedValueLeft = new Animated.Value(1);
  const animatedValueRight = new Animated.Value(1);

  const animatedStyleLeft = {
    transform: [{ scale: animatedValueLeft }],
  };
  const animatedStyleRight = {
    transform: [{ scale: animatedValueRight }],
  };
  const handlePressIn = () => {
    Animated.spring(animatedValueLeft, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(animatedValueLeft, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  const handlePressInRight = () => {
    Animated.spring(animatedValueRight, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOutRight = () => {
    Animated.spring(animatedValueRight, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.doubleTileContainer}>
      <TouchableOpacity
        delayPressIn={50}
        onPress={onPressLeft}
        style={styles.cardContainer}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.flexContainer, animatedStyleLeft]}>
          <ImageBackground
            resizeMode="cover"
            source={imageLeft}
            style={styles.image}
          >
            <View style={styles.opacityLayer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{titleLeft1}</Text>
                {titleLeft2 && <Text style={styles.title}>{titleLeft2}</Text>}
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        delayPressIn={60}
        onPress={onPressRight}
        style={styles.cardContainer}
        onPressIn={handlePressInRight}
        onPressOut={handlePressOutRight}
      >
        <Animated.View style={[styles.flexContainer, animatedStyleRight]}>
          <ImageBackground
            resizeMode="cover"
            source={imageRight}
            style={styles.image}
          >
            <View style={styles.opacityLayer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{titleRight1}</Text>
                {titleRight2 && <Text style={styles.title}>{titleRight2}</Text>}
              </View>
            </View>
          </ImageBackground>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default DoubleNewsFeedTile;

DoubleNewsFeedTile.propTypes = {
  imageLeft: PropTypes.number.isRequired,
  imageRight: PropTypes.number.isRequired,
  titleLeft1: PropTypes.string.isRequired,
  titleLeft2: PropTypes.string,
  titleRight1: PropTypes.string.isRequired,
  titleRight2: PropTypes.string,
  onPressLeft: PropTypes.func.isRequired,
  onPressRight: PropTypes.func.isRequired,
};

DoubleNewsFeedTile.defaultProps = {
  titleLeft2: null,
  titleRight2: null,
};

const styles = StyleSheet.create({
  doubleTileContainer: {
    flex: 1,
    height: (width - 30) / 2,
    flexDirection: "row",
  },
  cardContainer: {
    flex: 1,
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
    borderRadius: 1,
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparentBlackLight,
  },
  titleContainer: {
    maxWidth: width / 2.4,
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
