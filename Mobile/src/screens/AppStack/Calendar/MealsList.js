import React from "react";
import { Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import TodayMealsList from "../../../components/Calendar/TodayMealsList";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";

const MealsList = ({
  AllRecipe,
  favoriteRecipe,
  todayRecommendedRecipe,
  todayRecommendedMeal,
  goToRecipe,
  getToFilter,
}) => (
  <>
    <Text
      style={{
        fontFamily: fonts.bold,
        fontSize: wp("6.5%"),
        color: colors.charcoal.dark,
        marginVertical: wp("4%"),
        marginLeft: wp("8%"),
        textAlign: "left",
        width: "100%",
      }}
    >
      Today's Meals
    </Text>
    <TodayMealsList
      recipe={AllRecipe[0]}
      favoriteRecipe={favoriteRecipe[0]}
      todayRecommendedRecipe={todayRecommendedRecipe[0]}
      data={todayRecommendedMeal[0]}
      onPress={(res) => goToRecipe(res)}
      filterPress={(res, res1, res2, title) =>
        getToFilter(res, res1, res2, title)
      }
    />
  </>
);

export default MealsList;
