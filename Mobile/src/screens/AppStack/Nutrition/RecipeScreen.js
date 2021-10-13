import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as FileSystem from "expo-file-system";
import Modal from "react-native-modal";
import { Divider } from "react-native-elements";
import Image from "react-native-scalable-image";
import { DotIndicator } from "react-native-indicators";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { db } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import Icon from "../../../components/Shared/Icon";
import AddToCalendarButton from "../../../components/Shared/AddToCalendarButton";
import colors from "../../../styles/colors";
// import fonts from '../../../styles/fonts';
import BigHeadingWithBackButton from "../../../components/Shared/BigHeadingWithBackButton";
import globalStyle, { containerPadding } from "../../../styles/globalStyles";
import NutritionStyles from "./NutritionStyles";
import Tag from "../../../components/Nutrition/Tag";
import CustomButton from "../../../components/Shared/CustomButton";
import CustomBtn from "../../../components/Shared/CustomBtn";
import TimeSvg from "../../../../assets/icons/time";
import fonts from "../../../styles/fonts";

const moment = require("moment");

const { width } = Dimensions.get("window");

const NutritionList = ["breakfast", "lunch", "dinner", "snack"];

export default class RecipeScreen extends React.PureComponent {
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
      backTitle: this.props.navigation.getParam("backTitle", null),
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
    this.props.navigation.navigate("RecipeSteps", { recipe });
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
    } = this.state;
    // console.log("from calendar",extraProps)
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
                    backButtonText={`Back to ${this.getBackTitle()}`}
                    isBigTitle={false}
                    backButtonStyle={{ marginTop: 8 }}
                  />
                  {/* <View >
                          <AddToCalendarButton onPress={() => this.showModal()} />
                        </View> */}
                </View>
                <Image
                  source={{
                    uri: `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg`,
                  }}
                  width={width}
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
                {recipe.tags.length > 0 && (
                  <View style={NutritionStyles.infoFieldContainer}>
                    {recipe.tags.length > 0 &&
                      recipe.tags.map((tag, index) => (
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
                    {/* <Icon
                          name="portions"
                          size={20}
                          color={colors.black}
                        /> */}
                    <Text style={NutritionStyles.infoText}>
                      {recipe.portions}
                    </Text>
                  </View>
                )}
              </View>
              <Divider style={NutritionStyles.divider} />
              <View style={NutritionStyles.recipeInfoContainer}>
                <Text style={NutritionStyles.recipeTitle}>{recipe.title}</Text>
                {/* <Text style={NutritionStyles.recipeSubTitle}>
                  {recipe.subtitle}
                </Text> */}
                {/* <View style={styles.addToCalendarButtonContainer}>
                  <AddToCalendarButton onPress={() => this.showModal()} />
                </View> */}
                {/* <Divider style={NutritionStyles.divider} /> */}

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
                        // <Text
                        //   key={utensil}
                        //   style={NutritionStyles.ingredientsText}
                        // >
                        //   • {utensil}
                        // </Text>
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
                  backButtonText={`Back to ${this.getBackTitle()}`}
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
