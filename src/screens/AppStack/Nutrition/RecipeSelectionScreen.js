import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { db } from '../../../../config/firebase';
import CustomButton from '../../../components/CustomButton';
import colors from '../../../styles/colors';

export default class RecipeSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
    };
  }
  componentWillMount = async () => {
    await this.fetchRecipes();
  }
  fetchRecipes = () => {
    const meal = this.props.navigation.getParam('meal', null);
    db.collection('recipes')
      .where('meal', '==', meal)
      .get()
      .then((querySnapshot) => {
        const recipes = [];
        querySnapshot.forEach((doc) => {
          recipes.push(doc.data());
        });
        this.setState({ recipes });
      });
  }
  render() {
    const { recipes } = this.state;
    const recipeList = recipes.map((recipe) => (
      <CustomButton
        key={recipe.name}
        primary
        title={recipe.displayName}
        onPress={() => this.props.navigation.navigate('Recipe', { recipeName: recipe.name })}
      />
    ));
    return (
      <View style={styles.container}>
        <Text>
          Recipe Selection Screen
        </Text>
        {recipeList}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
