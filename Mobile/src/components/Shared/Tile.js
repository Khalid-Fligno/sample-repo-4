import React from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import PropTypes from "prop-types";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";

const { width } = Dimensions.get("window");
var tileHeight = 200;

const Tile = (props) => {
  const {
    onPress,
    title1,
    image,
    disabled,
    showTitle,
    overlayTitle,
    height,
    customContainerStyle,
    showTitleStyle,
    overlayTitleStyle,
    imageUrl,
  } = props;

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
      disabled={disabled}
      onPress={onPress}
      style={[styles.cardContainer, customContainerStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.flexContainer, animatedStyle]}>
        <ImageBackground
          source={imageUrl ? { uri: imageUrl, cache: "force-cache" } : image}
          style={styles.image}
        >
          {overlayTitle && (
            <View style={styles.opacityLayer}>
              <Text style={[styles.title, overlayTitleStyle]}>
                {title1.toUpperCase()}
              </Text>
            </View>
          )}
        </ImageBackground>
      </Animated.View>
      <View>
        {showTitle && (
          <Text style={[styles.title, showTitleStyle]}>{title1}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Tile;

Tile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title1: PropTypes.string.isRequired,
  image: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  height: PropTypes.number,
  customContainerStyle: PropTypes.object,
  showTitleStyle: PropTypes.object,
  overlayTitleStyle: PropTypes.object,
  imageUrl: PropTypes.string,
};

Tile.defaultProps = {
  disabled: false,
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 0.25,
    margin: 5,
    marginTop: 0,
    height: tileHeight,
  },
  flexContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    overflow: "hidden",
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparentBlackLightest,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.black,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
    textTransform: "capitalize",
  },
});
