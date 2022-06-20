import React from "react";
import { ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { View, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import fonts from "../../../styles/fonts";
import Icon from "react-native-vector-icons/AntDesign";
import { containerPadding } from "../../../styles/globalStyles";
import colors from "../../../styles/colors";

const MealCarousel = ({
  data,
  data1,
  data2,
  title,
  favoriteRecipe,
  onPress,
  filterPress,
  favouriteRecipeConfigs
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: containerPadding,
        }}
      >
        <Text style={styles.label}>{title}</Text>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: containerPadding,
          paddingVertical: wp("3%"),
        }}
      >
        {data.map((recipe, index) => (
          <TouchableOpacity
            key={index}
            style={styles.cardContainer}
            onPress={() => onPress(recipe)}
          >
            <ImageBackground
              source={{ uri: recipe.coverImage, cache: "force-cache" }}
              style={styles.image}
              resizeMode="cover"
            >
              <View style={styles.opacityLayer}>
                <Text style={styles.cardTitle}>{recipe.title}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
        {favoriteRecipe === undefined
          ? null
          : favoriteRecipe.map((recipe, index) => (
              <TouchableOpacity
                key={index}
                style={styles.cardContainer}
                onPress={() => onPress(recipe)}
              >
                <ImageBackground
                  source={{ uri: recipe.coverImage, cache: "force-cache" }}
                  style={styles.image}
                  resizeMode="cover">
                  <View style={styles.opacityLayer}>
                    {recipe.drink && (
                      <Text style={styles.watermarkTitle}>post{'\n'}workout</Text>
                    )}
                    <Text style={styles.cardTitle}>{recipe.title}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
        <TouchableOpacity
          style={styles.cardContainer1}
          onPress={() => filterPress(data, data1, data2, title, favouriteRecipeConfigs)}
        >
          <View style={styles.opacityLayer1}>
            <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
            <Text style={styles.cardTitle1}>Choose a recipe</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default MealCarousel;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
  },
  footerComponet: {
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: wp("4%"),
    color: colors.black,
  },
  rLabel: {
    fontFamily: fonts.GothamMedium,
    fontSize: wp("3%"),
    color: colors.grey.dark,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.grey.light,
    borderRadius: 10,
  },
  cardContainer: {
    height: wp("33%"),
    width: wp("65%"),
    marginRight: wp("3.5%"),
  },
  cardContainer1: {
    height: wp("33%"),
    width: wp("65%"),
    marginRight: wp("3.5%"),
    borderStyle: "dashed",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderTopColor: "#000000",
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: colors.transparentBlackLightest,
    padding: wp("5%"),
  },
  opacityLayer1: {
    flexDirection: "column",
    width: "100%",
    justifyContent: "center",
    padding: 50,
    left: 15,
  },
  cardTitle: {
    fontFamily: fonts.bold,
    color: colors.offWhite,
    shadowColor: colors.grey.dark,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    width: "80%",
    fontSize: wp("3.5%"),
    textTransform: "capitalize",
  },
  cardTitle1: {
    fontFamily: fonts.bold,
    color: colors.black,
    width: "90%",
    fontSize: wp("3.5%"),
  },
  watermarkTitle: {
    color: colors.white,
    backgroundColor: colors.black,
    textTransform: 'uppercase',  
    textAlign: 'center', 
    fontFamily: fonts.SimplonMonoMedium,
    fontSize: 12,
    position: 'absolute',
    top: 8,
    left: -38,
    transform: [{ rotate: '-45deg'}],
    width: 120
  }
});