import React from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import MealCarousel from "./Carousels/MealCarousel";

const TodayMealsList = (props) => {
  const {
    data,
    recipe,
    todayRecommendedRecipe,
    favoriteRecipe,
    onPress,
    filterPress,
  } = props;

  if (favoriteRecipe === undefined) {
    return (
      <View style={styles.container}>
        {data.breakfast.length > 0 && (
          <MealCarousel
            data={data.breakfast}
            data1={recipe.breakfast}
            data2={todayRecommendedRecipe.breakfast}
            title={"Breakfast"}
            onPress={onPress}
            filterPress={filterPress}
          />
        )}
        {data.lunch.length > 0 && (
          <MealCarousel
            data={data.lunch}
            data1={recipe.lunch}
            data2={todayRecommendedRecipe.lunch}
            title={"Lunch"}
            onPress={onPress}
            filterPress={filterPress}
          />
        )}
        {data.dinner.length > 0 && (
          <MealCarousel
            data={data.dinner}
            data1={recipe.dinner}
            data2={todayRecommendedRecipe.dinner}
            title={"Dinner"}
            onPress={onPress}
            filterPress={filterPress}
          />
        )}
        {data.snack.length > 0 && (
          <MealCarousel
            data={data.snack}
            data1={recipe.snack}
            data2={todayRecommendedRecipe.snack}
            title={"Snack"}
            onPress={onPress}
            filterPress={filterPress}
          />
        )}
        {data.drink.length > 0 && (
          <MealCarousel
            data={data.drink}
            data1={recipe.drink}
            data2={todayRecommendedRecipe.drink}
            title={"Post Workout"}
            onPress={onPress}
            filterPress={filterPress}
          />
        )}
        {data.preworkout.length > 0 && (
          <MealCarousel
            data={data.preworkout}
            data1={recipe.preworkout}
            data2={todayRecommendedRecipe.preworkout}
            title={"Pre Workout"}
            onPress={onPress}
            filterPress={filterPress}
          />
        )}
        {data.treats.length > 0 && (
          <MealCarousel
            data={data.treats}
            data1={recipe.treats}
            data2={todayRecommendedRecipe.treats}
            title={"Treats"}
            onPress={onPress}
            filterPress={filterPress}
          />
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {data.breakfast.length > 0 && (
          <MealCarousel
            data={data.breakfast}
            data1={recipe.breakfast}
            data2={todayRecommendedRecipe.breakfast}
            title={"Breakfast"}
            onPress={onPress}
            filterPress={filterPress}
            favoriteRecipe={favoriteRecipe.breakfast}
          />
        )}
        {data.lunch.length > 0 && (
          <MealCarousel
            data={data.lunch}
            data1={recipe.lunch}
            data2={todayRecommendedRecipe.lunch}
            title={"Lunch"}
            onPress={onPress}
            filterPress={filterPress}
            favoriteRecipe={favoriteRecipe.lunch}
          />
        )}
        {data.dinner.length > 0 && (
          <MealCarousel
            data={data.dinner}
            data1={recipe.dinner}
            data2={todayRecommendedRecipe.dinner}
            title={"Dinner"}
            onPress={onPress}
            filterPress={filterPress}
            favoriteRecipe={favoriteRecipe.dinner}
          />
        )}
        {data.snack.length > 0 && (
          <MealCarousel
            data={data.snack}
            data1={recipe.snack}
            data2={todayRecommendedRecipe.snack}
            title={"Snack"}
            onPress={onPress}
            filterPress={filterPress}
            favoriteRecipe={favoriteRecipe.snack}
          />
        )}
        {data.drink.length > 0 && (
          <MealCarousel
            data={data.drink}
            data1={recipe.drink}
            data2={todayRecommendedRecipe.drink}
            title={"Post Workout"}
            onPress={onPress}
            filterPress={filterPress}
            favoriteRecipe={favoriteRecipe.drink}
          />
        )}
        {data.preworkout.length > 0 && (
          <MealCarousel
            data={data.preworkout}
            data1={recipe.preworkout}
            data2={todayRecommendedRecipe.preworkout}
            title={"Pre Workout"}
            onPress={onPress}
            filterPress={filterPress}
            favoriteRecipe={favoriteRecipe.preworkout}
          />
        )}
        {data.treats.length > 0 && (
          <MealCarousel
            data={data.treats}
            data1={recipe.treats}
            data2={todayRecommendedRecipe.treats}
            title={"Treats"}
            onPress={onPress}
            filterPress={filterPress}
            favoriteRecipe={favoriteRecipe.treats}
          />
        )}
      </View>
    );
  }
};

export default TodayMealsList;

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
});
