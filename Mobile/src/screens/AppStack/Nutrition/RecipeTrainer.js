import React from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import { Divider } from "react-native-elements";
// import Image from "react-native-scalable-image";
import { DotIndicator } from "react-native-indicators";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { db } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
// import fonts from '../../../styles/fonts';
import BigHeadingWithBackButton from "../../../components/Shared/BigHeadingWithBackButton";
import  { containerPadding } from "../../../styles/globalStyles";
import NutritionStyles from "./NutritionStyles";
import Tag from "../../../components/Nutrition/Tag";
import CustomBtn from "../../../components/Shared/CustomBtn";
import TimeSvg from "../../../../assets/icons/time";
import sortBy from "lodash.sortby";

const moment = require("moment");

const { width } = Dimensions.get("window");

const NutritionList = ["breakfast", "lunch", "dinner", "snack"];

export default class RecipeTrainer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipe: undefined,
      ingredients: undefined,
      utensils: undefined,
      backTitle: undefined,
      loading: true,
      chosenDate: new Date(),
      modalVisible: false,
      calendarMeal: null,
      addingToCalendar: false,
      extraProps: undefined,
      title: undefined,
    };
  }
  onFocusFunction() {
    this.setState({ loading: true });
    const { recipe } = this.state;
    // this.props.navigation.setParams({ handleStart: this.props.navigation.navigate('RecipeSteps', { recipe }) });
    this.props.navigation.setParams({
      handleStart: () => this.handleStart(recipe),
    });
    this.setState({
      recipe: this.props.navigation.getParam("recipe", null),
      ingredients: this.props.navigation.getParam("recipe", null).ingredients,
      utensils: this.props.navigation.getParam("recipe", null).utensils,
      title: this.props.navigation.getParam("title", null),
      extraProps: this.props.navigation.getParam("extraProps", undefined),
      loading: false,
    });
  }
  componentDidMount = async () => {
    // this.focusListener = this.props.navigation.addListener('willFocus', () => {
    //   this.onFocusFunction()
    // })
    this.onFocusFunction();
  };
  componentWillUnmount = async () => {
    // this.focusListener.remove()
  };
  setDate = async (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      this.setState({ chosenDate: currentDate });
    }
  };
  handleStart = (recipe) => {
    this.props.navigation.navigate("RecipeTrainerSteps", { recipe });
  };
  showModal = () => {
    this.setState({ modalVisible: true });
  };
  hideModal = () => {
    this.setState({ modalVisible: false });
  };
  addRecipeToCalendar = async (date) => {
    if (this.state.addingToCalendar) {
      return;
    }
    if (this.state.calendarMeal === null) {
      return;
    }
    this.setState({ addingToCalendar: true });
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const { recipe, calendarMeal } = this.state;
    const uid = await AsyncStorage.getItem("uid");
    const calendarRef = db
      .collection("users")
      .doc(uid)
      .collection("calendarEntries")
      .doc(formattedDate);
    const data = {
      [calendarMeal]: recipe,
    };
    await calendarRef.set(data, { merge: true });
    this.setState({ addingToCalendar: false });
    Alert.alert(
      "",
      "Added to calendar!",
      [{ text: "OK", onPress: () => this.hideModal(), style: "cancel" }],
      { cancelable: false }
    );
  };
  handleBack = () => {
    const { navigation } = this.props;
    // const { extraProps } = this.state;
    // console.log("click",extraProps)
    navigation.pop();
  };

  getBackTitle() {

    if (this.state.backTitle) {
      return this.state.backTitle;
    }
    return NutritionList.filter((res) => this.state.recipe[res])[0];

  }

  render() {
    const {
      recipe,
      ingredients,
      loading,
      utensils,
      chosenDate,
      modalVisible,
      calendarMeal,
      addingToCalendar,
      extraProps,
      backTitle,
      title
    } = this.state;

    const tagList = Object(recipe).tags

    const tagsV = sortBy(tagList).filter((tag) => {
      if (tag === 'V') {
        return tag
      } else if (tag === 'V+') {
        return tag
      } if (tag === 'GF') {
        return tag
      } if (tag === 'GH') {
        return tag
      } if (tag === 'DF') {
        return tag
      }
    }) 
    
    return (
      <View style={NutritionStyles.container}>
        {!loading && (
          <ParallaxScrollView
            outputScaleValue={2}
            backgroundScrollSpeed={2}
            contentBackgroundColor={colors.white}
            parallaxHeaderHeight={width}
            renderForeground={() => (
              <View style={{ backgroundColor: colors.offWhite }}>
                <View
                  style={{
                    marginHorizontal: containerPadding,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 60,
                  }}
                >
                  <BigHeadingWithBackButton
                    isBackButton={true}
                    onPress={this.handleBack}
                    backButtonText={`Back to Trainer`}
                    isBigTitle={false}
                    backButtonStyle={{ marginTop: 8 }}
                  />
             
                </View>
                <Image
                  source={{ uri: recipe.coverImage, cache: "force-cache" }}
                  resizeMode='cover'
                  style={{height: width, width: width}}
                />
              </View>
            )}
          >
            <Modal
              isVisible={modalVisible}
              animationIn="fadeIn"
              animationInTiming={600}
              animationOut="fadeOut"
              animationOutTiming={600}
              onBackdropPress={this.hideModal}
            >
              <View style={NutritionStyles.modalContainer}>
                <DateTimePicker
                  mode="date"
                  value={chosenDate}
                  onChange={this.setDate}
                  minimumDate={new Date()}
                  textColor="red"
                  backgroundColor="red"
                  style={NutritionStyles.Picker}
                />
                <View style={NutritionStyles.calendarMealButtonContainer}>
                  {recipe.breakfast && (
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ calendarMeal: "breakfast" })
                      }
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === "breakfast" &&
                        NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === "breakfast" &&
                          NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Breakfast
                      </Text>
                    </TouchableOpacity>
                  )}
                  {recipe.lunch && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: "lunch" })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === "lunch" &&
                        NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === "lunch" &&
                          NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Lunch
                      </Text>
                    </TouchableOpacity>
                  )}
                  {recipe.dinner && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: "dinner" })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === "dinner" &&
                        NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === "dinner" &&
                          NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Dinner
                      </Text>
                    </TouchableOpacity>
                  )}
                  {recipe.snack && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: "snack" })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === "snack" &&
                        NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === "snack" &&
                          NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Snack
                      </Text>
                    </TouchableOpacity>
                  )}
                  {recipe.snack && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: "snack2" })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === "snack2" &&
                        NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === "snack2" &&
                          NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Snack
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => this.addRecipeToCalendar(chosenDate)}
                  style={[
                    NutritionStyles.modalButton,
                    !calendarMeal && NutritionStyles.disabledModalButton,
                  ]}
                  disabled={!calendarMeal}
                >
                  {addingToCalendar ? (
                    <DotIndicator color={colors.white} count={3} size={6} />
                  ) : (
                    <Text style={NutritionStyles.modalButtonText}>
                      ADD TO CALENDAR
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </Modal>
            <View style={{ paddingHorizontal: containerPadding }}>
              <View style={NutritionStyles.infoBar}>
                {tagsV.length > 0 && (
                  <View style={NutritionStyles.infoFieldContainer}>
                    {tagsV.length > 0 &&
                      tagsV.map((tag, index) => (
                        <Tag tag={tag} key={index} />
                      ))}
                  </View>
                )}
                <View
                  style={[
                    NutritionStyles.infoFieldContainer,
                    { marginLeft: 10 },
                  ]}
                >
                  <TimeSvg width="22" height="22" />
                  <Text style={NutritionStyles.infoText}>{recipe.time}</Text>
                </View>
                {recipe.portions && (
                  <View
                    style={[
                      NutritionStyles.infoFieldContainer,
                      { marginLeft: 10 },
                    ]}
                  >
                   
                    <Text style={NutritionStyles.infoText}>
                      {recipe.portions}
                    </Text>
                  </View>
                )}
              </View>
              <Divider style={NutritionStyles.divider} />
              <View style={NutritionStyles.recipeInfoContainer}>
                <Text style={NutritionStyles.recipeTitle}>{recipe.title}</Text>
               

                <Text
                  style={[
                    NutritionStyles.recipeSummaryText,
                    { lineHeight: 20 },
                  ]}
                >
                  {recipe.summary}
                </Text>
                <View style={NutritionStyles.ingredientsContainer}>
                  <Text style={[NutritionStyles.ingredientsHeading]}>
                    Ingredients
                  </Text>
                  {ingredients.map((ingredient, index) => {
                    if (ingredient)
                      return (
                        <View style={{ flexDirection: "row" }} key={index}>
                          <Text style={NutritionStyles.ingredientsText}>
                            {" "}
                            •{" "}
                          </Text>
                          <Text
                            key={ingredient}
                            style={NutritionStyles.ingredientsText}
                          >
                            {ingredient.replace("-", "").trim()}
                          </Text>
                        </View>
                      );
                  })}
                  {
                    recipe.notes ?
                      < View style={{ marginLeft: 5 }}>
                        <Text style={NutritionStyles.ingredientsText}>
                          <Text style={[NutritionStyles.ingredientsHeading1]}>Note:</Text> {recipe.notes}
                        </Text>
                      </View>
                      :
                      null
                  }
                </View>
                <View style={NutritionStyles.ingredientsContainer}>
                  <Text style={NutritionStyles.ingredientsHeading}>
                    Utensils
                  </Text>
                  {utensils.map((utensil, index) => {
                    if (utensil)
                      return (
                        <View style={{ flexDirection: "row" }} key={index}>
                          <Text style={NutritionStyles.ingredientsText}>
                            {" "}
                            •{" "}
                          </Text>
                          <Text
                            key={utensil}
                            style={NutritionStyles.ingredientsText}
                          >
                            {utensil.replace("-", "").trim()}
                          </Text>
                        </View>
                        
                      );
                  })}
                </View>
                <View style={{ marginTop: 20, marginBottom: 8 }}>
                  <CustomBtn
                    Title="Get started"
                    outline={false}
                    onPress={() => this.handleStart(recipe)}
                  />
                </View>
                <BigHeadingWithBackButton
                  isBackButton={true}
                  onPress={this.handleBack}
                  backButtonText={`Back to Trainer`}
                  isBigTitle={false}
                />
              </View>
            </View>
          </ParallaxScrollView>
        )
        }

        <Loader loading={loading} color={colors.violet.dark} />
      </View >
    );
  }
}
