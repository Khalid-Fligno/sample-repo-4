import { convertRecipeData } from "../utils/challenges";
import { LEVEL_1_TAG, LEVEL_2_TAG, LEVEL_3_TAG } from "./constants";

export const getChallengeLevels = (documents) => {
  const level_1 = documents.filter((doc) => {
    if (doc.levelTags === LEVEL_1_TAG) {
      return doc.id;
    }
  });
  const level_2 = documents.filter((doc) => {
    if (doc.levelTags === LEVEL_2_TAG) {
      return doc.id;
    }
  });

  const level_3 = documents.filter((doc) => {
    if (doc.levelTags === LEVEL_3_TAG) {
      return doc.id;
    }
  });

  return [
    {
      level1: level_1,
      level2: level_2,
      level3: level_3,
    },
  ];
};

export const convertRecipeDataCalendar = async (
  recipe,
  breakfastId,
  dinnerId,
  lunchId,
  snackId,
  drinkId,
  preworkoutId,
  treatsId
) => {
  const res = convertRecipeData(recipe);
  const resx = res.recipeResult;

  const breakfastList = resx.filter((res) => res.id === breakfastId[0]);
  const lunchList = resx.filter((res) => res.id === lunchId[0]);
  const dinnerList = resx.filter((res) => res.id === dinnerId[0]);
  const snackList = resx.filter((res) => res.id === snackId[0]);
  const drinkList = resx.filter((res) => res.id === drinkId[0]);
  const preworkoutList = resx.filter((res) => res.id === preworkoutId[0]);
  const treatsList = resx.filter((res) => res.id === treatsId[0]);

  const recommendedMeal = [
    {
      breakfast: breakfastList,
      lunch: lunchList,
      dinner: dinnerList,
      snack: snackList,
      drink: drinkList,
      preworkout: preworkoutList,
      treats: treatsList,
    },
  ];

  return recommendedMeal;
};
