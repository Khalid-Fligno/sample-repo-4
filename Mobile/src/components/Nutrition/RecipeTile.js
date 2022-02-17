import React from "react";
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Animated,
} from "react-native";
import { Card } from "react-native-elements";
import PropTypes from "prop-types";
import NewRecipeBadge from "./NewRecipeBadge";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import Tag from "./Tag";
import TimeSvg from "../../../assets/icons/time";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { sortBy } from "lodash";

const { width } = Dimensions.get("window");

const RecipeTile = (props) => {
  const { onPress, title, image, tags, time, newBadge } = props;
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

  const tagsV = sortBy(tags).filter((tag) => {
    if (tag === "V") {
      return tag;
    } else if (tag === "V+") {
      return tag;
    }
    if (tag === "GF") {
      return tag;
    }
    if (tag === "GH") {
      return tag;
    }
    if (tag === "DF") {
      return tag;
    }
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.cardContainer}
      delayPressIn={60}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.flexContainer, animatedStyle]}>
        <Card image={{ uri: image }} containerStyle={styles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: -10,
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <View style={styles.recipeInfoContainer}>
                <View style={styles.recipeInfoSection}>
                  {tagsV &&
                    tagsV.map((tagV, index) => <Tag tag={tagV} key={index} />)}
                </View>
                <View style={styles.recipeInfoSection}>
                  {time !== "" && (
                    <View style={styles.timerContainer}>
                      <Text style={styles.timerText}>{time}</Text>
                      <TimeSvg width="22" height="22" />
                    </View>
                  )}
                </View>
              </View>
              <View style={[styles.titleRow]}>
                <Text style={styles.title}>
                  {title} {newBadge && <NewRecipeBadge />}
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default RecipeTile;

RecipeTile.propTypes = {
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  time: PropTypes.string.isRequired,
  newBadge: PropTypes.bool,
};

RecipeTile.defaultProps = {
  tags: null,
  newBadge: false,
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  flexContainer: {
    flex: 1,
  },
  card: {
    width: width - 50,
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 0,
    elevation: 0,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "200%",
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: hp("1.6%"),
    lineHeight: 18,
  },
  subTitle: {
    fontFamily: fonts.standardItalic,
    fontSize: 12,
  },
  recipeInfoContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  recipeInfoSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  timerText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.grey.dark,
    marginLeft: 4,
    alignSelf: "center",
    marginRight: 5,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
