import React from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { FileSystem, Calendar, Permissions } from 'expo';
import CalendarStrip from 'react-native-calendar-strip';
import { db, auth } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import Icon from '../../../components/Icon';
import { findReps } from '../../../utils';
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
    };
    this.calendarStrip = React.createRef();
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
      this.props.navigation.push('WorkoutInfo', { workout, reps });
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
  render() {
    const {
      loading,
      workout,
      breakfast,
      lunch,
      dinner,
      snack,
    } = this.state;
    const loadingView = (
      <Loader
        loading={loading}
        color={colors.green.standard}
      />
    );
    const dayDisplay = (
      <View style={styles.dayDisplayContainer}>
        <Text style={styles.headerText}>
          WORKOUT
        </Text>
        <List containerStyle={styles.listContainer}>
          {
            workout ? (
              <ListItem
                title={workout.name.toUpperCase()}
                // subtitle={
                //   <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                //     <Icon name="timer" size={18} color={colors.charcoal.standard} />
                //     <Text style={{ color: colors.charcoal.standard, marginTop: 1, marginLeft: 5, marginRight: 5 }}>Home</Text>
                //     <Icon name="timer" size={18} color={colors.charcoal.standard} />
                //     <Text style={{ color: colors.charcoal.standard, marginTop: 1, marginLeft: 5, marginRight: 5 }}>Upper</Text>
                //   </View>
                // }
                onPress={() => this.loadExercises(workout)}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.workoutListItemTitle}
                rightIcon={<Icon name="chevron-right" size={18} color={colors.coral.standard} />}
              />
            ) : (
              <ListItem
                title="WORKOUT"
                subtitle="Press here to see available workouts"
                onPress={() => this.props.navigation.push('WorkoutsHome')}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.standard} />}
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
            ) : (
              <ListItem
                title="BREAKFAST"
                subtitle="Press here to see available recipes"
                onPress={() => this.props.navigation.push('RecipeSelection', { meal: 'breakfast' })}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.standard} />}
              />
            )
          }
          {
            lunch ? (
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
            ) : (
              <ListItem
                title="LUNCH"
                subtitle="Press here to see available recipes"
                onPress={() => this.props.navigation.push('RecipeSelection', { meal: 'lunch' })}
                containerStyle={styles.blankListItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.standard} />}
              />
            )
          }
          {
            dinner ? (
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
            ) : (
              <ListItem
                title="DINNER"
                subtitle="Press here to see available recipes"
                onPress={() => this.props.navigation.push('RecipeSelection', { meal: 'dinner' })}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.standard} />}
              />
            )
          }
          {
            snack ? (
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
            ) : (
              <ListItem
                title="SNACK"
                subtitle="Press here to see available recipes"
                onPress={() => this.props.navigation.push('RecipeSelection', { meal: 'snack' })}
                containerStyle={styles.listItem}
                chevronColor={colors.charcoal.standard}
                titleStyle={styles.blankListItemTitle}
                subtitleStyle={styles.blankListItemSubtitle}
                rightIcon={<Icon name="add-circle" size={18} color={colors.grey.standard} />}
              />
            )
          }
        </List>
      </View>
    );
    return (
      <View style={styles.container}>
        <CalendarStrip
          ref={this.calendarStrip}
          maxDayComponentSize={50}
          onDateSelected={(date) => this.handleDateSelected(date)}
          calendarAnimation={{
            type: 'parallel',
            duration: 500,
          }}
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
        {loading ? loadingView : dayDisplay}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  dayDisplayContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: fonts.standard,
    color: colors.charcoal.light,
    marginTop: 10,
    marginBottom: 10,
  },
  listContainer: {
    width,
    marginTop: 0,
  },
  listItem: {
    width,
    height: 60,
    justifyContent: 'center',
  },
  blankListItemTitle: {
    fontFamily: fonts.bold,
    color: colors.grey.standard,
  },
  blankListItemSubtitle: {
    fontFamily: fonts.standard,
    color: colors.grey.standard,
  },
  workoutListItemTitle: {
    fontFamily: fonts.bold,
    color: colors.coral.standard,
  },
  workoutListItemSubtitle: {
    fontFamily: fonts.standard,
    color: colors.coral.standard,
  },
  recipeListItemTitle: {
    fontFamily: fonts.bold,
    color: colors.violet.standard,
  },
  recipeListItemSubtitle: {
    fontFamily: fonts.standard,
    color: colors.charcoal.standard,
  },
});
