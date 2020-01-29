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
  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
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
      <View style={styles.container}>
        <ParallaxScrollView
          outputScaleValue={2}
          backgroundScrollSpeed={2}
          contentBackgroundColor={colors.white}
          parallaxHeaderHeight={width}
          renderBackground={() => (
            <Image
              source={{ uri: `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg` }}
              width={width}
            />
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
            <View style={styles.modalContainer}>
              <DateTimePicker
                mode="date"
                value={chosenDate}
                onDateChange={this.setDate}
                minimumDate={new Date()}
              />
              <View style={styles.calendarMealButtonContainer}>
                {
                  recipe.breakfast && (
                    <TouchableOpacity
                      onPress={() => this.setState({ calendarMeal: 'breakfast' })}
                      style={[
                        styles.calendarMealButton,
                        calendarMeal === 'breakfast' && styles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarMealButtonText,
                          calendarMeal === 'breakfast' && styles.calendarMealButtonTextActive,
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
                        styles.calendarMealButton,
                        calendarMeal === 'lunch' && styles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarMealButtonText,
                          calendarMeal === 'lunch' && styles.calendarMealButtonTextActive,
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
                        styles.calendarMealButton,
                        calendarMeal === 'dinner' && styles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarMealButtonText,
                          calendarMeal === 'dinner' && styles.calendarMealButtonTextActive,
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
                        styles.calendarMealButton,
                        calendarMeal === 'snack' && styles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarMealButtonText,
                          calendarMeal === 'snack' && styles.calendarMealButtonTextActive,
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
                        styles.calendarMealButton,
                        calendarMeal === 'snack2' && styles.calendarMealButtonActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarMealButtonText,
                          calendarMeal === 'snack2' && styles.calendarMealButtonTextActive,
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
                style={[styles.modalButton, !calendarMeal && styles.disabledModalButton]}
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
                    <Text style={styles.modalButtonText}>
                      ADD TO CALENDAR
                    </Text>
                  )
                }
              </TouchableOpacity>
            </View>
          </Modal>
          <View style={styles.recipeInfoContainer}>
            <Text style={styles.recipeTitle}>
              {recipe.title}
            </Text>
            <Text style={styles.recipeSubTitle}>
              {recipe.subtitle}
            </Text>
            <View style={styles.addToCalendarButtonContainer}>
              <AddToCalendarButton onPress={() => this.showModal()} />
            </View>
            <Divider style={styles.divider} />
            <View style={styles.infoBar}>
              {
                recipe.tags.length > 0 && (
                  <View style={styles.infoFieldContainer}>
                    {
                      recipe.tags.length > 0 && recipe.tags.map((tag) => (
                        <View
                          style={styles.tagCircle}
                          key={tag}
                        >
                          <Text style={styles.tagText}>
                            {tag}
                          </Text>
                        </View>
                      ))
                    }
                  </View>
                )
              }
              {
                recipe.portions && (
                  <View style={styles.infoFieldContainer}>
                    <Icon
                      name="portions"
                      size={20}
                      color={colors.violet.standard}
                    />
                    <Text style={styles.portionsText}>
                      {recipe.portions}
                    </Text>
                  </View>
                )
              }
              <View style={styles.infoFieldContainer}>
                <Icon
                  name="timer"
                  size={24}
                  color={colors.violet.standard}
                />
                <Text style={styles.timeText}>
                  {recipe.time}
                </Text>
              </View>
            </View>
            <Divider style={styles.divider} />
            <Text style={styles.recipeSummaryText}>
              {recipe.summary}
            </Text>
            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredientsHeading} >
                Ingredients
              </Text>
              {
                ingredients.map((ingredient) => {
                  return (
                    <Text
                      key={ingredient}
                      style={styles.ingredientsText}
                    >
                      • {ingredient}
                    </Text>
                  );
                })
              }
            </View>
            <View style={styles.ingredientsContainer}>
              <Text style={styles.ingredientsHeading} >
                Utensils
              </Text>
              {
                utensils.map((utensil) => {
                  return (
                    <Text
                      key={utensil}
                      style={styles.ingredientsText}
                    >
                      • {utensil}
                    </Text>
                  );
                })
              }
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recipeInfoContainer: {
    padding: 15,
  },
  recipeTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.standard,
  },
  recipeSubTitle: {
    fontFamily: fonts.standardItalic,
    fontSize: 16,
    color: colors.charcoal.standard,
    marginBottom: 8,
  },
  addToCalendarButtonContainer: {
    marginBottom: 10,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.violet.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  disabledModalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.grey.standard,
    height: 50,
    width: '100%',
    marginBottom: 0,
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
  calendarMealButtonContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 4,
  },
  calendarMealButton: {
    flex: 1,
    margin: 5,
    paddingTop: 8,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.violet.standard,
    borderRadius: 4,
  },
  calendarMealButtonActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.violet.standard,
  },
  calendarMealButtonText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.violet.standard,
  },
  calendarMealButtonTextActive: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.white,
  },
  divider: {
    backgroundColor: colors.grey.light,
  },
  infoBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width - 30,
  },
  infoFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  timeText: {
    fontFamily: fonts.standard,
    color: colors.violet.standard,
    marginTop: 4,
    marginLeft: 5,
    marginRight: 5,
  },
  tagCircle: {
    height: 24,
    width: 24,
    marginRight: 10,
    borderWidth: 2.5,
    borderColor: colors.violet.standard,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.violet.standard,
    marginTop: 4,
  },
  portionsText: {
    fontFamily: fonts.standard,
    color: colors.violet.standard,
    marginTop: 4,
    marginLeft: 5,
    marginRight: 5,
  },
  recipeSummaryText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
    marginTop: 15,
  },
  ingredientsContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: colors.grey.light,
    borderRadius: 10,
    marginTop: 15,
  },
  ingredientsHeading: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.charcoal.standard,
    marginBottom: 5,
  },
  ingredientsText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
    marginTop: 3,
    marginBottom: 3,
  },
});
