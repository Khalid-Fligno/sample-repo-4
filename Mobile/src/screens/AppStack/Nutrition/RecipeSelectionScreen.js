import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Alert,
  FlatList,
  Text,
} from "react-native";
import * as FileSystem from "expo-file-system";
import sortBy from "lodash.sortby";
import { db } from "../../../../config/firebase";
import RecipeTile from "../../../components/Nutrition/RecipeTile";
import RecipeTileSkeleton from "../../../components/Nutrition/RecipeTileSkeleton";
import colors from "../../../styles/colors";
import fonts from '../../../styles/fonts';
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "../../../components/Shared/Icon";
import globalStyle from "../../../styles/globalStyles";
import BigHeadingWithBackButton from "../../../components/Shared/BigHeadingWithBackButton";
import CustomButtonGroup from "../../../components/Shared/CustomButtonGroup";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

export default class RecipeSelectionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      loading: false,
      filterIndex: 0,
      meal: null,
      title: null,
    };
    //console.log(this.state.recipes);
  }

  onFocusFunction = async () => {
    const { meal } = this.state;
    const newMeal = this.props.navigation.getParam("meal", null);
    // if(meal && meal !== newMeal || !meal){
    this.setState({ meal: newMeal });
    await this.fetchRecipes();
    // }
  };

  componentDidMount = async () => {
    // this.setState({ loading: true });
    // this.focusListener = this.props.navigation.addListener('willFocus', async () => {
    //     this.onFocusFunction()
    // })
    await this.fetchRecipes();
  };

  componentWillUnmount = async () => {
    // this.focusListener.remove()
    if (this.unsubscribe) await this.unsubscribe();
  };

  fetchRecipes = async () => {
    this.setState({ loading: true });
    const meal = this.props.navigation.getParam("meal", null);
    const challengeMealsFilterList = this.props.navigation.getParam(
      "challengeMealsFilterList",
      null
    );
    this.unsubscribe = await db
      .collection("recipes")
      .where(meal, "==", true)
      .onSnapshot(async (querySnapshot) => {
        const recipes = [];
        await querySnapshot.forEach(async (doc) => {
          // console.log(doc.data().title)
          if (doc.data().active) {
            if (challengeMealsFilterList && challengeMealsFilterList.length > 0) {
              if (challengeMealsFilterList.includes(doc.data().id))
                await recipes.push(await doc.data());
            } else {
              await recipes.push(await doc.data());
            }
          }
        });

        Promise.all(
          recipes.map(async (recipe) => {
            const fileUri = `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`;
            await FileSystem.getInfoAsync(fileUri)
              .then(async ({ exists }) => {
                if (!exists) {
                  await FileSystem.downloadAsync(
                    recipe.coverImage,
                    `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`
                  );
                }
              })
              .catch((reason) => {
                this.setState({ loading: false });
                Alert.alert("Error", `Error: ${reason}`);
              });
          })
        );
        // OLD CODE - DOWNLOADING ALL IMAGES EVERY TIME
        // await Promise.all(recipes.map(async (recipe) => {
        //   await FileSystem.downloadAsync(
        //     recipe.coverImage,
        //     `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`,
        //   );
        // }));

        // console.log(recipes.sort((a, b) => {
        //   if (a.order === b.order)
        //     return 0;
        //   else if (a.order === 0)  
        //     return 1;
        //   else if (b.order === 0) 
        //     return -1;
        //   else                  
        //     return 1
        // }));

        // this.setState({ recipes: sortBy(recipes, "order"), loading: false });
        this.setState({
          recipes: recipes.sort((a, b) => {
            if (a.order === b.order)
              return 0;
            else if (a.order === 0)
              return 1;
            else if (b.order === 0)
              return -1;
            else
              return 1
          }), loading: false
        });
      });
  };

  updateFilter = (filterIndex) => {
    this.setState({ filterIndex });
  };


  
  keyExtractor = (item, index) => String(index);

  renderItem = ({ item }) => (
    <RecipeTile
      onPress={() =>
        this.props.navigation.push("Recipe", {
          recipe: item,
          title: this.props.navigation.getParam("title", null),
        })
      }
      // image={
      //   `${FileSystem.cacheDirectory}recipe-${item.id}.jpg` || item.coverImage
      // }
      image={item.coverImage}
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
  };

  render() {
    const title = this.props.navigation.getParam("title", null);
    const { recipes, loading, filterIndex } = this.state;
    const filterButtons = [
      {
        id: '1',
        data: ["All", "Vegetarian", "Vegan", "Gluten-Free", "Level 1", "Level 2", "Phase 1", "Phase 2", "Phase 3"]
      }
    ]

    // console.log("RecipeList: ", recipes)
    console.log(loading)
  const renderItem1 = ({ item: items }) =>
    (
      <CustomButtonGroup
        onPress={this.updateFilter}
        selectedIndex={filterIndex}
        buttons={filterButtons[0].data}
      />
    );

    const recipeList = sortBy(recipes, "newBadge").filter((recipe) => {
      // console.log(recipe.title)
      if (recipe.tags === undefined) return recipes;
      if (filterIndex === 1) {
        return recipe.tags.includes("V");
      } else if (filterIndex === 2) {
        return recipe.tags.includes("V+");
      }
      if (filterIndex === 3) {
        return recipe.tags.includes("GF");
      }
      if (filterIndex === 4) {
        return recipe.tags.includes("L1");
      } else if (filterIndex === 5) {
        return recipe.tags.includes("L2");
      }
      if (filterIndex === 6) {
        return recipe.tags.includes("P1");
      } else if (filterIndex === 7) {
        return recipe.tags.includes("P2");
      } else if (filterIndex === 8) {
        return recipe.tags.includes("P3");
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

    console.log('recipeList: ', recipeList)
    return (
      <View style={globalStyle.container}>
        <BigHeadingWithBackButton
          isBackButton={true}
          bigTitleText={title}
          onPress={this.handleBack}
          backButtonText="Back to nutrition"
          isBigTitle={true}
          isBackButton={true}
          customContainerStyle={{ marginTop: 10, marginBottom: hp("2.5%") }}
        />
        <View
          style={{
            marginTop: 5,
            marginBottom: -20,
          }}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", justifyContent: 'flex-end', }}
            activeOpacity={1}
          >
            <Text style={styles.rLabel}>Scroll for more </Text>
            <Icon name="chevron-right" size={8} style={styles.icon} />
            <Icon name="chevron-right" size={8} style={styles.icon2} />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterButtons}
          keyExtractor={(item) => item.id}
          renderItem={(item) => renderItem1(item)}
          style={{
            paddingVertical: wp("4%"),
          }}
        />
        
        {loading ? (
          skeleton
        ) : (
          
          // <FlatList
          //   contentContainerStyle={styles.scrollView}
          //   data={recipeList}
          //   keyExtractor={this.keyExtractor}
          //   renderItem={this.renderItem}
          //   showsVerticalScrollIndicator={false}
          //   removeClippedSubviews={false}
          // // maxToRenderPerBatch={20}
          // />
          <View></View>
          
        )}
       

        {recipeList.length > 0 ?
           <FlatList
             contentContainerStyle={styles.scrollView}
             data={recipeList}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}
              // maxToRenderPerBatch={20}
            />
        
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
                      fontSize: 20,
                      fontFamily: fonts.bold,
                      textTransform: 'uppercase',
                  }}
              >
                  no recipes are available
              </Text>
          </View>

        }

        {/* <Loader
          loading={loading}
          color={colors.violet.standard}
        /> */}
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
  rLabel: {
    fontFamily: fonts.GothamMedium,
    fontSize: 8,
    color: colors.grey.dark,
  },
  icon: {
    marginTop: 2,
  },
  icon2: {
    marginTop: 2,
  },
});