// export const MealListComponent = (showRC) => {

//   return showRC && (
//     <>
//       <Text
//         style={{
//           fontFamily: fonts.bold,
//           fontSize: wp("6.5%"),
//           color: colors.charcoal.dark,
//           marginVertical: wp("4%"),
//           marginLeft: wp("8%"),
//           textAlign: "left",
//           width: "100%",
//         }}
//       >
//         Today's Meals
//       </Text>
//       {AllRecipe[0] && (
//         <TodayMealsList
//           recipe={AllRecipe[0]}
//           favoriteRecipe={favoriteRecipe[0]}
//           todayRecommendedRecipe={todayRecommendedRecipe[0]}
//           data={todayRecommendedMeal[0]}
//           onPress={(res) => this.goToRecipe(res)}
//           filterPress={(res, res1, res2, title) =>
//             this.getToFilter(res, res1, res2, title)
//           }
//         />
//       )}
//     </>
//   );
// }