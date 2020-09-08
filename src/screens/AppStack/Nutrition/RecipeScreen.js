import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';
import Modal from 'react-native-modal';
import { Divider } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import { DotIndicator } from 'react-native-indicators';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import AddToCalendarButton from '../../../components/Shared/AddToCalendarButton';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import { containerPadding } from '../../../styles/globalStyles';
import NutritionStyles from './NutritionStyles';
import Tag from '../../../components/Nutrition/Tag';
import CustomButton from '../../../components/Shared/CustomButton';
import CustomBtn from '../../../components/Shared/CustomBtn';

const moment = require('moment');

const { width } = Dimensions.get('window');

export default class RecipeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      recipe: this.props.navigation.getParam('recipe', null),
      ingredients: this.props.navigation.getParam('recipe', null).ingredients,
      utensils: this.props.navigation.getParam('recipe', null).utensils,
      loading: false,
      chosenDate: new Date(),
      modalVisible: false,
      calendarMeal: null,
      addingToCalendar: false,
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    const { recipe } = this.state;
    // this.props.navigation.setParams({ handleStart: this.props.navigation.navigate('RecipeSteps', { recipe }) });
    this.props.navigation.setParams({ handleStart: () => this.handleStart(recipe) });
    this.setState({ loading: false });
  }
  setDate = async (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({ chosenDate: currentDate });
  }
  handleStart = (recipe) => {
    this.props.navigation.navigate('RecipeSteps', { recipe });
  }
  showModal = () => {
    this.setState({ modalVisible: true });
  }
  hideModal = () => {
    this.setState({ modalVisible: false });
  }
  addRecipeToCalendar = async (date) => {
    if (this.state.addingToCalendar) {
      return;
    }
    if (this.state.calendarMeal === null) {
      return;
    }
    this.setState({ addingToCalendar: true });
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const { recipe, calendarMeal } = this.state;
    const uid = await AsyncStorage.getItem('uid');
    const calendarRef = db.collection('users').doc(uid).collection('calendarEntries').doc(formattedDate);
    const data = {
      [calendarMeal]: recipe,
    };
    await calendarRef.set(data, { merge: true });
    this.setState({ addingToCalendar: false });
    Alert.alert(
      '',
      'Added to calendar!',
      [
        { text: 'OK', onPress: () => this.hideModal(), style: 'cancel' },
      ],
      { cancelable: false },
    );
  }
  handleBack = () => {
    const { navigation } = this.props;
    navigation.pop();
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
    } = this.state;
    return (
      <View style={NutritionStyles.container}>
       
        <ParallaxScrollView
          outputScaleValue={2}
          backgroundScrollSpeed={2}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={width}
          renderBackground={() => (
            <View style={{backgroundColor:colors.offWhite}}>
              <View style={{marginBottom:-25,marginHorizontal:containerPadding}}>
                <BigHeadingWithBackButton isBackButton = {true} 
                  onPress={this.handleBack} 
                  backButtonText="Back to breakfasts" 
                  isBigTitle ={false}
                  />
                </View>
              <Image
                source={{ uri: `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg` }}
                width={width}
              />
            </View>
          )}
        >
          
          {/* <Modal
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
              />
              <View style={NutritionStyles.calendarMealButtonContainer}>
                {
                  recipe.breakfast && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: 'breakfast' })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === 'breakfast' && NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === 'breakfast' && NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Breakfast
                      </Text>
                    </TouchableOpacity>
                  )
                }
                {
                  recipe.lunch && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: 'lunch' })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === 'lunch' && NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === 'lunch' && NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                      Lunch
                      </Text>
                    </TouchableOpacity>
                  )
                }
                {
                  recipe.dinner && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: 'dinner' })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === 'dinner' && NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === 'dinner' && NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Dinner
                      </Text>
                    </TouchableOpacity>
                  )
                }
                {
                  recipe.snack && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: 'snack' })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === 'snack' && NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === 'snack' && NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Snack
                      </Text>
                    </TouchableOpacity>
                  )
                }
                {
                  recipe.snack && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: 'snack2' })}
                      style={[
                        NutritionStyles.calendarMealButton,
                        calendarMeal === 'snack2' && NutritionStyles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          NutritionStyles.calendarMealButtonText,
                          calendarMeal === 'snack2' && NutritionStyles.calendarMealButtonTextActive,
                        ]}
                      >
                        Snack
                      </Text>
                    </TouchableOpacity>
                  )
                }
              </View>
              <TouchableOpacity
                onPress={() => this.addRecipeToCalendar(chosenDate)}
                style={[NutritionStyles.modalButton, !calendarMeal && NutritionStyles.disabledModalButton]}
                disabled={!calendarMeal}
              >
                {
                  addingToCalendar ? (
                    <DotIndicator
                      color={colors.white}
                      count={3}
                      size={6}
                    />
                  ) : (
                    <Text style={NutritionStyles.modalButtonText}>
                      ADD TO CALENDAR
                    </Text>
                  )
                }
              </TouchableOpacity>
            </View>
          </Modal> */}
          <View style={{paddingHorizontal:containerPadding}}>
            <View style={NutritionStyles.infoBar}>
              {
                recipe.tags.length > 0 && (
                  <View style={NutritionStyles.infoFieldContainer}>
                    {
                      recipe.tags.length > 0 && recipe.tags.map((tag) => (
                        <Tag tag = {tag} />
                      ))
                    }
                  </View>
                )
              }
              <View style={[NutritionStyles.infoFieldContainer,{ marginLeft:10}]}>
                <Icon
                  name="timer"
                  size={24}
                  color={colors.black}
                />
                <Text style={NutritionStyles.infoText}>
                  {recipe.time}
                </Text>
              </View>
              {
                recipe.portions && (
                  <View style={[NutritionStyles.infoFieldContainer,{ marginLeft:10}]}>
                    {/* <Icon
                      name="portions"
                      size={20}
                      color={colors.black}
                    /> */}
                    <Text style={NutritionStyles.infoText}>
                      {recipe.portions}
                    </Text>
                  </View>
                )
              }
              
            </View>
            <Divider style={NutritionStyles.divider} />
            <View style={NutritionStyles.recipeInfoContainer}>
            <Text style={NutritionStyles.recipeTitle}>
              {recipe.title}
            </Text>
            {/* <Text style={NutritionStyles.recipeSubTitle}>
              {recipe.subtitle}
            </Text> */}
            {/* <View style={styles.addToCalendarButtonContainer}>
              <AddToCalendarButton onPress={() => this.showModal()} />
            </View> */}
            {/* <Divider style={NutritionStyles.divider} /> */}
            
            <Text style={[NutritionStyles.recipeSummaryText,{lineHeight:20}]}>
              {recipe.summary}
            </Text>
            <View style={NutritionStyles.ingredientsContainer}>
              <Text style={[NutritionStyles.ingredientsHeading]} >
                Ingredients
              </Text>
              {
                ingredients.map((ingredient) => {
                  return (
                    <View style={{flexDirection:"row"}}>
                      <Text  style={NutritionStyles.ingredientsText}> • </Text>
                      <Text
                       key={ingredient}
                       style={NutritionStyles.ingredientsText}
                      >
                        {ingredient}
                      </Text>
                    </View>
                    
                  );
                })
              }
            </View>
            <View style={NutritionStyles.ingredientsContainer}>
              <Text style={NutritionStyles.ingredientsHeading} >
                Utensils
              </Text>
              {
                utensils.map((utensil) => {
                  return (
                    <View style={{flexDirection:"row"}}>
                    <Text  style={NutritionStyles.ingredientsText}> • </Text>
                    <Text
                     key={utensil}
                     style={NutritionStyles.ingredientsText}
                    >
                      {utensil}
                    </Text>
                  </View>
                    // <Text
                    //   key={utensil}
                    //   style={NutritionStyles.ingredientsText}
                    // >
                    //   • {utensil}
                    // </Text>
                  );
                })
              }
            </View>
            <View style={{marginTop:20,marginBottom:8}}>
              <CustomBtn 
                 customBtnStyle={{borderRadius:50}} 
                 customBtnTitleStyle={{}}
                 Title="Get Started"
                 onPress={()=>this.handleStart(recipe)}
              />
            </View>
            <BigHeadingWithBackButton isBackButton = {true} 
                  onPress={this.handleBack} 
                  backButtonText="Back to breakfasts" 
                  isBigTitle ={false}
            />
          </View>
          </View>  
        </ParallaxScrollView>
        <Loader
          loading={loading}
          color={colors.violet.dark}
        />
      </View>
    );
  }
}

