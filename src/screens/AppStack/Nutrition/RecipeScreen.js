import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  AsyncStorage,
  DatePickerIOS,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { FileSystem } from 'expo';
import Modal from 'react-native-modal';
import { Divider } from 'react-native-elements';
import Image from 'react-native-scalable-image';
import { DotIndicator } from 'react-native-indicators';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
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
    this.props.navigation.setParams({
      handleStart: () => this.props.navigation.navigate('RecipeSteps', { recipe }),
    });
    this.setState({ loading: false });
  }
  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }));
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
      'Added to calendar!',
      `${recipe.title.toUpperCase()}`,
      [
        { text: 'OK', onPress: () => this.setState({ modalVisible: false }), style: 'cancel' },
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
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.violet.dark}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <Modal
            isVisible={modalVisible}
            onBackdropPress={() => this.toggleModal()}
            animationIn="fadeIn"
            animationInTiming={600}
            animationOut="fadeOut"
            animationOutTiming={600}
          >
            <View style={styles.modalContainer}>
              <DatePickerIOS
                mode="date"
                date={chosenDate}
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
          <Image
            source={{ uri: `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg` }}
            width={width}
          />
          <View style={styles.recipeInfoContainer}>
            <Text style={styles.recipeTitle}>
              {recipe.title}
            </Text>
            <Text style={styles.recipeSubTitle}>
              {recipe.subtitle}
            </Text>
            <TouchableOpacity
              onPress={() => this.toggleModal()}
              style={styles.addToCalendarButton}
            >
              <Icon
                name="calendar-outline"
                size={18}
                color={colors.charcoal.light}
              />
              <Text style={styles.addToCalendarButtonText}>
                Add to calendar
              </Text>
            </TouchableOpacity>
            <Divider style={styles.divider} />
            <View style={styles.infoBar}>
              <Icon
                name="timer"
                size={22}
                color={colors.violet.standard}
              />
              <Text style={styles.timeText}>
                {recipe.time}
              </Text>
              {
                recipe.tags && recipe.tags.map((tag) => (
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
                      - {ingredient}
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
                      - {utensil}
                    </Text>
                  );
                })
              }
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselCard: {
    flex: 1,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: colors.white,
    shadowColor: colors.violet.dark,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: colors.violet.dark,
  },
  carouselHeaderContainer: {
    backgroundColor: colors.white,
    borderRadius: 5,
  },
  carouselHeaderContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.violet.dark,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  carouselHeaderText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.violet.standard,
    marginTop: 3,
  },
  carouselHeaderButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.violet.dark,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
  },
  carouselTextContainer: {
    flex: 1,
    paddingTop: 15,
    paddingRight: 10,
    paddingBottom: 15,
    paddingLeft: 15,
  },
  carouselText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
  },
  recipeTitle: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.standard,
  },
  recipeSubTitle: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: colors.charcoal.standard,
    marginBottom: 8,
  },
  addToCalendarButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 150,
    marginBottom: 8,
    padding: 3,
    borderWidth: 2,
    borderColor: colors.charcoal.light,
    borderRadius: 4,
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
  addToCalendarButtonText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginTop: 3,
    marginLeft: 5,
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
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: width,
  },
  timeText: {
    fontFamily: fonts.standard,
    color: colors.violet.standard,
    marginTop: 3,
    marginLeft: 5,
    marginRight: 5,
  },
  tagCircle: {
    height: 24,
    width: 24,
    marginLeft: 10,
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
  recipeSummaryText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
    marginTop: 15,
  },
  recipeInfoContainer: {
    padding: 15,
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
