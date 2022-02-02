import React, { Component } from "react";
import { ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView, FlatList } from "react-native";
import { View, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { containerPadding } from "../../styles/globalStyles";
// import Icon from "../Shared/Icon";
import Icon from "react-native-vector-icons/AntDesign";
class TodayMealsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  carouselBreakfast = (data, data1, data2, title, favoriteRecipe) => {

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: containerPadding,
          }}
        >
          <Text style={styles.label}>{title}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: containerPadding,
            paddingVertical: wp("3%"),
          }}
        >
          {data.map((recipe) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.props.onPress(recipe)}
            >
              <ImageBackground
                source={{ uri: recipe.coverImage, cache: "force-cache" }}
                style={styles.image}
                resizeMode="cover"
              >
                <View style={styles.opacityLayer}>
                  <Text style={styles.cardTitle}>{recipe.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {
            favoriteRecipe === undefined ?
              null
              :
              favoriteRecipe.map((recipe) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => this.props.onPress(recipe)}
                >
                  <ImageBackground
                    source={{ uri: recipe.coverImage, cache: "force-cache" }}
                    style={styles.image}
                    resizeMode="cover"
                  >
                    <View style={styles.opacityLayer}>
                      <Text style={styles.cardTitle}>{recipe.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))
          }
          <TouchableOpacity
            style={styles.cardContainer1}
            onPress={() => this.props.filterPress(data, data1, data2, title)}
          >
            <View style={styles.opacityLayer1}>
              <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
              <Text style={styles.cardTitle1}>Choose a recipe</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  carouselLunch = (data, data1, data2, title, favoriteRecipe) => {

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: containerPadding,
          }}
        >
          <Text style={styles.label}>{title}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: containerPadding,
            paddingVertical: wp("3%"),
          }}
        >
          {data.map((recipe) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.props.onPress(recipe)}
            >
              <ImageBackground
                source={{ uri: recipe.coverImage, cache: "force-cache" }}
                style={styles.image}
                resizeMode="cover"
              >
                <View style={styles.opacityLayer}>
                  <Text style={styles.cardTitle}>{recipe.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {
            favoriteRecipe === undefined ?
              null
              :
              favoriteRecipe.map((recipe) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => this.props.onPress(recipe)}
                >
                  <ImageBackground
                    source={{ uri: recipe.coverImage, cache: "force-cache" }}
                    style={styles.image}
                    resizeMode="cover"
                  >
                    <View style={styles.opacityLayer}>
                      <Text style={styles.cardTitle}>{recipe.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))
          }
          <TouchableOpacity
            style={styles.cardContainer1}
            onPress={() => this.props.filterPress(data, data1, data2, title)}
          >
            <View style={styles.opacityLayer1}>
              <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
              <Text style={styles.cardTitle1}>Choose a recipe</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  carouselDinner = (data, data1, data2, title, favoriteRecipe) => {

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: containerPadding,
          }}
        >
          <Text style={styles.label}>{title}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: containerPadding,
            paddingVertical: wp("3%"),
          }}
        >
          {data.map((recipe) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.props.onPress(recipe)}
            >
              <ImageBackground
                source={{ uri: recipe.coverImage, cache: "force-cache" }}
                style={styles.image}
                resizeMode="cover"
              >
                <View style={styles.opacityLayer}>
                  <Text style={styles.cardTitle}>{recipe.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {
            favoriteRecipe === undefined ?
              null
              :
              favoriteRecipe.map((recipe) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => this.props.onPress(recipe)}
                >
                  <ImageBackground
                    source={{ uri: recipe.coverImage, cache: "force-cache" }}
                    style={styles.image}
                    resizeMode="cover"
                  >
                    <View style={styles.opacityLayer}>
                      <Text style={styles.cardTitle}>{recipe.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))
          }
          <TouchableOpacity
            style={styles.cardContainer1}
            onPress={() => this.props.filterPress(data, data1, data2, title)}
          >
            <View style={styles.opacityLayer1}>
              <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
              <Text style={styles.cardTitle1}>Choose a recipe</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  carouselSnack = (data, data1, data2, title, favoriteRecipe) => {

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: containerPadding,
          }}
        >
          <Text style={styles.label}>{title}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: containerPadding,
            paddingVertical: wp("3%"),
          }}
        >
          {data.map((recipe) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.props.onPress(recipe)}
            >
              <ImageBackground
                source={{ uri: recipe.coverImage, cache: "force-cache" }}
                style={styles.image}
                resizeMode="cover"
              >
                <View style={styles.opacityLayer}>
                  <Text style={styles.cardTitle}>{recipe.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {
            favoriteRecipe === undefined ?
              null
              :
              favoriteRecipe.map((recipe) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => this.props.onPress(recipe)}
                >
                  <ImageBackground
                    source={{ uri: recipe.coverImage, cache: "force-cache" }}
                    style={styles.image}
                    resizeMode="cover"
                  >
                    <View style={styles.opacityLayer}>
                      <Text style={styles.cardTitle}>{recipe.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))
          }
          <TouchableOpacity
            style={styles.cardContainer1}
            onPress={() => this.props.filterPress(data, data1, data2, title)}
          >
            <View style={styles.opacityLayer1}>
              <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
              <Text style={styles.cardTitle1}>Choose a recipe</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  carouselDrink = (data, data1, data2, title, favoriteRecipe) => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: containerPadding,
          }}
        >
          <Text style={styles.label}>{title}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: containerPadding,
            paddingVertical: wp("3%"),
          }}
        >
          {data.map((recipe) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.props.onPress(recipe)}
            >
              <ImageBackground
                source={{ uri: recipe.coverImage, cache: "force-cache" }}
                style={styles.image}
                resizeMode="cover"
              >
                <View style={styles.opacityLayer}>
                  <Text style={styles.cardTitle}>{recipe.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {
            favoriteRecipe === undefined ?
              null
              :
              favoriteRecipe.map((recipe) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => this.props.onPress(recipe)}
                >
                  <ImageBackground
                    source={{ uri: recipe.coverImage, cache: "force-cache" }}
                    style={styles.image}
                    resizeMode="cover"
                  >
                    <View style={styles.opacityLayer}>
                      <Text style={styles.cardTitle}>{recipe.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))
          }
          <TouchableOpacity
            style={styles.cardContainer1}
            onPress={() => this.props.filterPress(data, data1, data2, title)}
          >
            <View style={styles.opacityLayer1}>
              <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
              <Text style={styles.cardTitle1}>Choose a recipe</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  carouselPreworkout = (data, data1, data2, title, favoriteRecipe) => {
    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: containerPadding,
          }}
        >
          <Text style={styles.label}>{title}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: containerPadding,
            paddingVertical: wp("3%"),
          }}
        >
          {data.map((recipe) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.props.onPress(recipe)}
            >
              <ImageBackground
                source={{ uri: recipe.coverImage, cache: "force-cache" }}
                style={styles.image}
                resizeMode="cover"
              >
                <View style={styles.opacityLayer}>
                  <Text style={styles.cardTitle}>{recipe.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {
            favoriteRecipe === undefined ?
              null
              :
              favoriteRecipe.map((recipe) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => this.props.onPress(recipe)}
                >
                  <ImageBackground
                    source={{ uri: recipe.coverImage, cache: "force-cache" }}
                    style={styles.image}
                    resizeMode="cover"
                  >
                    <View style={styles.opacityLayer}>
                      <Text style={styles.cardTitle}>{recipe.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))
          }
          <TouchableOpacity
            style={styles.cardContainer1}
            onPress={() => this.props.filterPress(data, data1, data2, title)}
          >
            <View style={styles.opacityLayer1}>
              <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
              <Text style={styles.cardTitle1}>Choose a recipe</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  carouselTreats = (data, data1, data2, title, favoriteRecipe) => {

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: containerPadding,
          }}
        >
          <Text style={styles.label}>{title}</Text>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingHorizontal: containerPadding,
            paddingVertical: wp("3%"),
          }}
        >
          {data.map((recipe) => (
            <TouchableOpacity
              style={styles.cardContainer}
              onPress={() => this.props.onPress(recipe)}
            >
              <ImageBackground
                source={{ uri: recipe.coverImage, cache: "force-cache" }}
                style={styles.image}
                resizeMode="cover"
              >
                <View style={styles.opacityLayer}>
                  <Text style={styles.cardTitle}>{recipe.title}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
          {
            favoriteRecipe === undefined ?
              null
              :
              favoriteRecipe.map((recipe) => (
                <TouchableOpacity
                  style={styles.cardContainer}
                  onPress={() => this.props.onPress(recipe)}
                >
                  <ImageBackground
                    source={{ uri: recipe.coverImage, cache: "force-cache" }}
                    style={styles.image}
                    resizeMode="cover"
                  >
                    <View style={styles.opacityLayer}>
                      <Text style={styles.cardTitle}>{recipe.title}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))
          }
          <TouchableOpacity
            style={styles.cardContainer1}
            onPress={() => this.props.filterPress(data, data1, data2, title)}
          >
            <View style={styles.opacityLayer1}>
              <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
              <Text style={styles.cardTitle1}>Choose a recipe</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }

  render() {
    const { data, recipe, todayRecommendedRecipe, favoriteRecipe, title1 } = this.props

    // console.log('favoriteRecipe: ', favoriteRecipe.lunch)

    if (favoriteRecipe === undefined) {
      return (
        <View style={styles.container}>
          {data.breakfast.length > 0 && this.carouselBreakfast(data.breakfast, recipe.breakfast, todayRecommendedRecipe.breakfast, "Breakfast")}
          {data.lunch.length > 0 && this.carouselLunch(data.lunch, recipe.lunch, todayRecommendedRecipe.lunch, "Lunch")}
          {data.dinner.length > 0 && this.carouselDinner(data.dinner, recipe.dinner, todayRecommendedRecipe.dinner, "Dinner")}
          {data.snack.length > 0 && this.carouselSnack(data.snack, recipe.snack, todayRecommendedRecipe.snack, "Snack")}
          {data.drink.length > 0 && this.carouselDrink(data.drink, recipe.drink, todayRecommendedRecipe.drink, "Post Workout")}
          {data.preworkout.length > 0 && this.carouselPreworkout(data.preworkout, recipe.preworkout, todayRecommendedRecipe.preworkout, "Pre Workout")}
          {data.treats.length > 0 && this.carouselTreats(data.treats, recipe.treats, todayRecommendedRecipe.treats, "Treats")}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          {data.breakfast.length > 0 && this.carouselBreakfast(data.breakfast, recipe.breakfast, todayRecommendedRecipe.breakfast, "Breakfast", favoriteRecipe.breakfast)}
          {data.lunch.length > 0 && this.carouselLunch(data.lunch, recipe.lunch, todayRecommendedRecipe.lunch, "Lunch", favoriteRecipe.lunch)}
          {data.dinner.length > 0 && this.carouselDinner(data.dinner, recipe.dinner, todayRecommendedRecipe.dinner, "Dinner", favoriteRecipe.dinner)}
          {data.snack.length > 0 && this.carouselSnack(data.snack, recipe.snack, todayRecommendedRecipe.snack, "Snack", favoriteRecipe.snack)}
          {data.drink.length > 0 && this.carouselDrink(data.drink, recipe.drink, todayRecommendedRecipe.drink, "Post Workout", favoriteRecipe.drink)}
          {data.preworkout.length > 0 && this.carouselPreworkout(data.preworkout, recipe.preworkout, todayRecommendedRecipe.preworkout, "Pre Workout", favoriteRecipe.preworkout)}
          {data.treats.length > 0 && this.carouselTreats(data.treats, recipe.treats, todayRecommendedRecipe.treats, "Treats", favoriteRecipe.treats)}
        </View>
      );
    }
  }
}

export default TodayMealsList;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
  },
  footerComponet: {
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: wp("4%"),
    color: colors.black,
  },
  rLabel: {
    fontFamily: fonts.GothamMedium,
    fontSize: wp("3%"),
    color: colors.grey.dark,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.grey.light,
    borderRadius: 10,
  },
  cardContainer: {
    height: wp("33%"),
    width: wp("65%"),
    marginRight: wp("3.5%"),
  },
  cardContainer1: {
    height: wp("33%"),
    width: wp("65%"),
    marginRight: wp("3.5%"),
    borderStyle: "dashed",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderTopColor: "#000000"
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: colors.transparentBlackLightest,
    padding: wp("5%"),
  },
  opacityLayer1: {
    flexDirection: 'column',
    width: "100%",
    justifyContent: "center",
    padding: 50,
    left: 15
  },
  cardTitle: {
    fontFamily: fonts.bold,
    color: colors.offWhite,
    shadowColor: colors.grey.dark,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    width: "80%",
    fontSize: wp("3.5%"),
    textTransform: "capitalize",
  },
  cardTitle1: {
    fontFamily: fonts.bold,
    color: colors.black,
    width: "90%",
    fontSize: wp("3.5%"),
  },
});