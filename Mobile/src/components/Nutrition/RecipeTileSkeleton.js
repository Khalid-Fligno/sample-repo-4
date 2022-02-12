import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Card } from "react-native-elements";
import { IMAGE } from "../../library/images";
import colors from "../../styles/colors";

const { width } = Dimensions.get("window");

const RecipeTileSkeleton = () => {
  return (
    <View style={styles.cardContainer}>
      <Card image={IMAGE.RECIPE_TILE_SKELETON} containerStyle={styles.card}>
        <View style={styles.skeletonTextContainer}>
          <View style={styles.skeletonTags} />
        </View>
      </Card>
    </View>
  );
};

export default RecipeTileSkeleton;

const styles = StyleSheet.create({
  cardContainer: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  card: {
    width: width - 40,
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 0,
  },
  skeletonTextContainer: {
    backgroundColor: colors.white,
  },
  skeletonTitle: {
    height: 16,
    width: width - 40,
    backgroundColor: colors.grey.light,
    marginBottom: 4,
    borderRadius: 2,
  },
  skeletonSubtitle: {
    height: 11,
    width: width - 40,
    backgroundColor: colors.grey.light,
    marginBottom: 4,
    borderRadius: 2,
  },
  skeletonTags: {
    height: 28,
    backgroundColor: colors.grey.light,
    borderRadius: 2,
  },
});
