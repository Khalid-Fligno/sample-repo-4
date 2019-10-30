import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import NutritionHomeScreen from '../../src/screens/AppStack/Nutrition/NutritionHomeScreen';
import RecipeSelectionScreen from '../../src/screens/AppStack/Nutrition/RecipeSelectionScreen';
import RecipeScreen from '../../src/screens/AppStack/Nutrition/RecipeScreen';
import RecipeStepsScreen from '../../src/screens/AppStack/Nutrition/RecipeStepsScreen';
import Header from '../../src/components/Shared/Header';
import {
  nutritionBackButtonMap,
  findNutritionHeaderTitle,
  mealNameMap,
  fadeSpec,
  fade,
} from './utils';


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
            withStartButton={routeName === 'Recipe'}
            withProfileButton={routeName === 'NutritionHome'}
            stack="nutrition"
            headerTitleParams={routeName === 'RecipeSelection' ? mealNameMap[navigation.getParam('meal', null)] : findNutritionHeaderTitle(routeName)}
          />
        );
      },
    }),
  },
);

export default NutritionStack;
