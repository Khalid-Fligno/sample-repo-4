import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { FileSystem } from 'expo';
import { db } from '../../../../config/firebase';
import RecipeTile from '../../../components/RecipeTile';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class RecipeSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      loading: false,
      filterIndex: 0,
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
  updateFilter = (filterIndex) => {
    this.setState({ filterIndex });
  }
  render() {
    const { recipes, loading, filterIndex } = this.state;
    const filterButtons = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free'];
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.violet.standard}
        />
      );
    }
    const recipeList = recipes
      .filter((recipe) => {
        if (filterIndex === 1) {
          return recipe.tags.includes('V');
        } else if (filterIndex === 2) {
          return recipe.tags.includes('V+');
        } if (filterIndex === 3) {
          return recipe.tags.includes('GF');
        }
        return recipes;
      })
      .map((recipe) => (
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
        <View style={styles.absoluteFilterButtonsContainer}>
          <ButtonGroup
            onPress={this.updateFilter}
            selectedIndex={filterIndex}
            buttons={filterButtons}
            containerStyle={styles.filterButtonsContainer}
            buttonStyle={styles.filterButton}
            textStyle={styles.filterButtonText}
            selectedButtonStyle={styles.filterButtonSelected}
            selectedTextStyle={styles.filterButtonTextSelected}
            innerBorderStyle={styles.filterButtonInnerBorder}
          />
        </View>
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
    paddingTop: 35,
    paddingBottom: 15,
  },
  absoluteFilterButtonsContainer: {
    position: 'absolute',
    top: 5,
    left: 10,
    width: width - 20,
  },
  filterButtonsContainer: {
    height: 30,
    borderColor: colors.violet.standard,
  },
  filterButton: {
    backgroundColor: colors.white,
    borderColor: colors.violet.standard,
  },
  filterButtonText: {
    fontFamily: fonts.standard,
    fontSize: 11,
    color: colors.violet.standard,
    marginTop: 2,
  },
  filterButtonSelected: {
    backgroundColor: colors.violet.standard,
    borderColor: colors.violet.standard,
  },
  filterButtonTextSelected: {
    fontFamily: fonts.standard,
    fontSize: 11,
    color: colors.white,
    marginTop: 2,
  },
  filterButtonInnerBorder: {
    color: colors.violet.standard,
  },
});
