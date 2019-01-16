import React from 'react';
import { StyleSheet, View, Dimensions, Alert, FlatList } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
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
            .then(async ({ exists }) => {
              if (!exists) {
                await FileSystem.downloadAsync(
                  recipe.coverImage,
                  `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`,
                );
              }
            }).catch(() => {
              this.setState({ loading: false });
              Alert.alert('Image download error');
            });
        }));
        // OLD CODE - DOWNLOADING ALL IMAGES EVERY TIME
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
  keyExtractor = (item) => item.id;
  renderItem = ({ item }) => (
    <RecipeTile
      onPress={() => this.props.navigation.push('Recipe', { recipe: item })}
      image={`${FileSystem.cacheDirectory}recipe-${item.id}.jpg` || item.coverImage}
      title={item.title}
      tags={item.tags}
      subTitle={item.subtitle}
      time={item.time}
    />
  );
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
      });
    const skeleton = (
      <View>
        <RecipeTileSkeleton />
        <RecipeTileSkeleton />
        <RecipeTileSkeleton />
      </View>
    );
    return (
      <View style={styles.container}>
        {
          loading ? skeleton : (
            <FlatList
              contentContainerStyle={styles.scrollView}
              data={recipeList}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
            />
          )
        }
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
});
