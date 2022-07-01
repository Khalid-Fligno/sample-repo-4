import { COLLECTION_NAMES } from "../../../../collections"
import { getSpecificCollection } from "../../../../../hook/firestore/read/index";
import { useState } from "react";

export const useCounter = () => {
  const [favoriteRecipeData, setFavoriteRecipeData] = useState([])
  const [loading, setLoading] = useState(false)

  const getFavoriteRecipe = async (id) => {
    const recipeData = await getSpecificCollection(
      COLLECTION_NAMES.RECIPES,
      "favorite",
      id,
      "array-contains"
    )

    if (recipeData) {
      return recipeData.docs.map((recipe) => recipe.data());
    } else {
      return undefined;
    }
  }

  const favoriteRecipe = async (id) => {
    setLoading(true)

    try {
      const faveRecipesData = await getFavoriteRecipe(id)

      if (faveRecipesData) {
        setLoading(false)
        setFavoriteRecipeData(faveRecipesData)
      } else {
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
      console.log("Error: ", err)
    }
  }

  return {
    favoriteRecipeData,
    loading,
    favoriteRecipe
  }
}
