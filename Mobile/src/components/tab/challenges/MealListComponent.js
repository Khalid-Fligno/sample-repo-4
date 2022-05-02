import React from "react";
import { Alert, Text } from "react-native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { TodayMealsList } from "../../Calendar/TodayMealsList";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import * as FileSystem from "expo-file-system";

export const MealListComponent = (props) => {
  const {
    AllRecipe,
    favoriteRecipe,
    todayRecommendedRecipe,
    todayRecommendedMeal,
    setLoading,
    navigation,
    showRC,
    activeChallengeUserData,
    phaseDefaultTags,
    challengeRecipe,
    activeChallengeData,
    currentChallengeDay
  } = props

  const handleBack = () => {
    navigation.pop();
  };

  const goToRecipe = async (recipeData) => {
    setLoading(true)
    const fileUri = `${FileSystem.cacheDirectory}recipe-${recipeData.id}.jpg`;
    await FileSystem.getInfoAsync(fileUri)
      .then(async ({ exists }) => {
        if (!exists) {
          await FileSystem.downloadAsync(
            recipeData.coverImage,
            `${FileSystem.cacheDirectory}recipe-${recipeData.id}.jpg`
          );
          setLoading(false)
        } else {
          setLoading(false)
        }
      })
      .catch(() => {
        setLoading(false)
        Alert.alert("", "Image download error");
      });
    navigation.navigate("Recipe", {
      recipe: recipeData,
      title: "challenge",
      extraProps: { fromCalender: true },
    });
  }

  const getToFilter = (data, data1, data2, title) => {
    const datas = activeChallengeUserData.faveRecipe;

    if (datas === undefined) {
      Alert.alert("New Feature", "Favourite Recipe feature is now available.", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const number = 60;
            const currentNumber = [];

            for (let i = 1; i <= number; i++) {
              const data = {
                day: i,
                recipeMeal: {
                  breakfast: "",
                  lunch: "",
                  dinner: "",
                  snack: "",
                  drink: "",
                  preworkout: "",
                  treats: "",
                },
              };
              currentNumber.push(data);
            }

            const id = activeChallengeUserData.id;
            const uid = await AsyncStorage.getItem("uid");
            const activeChallengeUserRef = db
              .collection("users")
              .doc(uid)
              .collection("challenges")
              .doc(id);

            activeChallengeUserRef.set(
              { faveRecipe: currentNumber },
              { merge: true }
            );

            handleBack();
          },
        },
      ]);
    }

    navigation.navigate("FilterRecipe", {
      currentChallengeDay: currentChallengeDay,
      activeChallengeUserData: activeChallengeUserData,
      phaseDefaultTags: phaseDefaultTags,
      defaultLevelTags: activeChallengeData.levelTags,
      todayRecommendedRecipe: data2,
      challengeAllRecipe: challengeRecipe[0],
      recipes: data,
      title: title,
      allRecipeData: data1,
    });
  }

  return showRC && (
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
      {AllRecipe && (
        <TodayMealsList
          recipe={AllRecipe}
          favoriteRecipe={favoriteRecipe}
          todayRecommendedRecipe={todayRecommendedRecipe}
          data={todayRecommendedMeal}
          onPress={(res) => goToRecipe(res)}
          filterPress={(res, res1, res2, title) =>
            getToFilter(res, res1, res2, title)
          }
        />
      )}
    </>
  );
}