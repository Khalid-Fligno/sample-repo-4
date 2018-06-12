import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import colors from '../../../styles/colors';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();
import CustomButton from '../../../components/CustomButton';

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
    db.collection('recipes')
      .where('meal', '==', 'breakfast')
      .get()
      .then((querySnapshot) => {
        const recipes = []
        querySnapshot.forEach((doc) => {
          recipes.push(doc.data())
        })
        this.setState({ recipes })
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
    ))
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
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
