import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Text } from 'react-native';
import { ButtonGroup, Card } from 'react-native-elements';
import { FileSystem } from 'expo';
import { db } from '../../../../config/firebase';
import RecipeTile from '../../../components/Nutrition/RecipeTile';
import RecipeTileSkeleton from '../../../components/Nutrition/RecipeTileSkeleton';
import Loader from '../../../components/Shared/Loader';
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
          const fileUri = `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`;
          await FileSystem.getInfoAsync(fileUri)
            .then(async ({ exists, uri }) => {
              if (exists) {
                await this.loadCacheImage(uri);
              } else {
                await FileSystem.downloadAsync(
                  recipe.coverImage,
                  `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`,
                );
              }
            }).catch((err) => {
              console.log(err);
            });
        }));
        // await Promise.all(recipes.map(async (recipe) => {
        //   await FileSystem.downloadAsync(
        //     recipe.coverImage,
        //     `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`,
        //   );
        // }));
        this.setState({ recipes, loading: false });
      });
  }
  updateFilter = (filterIndex) => {
    this.setState({ filterIndex });
  }
  render() {
    const { recipes, loading, filterIndex } = this.state;
    const filterButtons = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free'];
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
          // image={recipe.coverImage}
          image={`${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg` || { uri: recipe.coverImage }}
          title={recipe.title}
          tags={recipe.tags}
          subTitle={recipe.subtitle}
          onPress={() => this.props.navigation.push('Recipe', { recipe })}
        />
      ));
    const skeleton = (
      <View>
        <RecipeTileSkeleton />
        <RecipeTileSkeleton />
        <RecipeTileSkeleton />
      </View>
    );
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {loading ? skeleton : recipeList}
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
            innerBorderStyle={{ color: colors.violet.standard }}
          />
        </View>
        <Loader
          loading={loading}
          color={colors.violet.standard}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
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
    shadowColor: colors.grey.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
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

  cardContainer: {
    margin: 0,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  card: {
    width: width - 20,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  subTitle: {
    fontFamily: fonts.standard,
    fontSize: 12,
  },
  tagContainer: {
    flexDirection: 'row',
  },
  tagCircle: {
    height: 28,
    width: 28,
    marginTop: 3,
    marginRight: 5,
    borderWidth: 2.5,
    borderColor: colors.violet.standard,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.violet.standard,
    marginTop: 4,
  },
});
