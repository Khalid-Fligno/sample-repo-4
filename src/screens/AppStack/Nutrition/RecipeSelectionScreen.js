import React from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import sortBy from 'lodash.sortby';
import { db } from '../../../../config/firebase';
import RecipeTile from '../../../components/Nutrition/RecipeTile';
import RecipeTileSkeleton from '../../../components/Nutrition/RecipeTileSkeleton';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
// import fonts from '../../../styles/fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from '../../../components/Shared/Icon';
import globalStyle from '../../../styles/globalStyles';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import CustomButtonGroup from '../../../components/Shared/CustomButtonGroup';
import { heightPercentageToDP as hp ,widthPercentageToDP as wp} from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

export default class RecipeSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      loading: false,
      filterIndex: 0,
      meal:null
    };
  }

  onFocusFunction = async () =>{
    const {meal} = this.state
    const newMeal = this.props.navigation.getParam('meal', null);
    // if(meal && meal !== newMeal || !meal){
      this.setState({meal:newMeal})
      await this.fetchRecipes();
    // }
      
  }

  componentDidMount = async () => {
    this.setState({ loading: true });
    this.focusListener = this.props.navigation.addListener('willFocus', async () => {
        this.onFocusFunction()
    })
  }
  componentWillUnmount = async () => {
    this.focusListener.remove()
      if(this.unsubscribe)
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
          if(challengeMealsFilterList && challengeMealsFilterList.length >0){
              if(challengeMealsFilterList.includes(doc.data().id))
                await recipes.push(await doc.data());
          }else{
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
        // OLD CODE - DOWNLOADING ALL IMAGES EVERY TIME
        // await Promise.all(recipes.map(async (recipe) => {
        //   await FileSystem.downloadAsync(
        //     recipe.coverImage,
        //     `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`,
        //   );
        // }));
        this.setState({ recipes: sortBy(recipes, 'title'), loading: false });
      });
  }
  updateFilter = (filterIndex) => {
    this.setState({ filterIndex });
  }
  keyExtractor = (item) => item.id;
  renderItem = ({ item }) => (
    <RecipeTile
      onPress={() => this.props.navigation.push('Recipe', 
      {
        recipe: item,
        backTitle : this.props.navigation.getParam('meal', null)
      })}
      image={`${FileSystem.cacheDirectory}recipe-${item.id}.jpg` || item.coverImage}
      title={item.title}
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
    const filterButtons = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free'];
    
    const recipeList = sortBy(recipes, 'newBadge')
      .filter((recipe) => {
        if(recipe.tags === undefined) return recipes
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
      <View style={styles.recipeTileSkeletonContainer}>
        <RecipeTileSkeleton />
        <RecipeTileSkeleton />
        <RecipeTileSkeleton />
      </View>
    );
    return (
       <View style={globalStyle.container}>
          <BigHeadingWithBackButton isBackButton = {true} 
            bigTitleText = {meal} 
            onPress={this.handleBack} 
            backButtonText="Back to nutrition" 
            isBigTitle={true}
            isBackButton ={true}
            customContainerStyle={{marginTop:10,marginBottom:hp('2.5%')}}
          />
          <CustomButtonGroup  
            onPress={this.updateFilter}
            selectedIndex={filterIndex}
            buttons={filterButtons}
          />
        {
          loading ? skeleton : (
            <FlatList
              contentContainerStyle={styles.scrollView}
              data={recipeList}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={false}
            />
          )
        }
       
        <Loader
          loading={loading}
          color={colors.violet.standard}
        />
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
