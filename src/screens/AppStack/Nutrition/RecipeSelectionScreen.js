import React from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions } from 'react-native';
import { db } from '../../../../config/firebase';
import RecipeTile from '../../../components/RecipeTile';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

const mealNameMap = {
  breakfast: 'BREAKFAST',
  lunch: 'LUNCH',
  dinner: 'DINNER',
  snack: 'SNACK',
};

export default class RecipeSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      loading: false,
    };
  }
  componentDidMount = () => {
    this.fetchRecipes();
  }
  fetchRecipes = () => {
    this.setState({ loading: true });
    const meal = this.props.navigation.getParam('meal', null);
    db.collection('recipes')
      .where('meal', '==', meal)
      .get()
      .then((querySnapshot) => {
        const recipes = [];
        querySnapshot.forEach((doc) => {
          recipes.push(doc.data());
        });
        this.setState({ recipes, loading: false });
      });
  }
  render() {
    const meal = this.props.navigation.getParam('meal', null);
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
        image={recipe.id}
        title={recipe.title}
        subTitle={recipe.subTitle}
        onPress={() => this.props.navigation.navigate('Recipe', { recipeName: recipe.id })}
      />
    ));
    return (
      <View style={styles.container}>
        <View
          style={styles.headingContainer}
        >
          <Text
            style={styles.heading}
          >
            {mealNameMap[meal]}
          </Text>
        </View>
        <ScrollView>
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
    paddingTop: 15,
  },
  headingContainer: {
    width,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 2,
    backgroundColor: colors.offWhite,
    borderTopWidth: 4,
    borderTopColor: colors.violet.dark,
    borderBottomWidth: 4,
    borderBottomColor: colors.violet.dark,
    shadowColor: colors.violet.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  heading: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.violet.dark,
  },
});
