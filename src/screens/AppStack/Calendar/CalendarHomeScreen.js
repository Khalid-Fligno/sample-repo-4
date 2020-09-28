import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import CalendarStrip from 'react-native-calendar-strip';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import firebase from 'firebase';
import ReactTimeout from 'react-timeout';
import { db } from '../../../../config/firebase';
import HelperModal from '../../../components/Shared/HelperModal';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import { findReps } from '../../../utils';
import { findFocus, findLocation, findFocusIcon, findWorkoutType } from '../../../utils/workouts';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import globalStyle from '../../../styles/globalStyles';
const { width } = Dimensions.get('window');

const recommendedWorkoutMap = {
  undefined: '',
  0: 'Press here to see available workouts',
  1: 'Recommended - Resistance / Full Body',
  2: 'Recommended - HIIT',
  3: 'Recommended - Resistance / Upper Body',
  4: 'Recommended - HIIT',
  5: 'Recommended - Resistance / ABT',
  6: 'Press here to see available workouts',
};

class CalendarHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workout: undefined,
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snack: undefined,
      snack2: undefined,
      loading: false,
      isSwiping: false,
      helperModalVisible: false,
      dayOfWeek: undefined,
    };
    this.calendarStrip = React.createRef();
  }

  componentDidMount = async () => {
    this.props.navigation.setParams({ toggleHelperModal: this.showHelperModal });
    await this.fetchCalendarEntries();
    this.showHelperOnFirstOpen();
  }

  componentWillUnmount() {
    this.unsubscribeFromEntries();
    if (this.unsubscribeFromEntries2) {
      this.unsubscribeFromEntries2();
    }
  }

  fetchCalendarEntries = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const selectedDate = this.calendarStrip.current.getSelectedDate();
    const stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    this.unsubscribeFromEntries = await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            workout: await doc.data().workout,
            breakfast: await doc.data().breakfast,
            lunch: await doc.data().lunch,
            dinner: await doc.data().dinner,
            snack: await doc.data().snack,
            snack2: await doc.data().snack2,
            loading: false,
            dayOfWeek: selectedDate.format('d'),
          });
        } else {
          this.setState({
            loading: false,
            dayOfWeek: selectedDate.format('d'),
          });
        }
      });
  }
  
  showHelperOnFirstOpen = async () => {
    const helperShownOnFirstOpen = await AsyncStorage.getItem('calendarHelperShownOnFirstOpen');
    if (helperShownOnFirstOpen === null) {
      this.props.setTimeout(() => this.setState({ helperModalVisible: true }), 1200);
      AsyncStorage.setItem('calendarHelperShownOnFirstOpen', 'true');
    }
  }

  showHelperModal = () => {
    this.setState({ helperModalVisible: true });
  }

  hideHelperModal = () => {
    this.setState({ helperModalVisible: false });
  }

  handleDateSelected = async (date) => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = date.format('YYYY-MM-DD').toString();
    this.unsubscribeFromEntries2 = await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            workout: await doc.data().workout,
            breakfast: await doc.data().breakfast,
            lunch: await doc.data().lunch,
            dinner: await doc.data().dinner,
            snack: await doc.data().snack,
            snack2: await doc.data().snack2,
            loading: false,
            dayOfWeek: date.format('d'),
          });
        } else {
          this.setState({
            workout: undefined,
            breakfast: undefined,
            lunch: undefined,
            dinner: undefined,
            snack: undefined,
            snack2: undefined,
            loading: false,
            dayOfWeek: date.format('d'),
          });
        }
      });
  }

  loadExercises = async (workoutId) => {
    this.setState({ loading: true });
    console.log(workoutId)
    db.collection('newWorkouts').doc(workoutId)
      .get()
      .then(async (doc) => {
        try{
            FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res)=>{
              // console.log(res)
                Promise.all(res.map(async (item,index) => {
                    if (item.includes("exercise-")) {
                      console.log(`${FileSystem.cacheDirectory}${item}`)
                      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true }).then(()=>{
                        // console.log("deleted...",item)
                      })
                    }
                }))
            })

            const workout = await doc.data();
            const { exercises } = workout;
            await Promise.all(exercises.map(async (exercise, index) => {
              // const videoUrl = exercise.videoUrls.filter(res=>res.model === 'sharnia')
              // console.log(exercise.videoUrls[0].url)
              if(exercise.videoUrls[0].url !== ""){
                  await FileSystem.downloadAsync(
                    exercise.videoUrls[0].url,
                    `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
                  ).then(()=>{
                    // console.log(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4` +"downloaded")
                  })
                  .catch(err=>console.log(err))
              }
            }))

            const fitnessLevel = await AsyncStorage.getItem('fitnessLevel', null);
            this.setState({ loading: false });
            this.props.navigation.navigate('WorkoutInfo', 
            {
              workout, 
              reps: workout.difficultyLevel[fitnessLevel-1].toString(),
              workoutSubCategory:workout.workoutSubCategory,
              fitnessLevel,
              extraProps:{fromCalender:true}
            }
            );
        }
        catch(err){
          console.log(err)
          this.setState({ loading: false });
          Alert.alert('Something went wrong','Please check workout load section')
        }
        
      })
     
  }
  
  deleteCalendarEntry = async (fieldToDelete) => {
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    this.unsubscribe = await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .update({
        [fieldToDelete]: firebase.firestore.FieldValue.delete(),
      });
  }
  renderRightActions = (fieldToDelete) => {
    return (
      <TouchableOpacity
        onPress={() => this.deleteCalendarEntry(fieldToDelete)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>
          Delete
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    const {
      loading,
      workout,
      breakfast,
      lunch,
      dinner,
      snack,
      snack2,
      helperModalVisible,
      dayOfWeek,
    } = this.state;

    // const findLocationIcon = () => {
    //   let location;
    //   if (workout.home) {
    //     location = 'home';
    //   } else if (workout.gym) {
    //     location = 'gym';
    //   } else if (workout.outdoors) {
    //     location = 'park';
    //   }
    //   return `workouts-${location}`;
    // };


    const mealSwipable = (name,data)=>{
      return (
        <Swipeable
                renderRightActions={() => this.renderRightActions(name)}
                overshootRight={false}
                onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                onSwipeableClose={() => this.setState({ isSwiping: false })}
              >
                <ListItem
                  title={data.title.toUpperCase()}
                  subtitle={data.subtitle}
                  onPress={() => this.props.navigation.navigate('Recipe', { recipe: data })}
                  containerStyle={styles.listItemContainer}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={styles.recipeListItemTitle}
                  subtitleStyle={styles.recipeListItemSubtitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.themeColor.color} />}
                />
        </Swipeable>
      )
    }
    const mealListItem = (name)=>{
      return (
        <ListItem
        title={name.toUpperCase()}
        subtitle="Press here to see available recipes"
        onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: name.toLowerCase() })}
        containerStyle={styles.listItemContainer}
        chevronColor={colors.charcoal.standard}
        titleStyle={styles.blankListItemTitle}
        subtitleStyle={styles.blankListItemSubtitle}
        rightIcon={<Icon name="add-circle" size={18} color={colors.grey.medium} />}
      />
      )
    }
    
    const dayDisplay = (
      <ScrollView
        contentContainerStyle={styles.dayDisplayContainer}
        scrollEnabled={!this.state.isSwiping}
      >
        <Text style={styles.headerText}>
          WORKOUT
        </Text>
        <View style={styles.listContainer}>
          {
            workout ? (
              <Swipeable
                renderRightActions={() => this.renderRightActions('workout')}
                overshootRight={false}
                onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                onSwipeableClose={() => this.setState({ isSwiping: false })}
              >
                <ListItem
                  title={workout.displayName}
                  subtitle={
                    workout.filters.includes('strength') ? (
                      <View style={styles.workoutSubtitleContainer}>
                        {/* <Icon
                          name={findLocationIcon()}
                          size={20}
                          color={colors.charcoal.standard}
                        /> */}
                        {/* <Text style={styles.workoutSubtitleText}>
                          {findLocation(workout)}
                        </Text> */}
                        <Icon
                          name={findFocusIcon(workout)}
                          size={20}
                          color={colors.charcoal.standard}
                        />
                        <Text style={styles.workoutSubtitleText}>
                          {findFocus(workout)}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.workoutSubtitleContainer}>
                        <Icon
                          name="workouts-hiit"
                          size={18}
                          color={colors.charcoal.standard}
                        />
                        <Text style={styles.workoutSubtitleText}>
                          HIIT {findWorkoutType(workout)}
                        </Text>
                      </View>
                    )
                  }
                  // onPress={workout.resistance ? () => this.loadExercises(workout.id) : () => this.loadHiitExercises(workout.id)}
                  onPress={ () => this.loadExercises(workout.id) }
                  containerStyle={styles.listItemContainerBottom}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={styles.workoutListItemTitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.themeColor.color} />}
                />
              </Swipeable>
            ) : (
              <ListItem
                title="WORKOUT"
                subtitle={recommendedWorkoutMap[dayOfWeek]}
                onPress={() => this.props.navigation.navigate('WorkoutsHome')}
                containerStyle={styles.listItemContainerBottom}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.medium} />}
              />
          )
        }
        </View>
        <Text style={styles.headerText}>
          MEALS
        </Text>
        <View style={styles.listContainer}>
          {
            breakfast ?mealSwipable('breakfast',breakfast):mealListItem("BREAKFAST")
          }
          {
            lunch ? mealSwipable('lunch',lunch) :  mealListItem('lunch')
          }
          {
            dinner ?mealSwipable('dinner',dinner) :  mealListItem('dinner')
          }
        </View>
        <View style={styles.listContainerBottom}>
          {
            snack ? mealSwipable('snack',snack) :  mealListItem('snack')
          }
          {
            snack2 ?  mealSwipable('snack',snack2) :  mealListItem('snack')
          }
        </View>
      </ScrollView>
    );
    return (
      <View style={[globalStyle.container,{paddingHorizontal:0}]}>
        <View style={styles.calendarStripContainer}>
          <CalendarStrip
            ref={this.calendarStrip}
            maxDayComponentSize={50}
            onDateSelected={(date) => this.handleDateSelected(date)}
            daySelectionAnimation={{
              type: 'background',
              duration: 400,
              highlightColor: colors.white,
            }}
            style={styles.calendarStrip}
            calendarHeaderStyle={styles.calendarStripHeader}
            calendarColor={colors.themeColor.lightColor}
            dateNumberStyle={{
              fontFamily: fonts.bold,
              color: colors.white,
            }}
            dateNameStyle={{
              fontFamily: fonts.bold,
              color: colors.white,
            }}
            highlightDateNumberStyle={{
              fontFamily: fonts.bold,
              color: colors.charcoal.dark,
            }}
            highlightDateNameStyle={{
              fontFamily: fonts.bold,
              color: colors.charcoal.dark,
            }}
            weekendDateNameStyle={{
              fontFamily: fonts.bold,
              color: colors.grey.standard,
            }}
            weekendDateNumberStyle={{
              fontFamily: fonts.bold,
              color: colors.grey.standard,
            }}
            iconContainer={{
              flex: 0.15,
            }}
            leftSelector={<Icon name="chevron-left" size={20} color={colors.charcoal.standard} />}
            rightSelector={<Icon name="chevron-right" size={20} color={colors.charcoal.standard} />}
          />
        </View>
        {dayDisplay}
        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={this.hideHelperModal}
          headingText="Calendar"
          bodyText="Are you the type of person who likes to stay organised?  This is the perfect tool for you."
          bodyText2="
            Schedule workouts and recipes weeks in advance, so you know exactly what you’re training and what you are eating each day.
            Once you have scheduled these, you can go directly to your workout or recipe from this screen.
          "
          bodyText3={'How to add a workout or recipe:\n- Select a recipe/workout\n- On the recipe/workout screen, press ‘Add to Calendar’\n- Select the day you would like to schedule this for'}
          color="red"
        />
        <Loader
          loading={loading}
          color={colors.red.standard}
        />
      </View>
    );
  }
}

CalendarHomeScreen.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  calendarStripContainer: {
    shadowColor: colors.grey.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  calendarStrip: {
    height: 90,
    paddingTop: 10,
    paddingBottom: 20,
  },
  calendarStripHeader: {
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: 0,
    marginBottom: 15,
  },
  dayDisplayContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.dark,
    marginTop: 14,
    marginBottom: 12,
  },
  listContainer: {
    width,
    marginTop: 0,
    borderTopWidth: 0,
    borderTopColor: colors.grey.light,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  listContainerBottom: {
    width,
    marginTop: 20,
    borderTopWidth: 0,
    borderTopColor: colors.grey.light,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  listItemContainer: {
    width,
    height: 65,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.light,
  },
  listItemContainerBottom: {
    width,
    height: 65,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderBottomWidth: 0,
    borderBottomColor: colors.grey.light,
  },
  blankListItemTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.grey.medium,
    marginBottom: 5,
  },
  blankListItemSubtitle: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.grey.medium,
  },
  workoutListItemTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.themeColor.color,
    marginBottom: 5,
  },
  workoutSubtitleContainer: {
    flexDirection: 'row',
    // marginLeft: 8,
  },
  workoutSubtitleText: {
    fontFamily: fonts.standard,
    color: colors.charcoal.standard,
    marginTop: 4,
    marginLeft: 5,
    marginRight: 15,
  },
  recipeListItemTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.themeColor.color,
    marginBottom: 5,
  },
  recipeListItemSubtitle: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.charcoal.standard,
  },
  deleteButton: {
    width: 80,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.themeColor.color,
  },
  deleteButtonText: {
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: 4,
  },
});

export default ReactTimeout(CalendarHomeScreen);
