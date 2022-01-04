import React from 'react';
import {
  StyleSheet,
  View,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import sortBy from 'lodash.sortby';
import { db } from '../../../../config/firebase';
import RecipeTile from '../../../components/Nutrition/RecipeTile';
import RecipeTileSkeleton from '../../../components/Nutrition/RecipeTileSkeleton';
import globalStyle from '../../../styles/globalStyles';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import CustomButtonGroup from '../../../components/Shared/CustomButtonGroup';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import fonts from '../../../styles/fonts';

export default class RecipeSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      loading: false,
      filterIndex: 0,
      meal: null
    };
  }

  onFocusFunction = async () => {
    const { meal } = this.state
    const newMeal = this.props.navigation.getParam('meal', null);
    this.setState({ meal: newMeal })
    await this.fetchRecipes();
    // }

  }

  componentDidMount = async () => {
    await this.fetchRecipes();
  }

  componentWillUnmount = async () => {
    // this.focusListener.remove()
    if (this.unsubscribe)
      await this.unsubscribe();
  }

  fetchRecipes = async () => {
    this.setState({ loading: true });
    const meal = this.props.navigation.getParam('meal', null);
    const challengeMealsFilterList = this.props.navigation.getParam('challengeMealsFilterList', null);
    this.unsubscribe = await db.collection('recipes')
      .where(meal, '==', true)
      .onSnapshot(async (querySnapshot) => {
        const recipes = [];
        await querySnapshot.forEach(async (doc) => {
          if (challengeMealsFilterList && challengeMealsFilterList.length > 0) {
            if (challengeMealsFilterList.includes(doc.data().id))
              await recipes.push(await doc.data());
          } else {
            await recipes.push(await doc.data());
          }

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
              Alert.alert('', 'Image download error');
            });
        }));
        this.setState({ recipes: sortBy(recipes, 'title'), loading: false });
      });
  }

  updateFilter = (filterIndex) => {
    this.setState({ filterIndex });
  }

  keyExtractor = (item, index) => String(index);

  renderItem = ({ item }) => (
    <RecipeTile
      onPress={() => this.props.navigation.push('Recipe',
        {
          recipe: item,
          backTitle: this.props.navigation.getParam('meal', null)
        })}
      image={`${FileSystem.cacheDirectory}recipe-${item.id}.jpg` || item.coverImage}
      title={item.title.toUpperCase()}
      tags={item.tags}
      subTitle={item.subtitle}
      time={item.time}
      newBadge={item.newBadge}
    />
  );

  handleBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  render() {
    const meal = this.props.navigation.getParam('meal', null);
    const { recipes, loading, filterIndex } = this.state;
    const filterButtons = ['All', 'V', 'V+', 'GF', 'GH', 'DF'];

    const recipeList = sortBy(recipes, 'newBadge')
      .filter((recipe) => {
        // console.log(recipe.title)
        if (recipe.tags === undefined) return recipes
        if (filterIndex === 1) {
          return recipe.tags.includes('V');
        } else if (filterIndex === 2) {
          return recipe.tags.includes('V+');
        } if (filterIndex === 3) {
          return recipe.tags.includes('GF');
        } if (filterIndex === 4) {
          return recipe.tags.includes('GH');
        } if (filterIndex === 5) {
          return recipe.tags.includes('DF');
        }

        return recipes;
      });

    const skeleton = (
      <View style={styles.recipeTileSkeletonContainer}>
        <RecipeTileSkeleton />
        <RecipeTileSkeleton />
        <RecipeTileSkeleton />
      </View>
    );
    return (
      <View style={globalStyle.container}>
        <BigHeadingWithBackButton isBackButton={true}
          bigTitleText={meal}
          onPress={this.handleBack}
          backButtonText="Back to nutrition"
          isBigTitle={true}
          isBackButton={true}
          customContainerStyle={{ marginTop: 10, marginBottom: hp('2.5%') }}
        />
        <CustomButtonGroup
          onPress={this.updateFilter}
          selectedIndex={filterIndex}
          buttons={filterButtons}
        />
        {
          loading ?
            skeleton
            :
            recipeList.length > 0 ?
              (
                <FlatList
                  contentContainerStyle={styles.scrollView}
                  data={recipeList}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderItem}
                  showsVerticalScrollIndicator={false}
                  removeClippedSubviews={false}
                  maxToRenderPerBatch={20}
                />
              )
              :
              <View
                style={{
                  height: hp('65%'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 15,
                    fontFamily: fonts.bold,
                    textTransform: 'uppercase',
                  }}
                >
                  no recipes are available
                </Text>
              </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 15,
  },
  recipeTileSkeletonContainer: {
    // paddingTop: 35,
  },

});
