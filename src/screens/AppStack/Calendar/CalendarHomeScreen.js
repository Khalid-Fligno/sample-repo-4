import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  AsyncStorage,
  Dimensions,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { FileSystem, Calendar, Permissions } from 'expo';
import CalendarStrip from 'react-native-calendar-strip';
import Swipeable from 'react-native-swipeable';
import firebase from 'firebase';
import Modal from 'react-native-modal';
import { db, auth } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import { findReps } from '../../../utils';
import { findFocus, findLocation } from '../../../utils/workouts';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class CalendarHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workout: undefined,
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snack: undefined,
      loading: false,
      isSwiping: false,
      helperModalVisible: false,
    };
    this.calendarStrip = React.createRef();
  }
  componentWillMount = () => {
    this.props.navigation.setParams({ toggleHelperModal: this.toggleHelperModal });
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    this.unsubscribe = await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            workout: await doc.data().workout,
            breakfast: await doc.data().breakfast,
            lunch: await doc.data().lunch,
            dinner: await doc.data().dinner,
            snack: await doc.data().snack,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  toggleHelperModal = () => {
    this.setState((prevState) => ({
      helperModalVisible: !prevState.helperModalVisible,
    }));
  }
  handleDateSelected = async (date) => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = date.format('YYYY-MM-DD').toString();
    this.unsubscribe = await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            workout: await doc.data().workout,
            breakfast: await doc.data().breakfast,
            lunch: await doc.data().lunch,
            dinner: await doc.data().dinner,
            snack: await doc.data().snack,
            loading: false,
          });
        } else {
          this.setState({
            workout: undefined,
            breakfast: undefined,
            lunch: undefined,
            dinner: undefined,
            snack: undefined,
            loading: false,
          });
        }
      });
  }
  loadExercises = async (workout) => {
    this.setState({ loading: true });
    const user = auth.currentUser;
    let reps;
    if (user) {
      db.collection('users')
        .doc(user.uid)
        .onSnapshot(async (doc) => {
          if (doc.exists) {
            reps = findReps(await doc.data().fitnessLevel);
          }
        });
    }
    const { exercises } = workout;
    try {
      await Promise.all(exercises.map(async (exercise, index) => {
        await FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
        );
      }));
      this.setState({ loading: false });
      this.props.navigation.navigate('WorkoutInfo', { workout, reps });
    } catch (err) {
      console.log(`Filesystem download error: ${err}`);
    }
  }
  loadHiitExercises = async (workout) => {
    this.setState({ loading: true });
    const { exercises } = workout;
    try {
      await Promise.all(exercises.map(async (exercise, index) => {
        await FileSystem.downloadAsync(
          exercise.videoURL,
          `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
        );
      }));
      this.setState({ loading: false });
      this.props.navigation.navigate('HiitWorkoutInfo', { workout });
    } catch (err) {
      console.log(`Filesystem download error: ${err}`);
    }
  }
  addToCalendarApp = async (workout) => {
    const { status } = await Permissions.askAsync(Permissions.CALENDAR);
    if (status !== 'granted') {
      Alert.alert('No Permission for Calendar');
      return;
    }
    const y = new Date(this.calendarStrip.current.getSelectedDate()).getFullYear();
    const mth = new Date(this.calendarStrip.current.getSelectedDate()).getMonth();
    const d = new Date(this.calendarStrip.current.getSelectedDate()).getDate();
    const h = 12;
    const m = 30;
    const s = 0;
    Calendar.createEventAsync(Calendar.DEFAULT, {
      title: 'FitazFK Workout',
      startDate: new Date(y, mth, d, h, m, s),
      endDate: new Date(y, mth, d, h, m + 18, s),
      notes: `${workout.name}`,
      alarms: [{ absoluteDate: new Date(y, mth, d, h, m - 15, s) }],
    });
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
  render() {
    const {
      loading,
      workout,
      breakfast,
      lunch,
      dinner,
      snack,
      helperModalVisible,
    } = this.state;
    const loadingView = (
      <Loader
        loading={loading}
        color={colors.green.standard}
      />
    );
    const deleteButton = (fieldToDelete) => [
      <TouchableOpacity
        onPress={() => this.deleteCalendarEntry(fieldToDelete)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>
          Delete
        </Text>
      </TouchableOpacity>,
    ];
    const findLocationIcon = () => {
      let location;
      if (workout.home) {
        location = 'home';
      } else if (workout.gym) {
        location = 'gym';
      } else if (workout.park) {
        location = 'park';
      }
      return `workouts-${location}`;
    };
    const findFocusIcon = () => {
      let focus;
      if (workout.fullBody) {
        focus = 'full';
      } else if (workout.upperBody) {
        focus = 'upper';
      } else if (workout.lowerBody) {
        focus = 'lower';
      } else if (workout.core) {
        focus = 'core';
      }
      return `workouts-${focus}`;
    };
    const dayDisplay = (
      <ScrollView
        contentContainerStyle={styles.dayDisplayContainer}
        scrollEnabled={!this.state.isSwiping}
      >
        <Text style={styles.headerText}>
          WORKOUT
        </Text>
        <List containerStyle={styles.listContainer}>
          {
            workout ? (
              <Swipeable
                rightButtons={deleteButton('workout')}
                rightButtonWidth={75}
                rightContainerStyle={styles.deleteButtonContainer}
                onSwipeStart={() => this.setState({ isSwiping: true })}
                onSwipeRelease={() => this.setState({ isSwiping: false })}
              >
                <ListItem
                  title={workout.name.toUpperCase()}
                  subtitle={
                    workout.resistance ? (
                      <View style={styles.workoutSubtitleContainer}>
                        <Icon
                          name={findLocationIcon()}
                          size={20}
                          color={colors.charcoal.standard}
                        />
                        <Text style={styles.workoutSubtitleText}>
                          {findLocation(workout)}
                        </Text>
                        <Icon
                          name={findFocusIcon()}
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
                          HIIT
                        </Text>
                      </View>
                    )
                  }
                  onPress={workout.resistance ? () => this.loadExercises(workout) : () => this.loadHiitExercises(workout)}
                  containerStyle={styles.listItem}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={styles.workoutListItemTitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.coral.standard} />}
                />
              </Swipeable>
            ) : (
              <ListItem
                title="WORKOUT"
                subtitle="Press here to see available workouts"
                onPress={() => this.props.navigation.navigate('WorkoutsHome')}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.medium} />}
              />
          )
        }
        </List>
        <Text style={styles.headerText}>
          MEALS
        </Text>
        <List containerStyle={styles.listContainer}>
          {
            breakfast ? (
              <Swipeable
                rightButtons={deleteButton('breakfast')}
                rightButtonWidth={75}
                rightContainerStyle={styles.deleteButtonContainer}
                onSwipeStart={() => this.setState({ isSwiping: true })}
                onSwipeRelease={() => this.setState({ isSwiping: false })}
              >
                <ListItem
                  title={breakfast.title.toUpperCase()}
                  subtitle={breakfast.subtitle}
                  onPress={() => this.props.navigation.push('Recipe', { recipe: breakfast })}
                  containerStyle={styles.listItem}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={styles.recipeListItemTitle}
                  subtitleStyle={styles.recipeListItemSubtitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.violet.standard} />}
                />
              </Swipeable>
            ) : (
              <ListItem
                title="BREAKFAST"
                subtitle="Press here to see available recipes"
                onPress={() => this.props.navigation.navigate('NutritionHome')}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.medium} />}
              />
            )
          }
          {
            lunch ? (
              <Swipeable
                rightButtons={deleteButton('lunch')}
                rightButtonWidth={75}
                rightContainerStyle={styles.deleteButtonContainer}
                onSwipeStart={() => this.setState({ isSwiping: true })}
                onSwipeRelease={() => this.setState({ isSwiping: false })}
              >
                <ListItem
                  title={lunch.title.toUpperCase()}
                  subtitle={lunch.subtitle}
                  onPress={() => this.props.navigation.push('Recipe', { recipe: lunch })}
                  containerStyle={styles.listItem}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={styles.recipeListItemTitle}
                  subtitleStyle={styles.recipeListItemSubtitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.violet.standard} />}
                />
              </Swipeable>
            ) : (
              <ListItem
                title="LUNCH"
                subtitle="Press here to see available recipes"
                onPress={() => this.props.navigation.navigate('NutritionHome')}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.medium} />}
              />
            )
          }
          {
            dinner ? (
              <Swipeable
                rightButtons={deleteButton('dinner')}
                rightButtonWidth={75}
                rightContainerStyle={styles.deleteButtonContainer}
                onSwipeStart={() => this.setState({ isSwiping: true })}
                onSwipeRelease={() => this.setState({ isSwiping: false })}
              >
                <ListItem
                  title={dinner.title.toUpperCase()}
                  subtitle={dinner.subtitle}
                  onPress={() => this.props.navigation.push('Recipe', { recipe: dinner })}
                  containerStyle={styles.listItem}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={styles.recipeListItemTitle}
                  subtitleStyle={styles.recipeListItemSubtitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.violet.standard} />}
                />
              </Swipeable>
            ) : (
              <ListItem
                title="DINNER"
                subtitle="Press here to see available recipes"
                onPress={() => this.props.navigation.navigate('NutritionHome')}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.medium} />}
              />
            )
          }
          {
            snack ? (
              <Swipeable
                rightButtons={deleteButton('snack')}
                rightButtonWidth={75}
                rightContainerStyle={styles.deleteButtonContainer}
                onSwipeStart={() => this.setState({ isSwiping: true })}
                onSwipeRelease={() => this.setState({ isSwiping: false })}
              >
                <ListItem
                  title={snack.title.toUpperCase()}
                  subtitle={snack.subtitle}
                  onPress={() => this.props.navigation.push('Recipe', { recipe: snack })}
                  containerStyle={styles.listItem}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={styles.recipeListItemTitle}
                  subtitleStyle={styles.recipeListItemSubtitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.violet.standard} />}
                />
              </Swipeable>
            ) : (
              <ListItem
                title="SNACK"
                subtitle="Press here to see available recipes"
                onPress={() => this.props.navigation.navigate('NutritionHome')}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.medium} />}
              />
            )
          }
        </List>
      </ScrollView>
    );
    return (
      <View style={styles.container}>
        <View style={styles.calendarStripContainer}>
          <CalendarStrip
            ref={this.calendarStrip}
            maxDayComponentSize={50}
            onDateSelected={(date) => this.handleDateSelected(date)}
            daySelectionAnimation={{
              type: 'background',
              duration: 400,
              highlightColor: colors.green.standard,
            }}
            style={{
              height: 90,
              paddingTop: 10,
              paddingBottom: 20,
            }}
            calendarHeaderStyle={{
              fontFamily: fonts.bold,
              color: colors.white,
              marginTop: 0,
              marginBottom: 15,
            }}
            calendarColor={colors.green.dark}
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
        {loading && loadingView}
        <Modal
          isVisible={helperModalVisible}
          animationIn="fadeIn"
          animationInTiming={800}
          animationOut="fadeOut"
          animationOutTiming={800}
        >
          <View style={styles.helperModalContainer}>
            <View style={styles.helperModalTextContainer}>
              <Text style={styles.modalHeaderText}>
                Calendar
              </Text>
              <Text style={styles.modalBodyText}>
                {'Keep track of your scheduled workouts and meals using this tab.\n'}
              </Text>
              <Text style={styles.modalBodyText}>
                {'You can go directly to your workouts or meals from this tab once you have added them.\n'}
              </Text>
              <Text style={styles.modalBodyText}>
                {'To add a meal or workout, go to the recipe/workout page via the Nutrition/Workout tab and press the \'Add to Calendar\' button'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.toggleHelperModal()}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>
                Ok, got it!
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  calendarStripContainer: {
    shadowColor: colors.grey.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
  },
  dayDisplayContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.dark,
    marginTop: 10,
    marginBottom: 8,
  },
  listContainer: {
    width,
    marginTop: 0,
    borderTopColor: colors.grey.standard,
  },
  listItem: {
    width,
    height: 65,
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderBottomColor: colors.grey.standard,
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
    color: colors.coral.standard,
    marginBottom: 5,
  },
  workoutSubtitleContainer: {
    flexDirection: 'row',
    marginLeft: 8,
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
    color: colors.violet.standard,
    marginBottom: 5,
  },
  recipeListItemSubtitle: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.charcoal.standard,
  },
  deleteButtonContainer: {
    backgroundColor: colors.coral.standard,
  },
  deleteButton: {
    width: 75,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coral.standard,
  },
  deleteButtonText: {
    fontFamily: fonts.bold,
    color: colors.white,
    marginTop: 4,
  },
  helperModalContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    overflow: 'hidden',
  },
  helperModalTextContainer: {
    width: '100%',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    padding: 15,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green.standard,
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
  modalHeaderText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  modalBodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginLeft: 5,
    marginRight: 5,
  },
});
