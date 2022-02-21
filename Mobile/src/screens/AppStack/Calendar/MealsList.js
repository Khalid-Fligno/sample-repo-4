import React from "react";
import TodayMealsList from "../../../components/Calendar/TodayMealsList";

const MealsList = ({
  showRC,
  AllRecipe,
  favoriteRecipe,
  todayRecommendedRecipe,
  todayRecommendedMeal,
  goToRecipe,
  getToFilter,
}) => {
  showRC && (
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
};

export default MealsList;
