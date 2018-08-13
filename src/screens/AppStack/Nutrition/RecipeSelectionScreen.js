import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { FileSystem } from 'expo';
import { db } from '../../../../config/firebase';
import RecipeTile from '../../../components/RecipeTile';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

export default class RecipeSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      loading: false,
    };
  }
  componentDidMount = async () => {
    await this.fetchRecipes();
  }
  componentWillUnmount = async () => {
    await this.unsubscribe();
  }
  fetchRecipes = async () => {
    this.setState({ loading: true });
    const meal = this.props.navigation.getParam('meal', null);
    this.unsubscribe = await db.collection('recipes')
      .where(meal, '==', true)
      .onSnapshot(async (querySnapshot) => {
        const recipes = [];
        await querySnapshot.forEach(async (doc) => {
          await recipes.push(await doc.data());
        });
        await Promise.all(recipes.map(async (recipe) => {
          await FileSystem.downloadAsync(
            recipe.coverImage,
            `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`,
          );
        }));
        this.setState({ recipes, loading: false });
      });
  }
  render() {
    // const meal = this.props.navigation.getParam('meal', null);
    const { recipes, loading } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.violet.standard}
        />
      );
    }
    const recipeList = recipes.map((recipe) => (
      <RecipeTile
        key={recipe.id}
        image={`${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`}
        title={recipe.title}
        tags={recipe.tags}
        subTitle={recipe.subtitle}
        onPress={() => this.props.navigation.push('Recipe', { recipe })}
      />
    ));
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {recipeList}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.violet.dark,
  },
  scrollView: {
    paddingBottom: 15,
  },
});
