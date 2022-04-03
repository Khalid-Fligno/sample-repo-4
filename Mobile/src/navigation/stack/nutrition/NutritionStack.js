import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import NutritionHomeScreen from '../../../screens/AppStack/Nutrition/NutritionHomeScreen';
import RecipeSelectionScreen from '../../../screens/AppStack/Nutrition/RecipeSelectionScreen';
import RecipeScreen from '../../../screens/AppStack/Nutrition/RecipeScreen';
import RecipeStepsScreen from '../../../screens/AppStack/Nutrition/RecipeStepsScreen';
import Header from '../../../components/Shared/Header';
import {
  nutritionBackButtonMap,
  fadeSpec,
  fade,
} from '../utils';


const NutritionStack = createStackNavigator(
  {
    NutritionHome: NutritionHomeScreen,
    RecipeSelection: RecipeSelectionScreen,
    Recipe: RecipeScreen,
    RecipeSteps: RecipeStepsScreen,
  },
  {
    initialRouteName: 'NutritionHome',
    transitionConfig: () => ({
      transitionSpec: fadeSpec,
      screenInterpolator: (props) => {
        return fade(props);
      },
    }),
    defaultNavigationOptions: ({ navigation }) => ({
      header: () => {
        const { routeName } = navigation.state;

        return (
          <Header
            navigation={navigation}
            withBackButton={nutritionBackButtonMap[routeName]}
            withProfileButton={true}
            stack="nutrition"
          />
        );
      },
    }),
  },
);

export default NutritionStack;
