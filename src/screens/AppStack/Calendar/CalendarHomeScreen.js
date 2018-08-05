import React from 'react';
import { StyleSheet, View, AsyncStorage, ActivityIndicator, Dimensions, TouchableOpacity, Text } from 'react-native';
import { FileSystem } from 'expo';
import CalendarStrip from 'react-native-calendar-strip';
import { db, auth } from '../../../../config/firebase';
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
    await db.collection('users').doc(uid)
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
  handleDateSelected = async (date) => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = date.format('YYYY-MM-DD').toString();
    await db.collection('users').doc(uid)
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
      <View style={styles.loadingViewContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
    const dayDisplay = (
      <View style={styles.dayDisplayContainer}>
        <Text>Workout</Text>
        {
          workout ? (
            <TouchableOpacity
              onPress={() => this.loadExercises(workout)}
              style={styles.workoutTile}
            >
              <Text style={styles.tileText}>
                {workout && workout.name}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('WorkoutsHome')}
              style={styles.blankTile}
            >
              <Icon
                name="add-circle"
                size={22}
                color={colors.grey.standard}
              />
              <Text style={styles.blankTileText}>
                Add a workout
              </Text>
            </TouchableOpacity>
          )
        }
        <Text>Meals</Text>
        {
          breakfast ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Recipe', { recipe: breakfast })}
              style={styles.nutritionTile}
            >
              <Text style={styles.tileText}>
                {breakfast && breakfast.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('RecipeSelection', { meal: 'breakfast' })}
              style={styles.blankTile}
            >
              <Icon
                name="add-circle"
                size={22}
                color={colors.grey.standard}
              />
              <Text style={styles.blankTileText}>
                Add a breakfast recipe
              </Text>
            </TouchableOpacity>
          )
        }
        {
          lunch ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Recipe', { recipe: lunch })}
              style={styles.nutritionTile}
            >
              <Text style={styles.tileText}>
                {lunch && lunch.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('RecipeSelection', { meal: 'lunch' })}
              style={styles.blankTile}
            >
              <Icon
                name="add-circle"
                size={22}
                color={colors.grey.standard}
              />
              <Text style={styles.blankTileText}>
                Add a lunch recipe
              </Text>
            </TouchableOpacity>
          )
        }
        {
          dinner ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Recipe', { recipe: dinner })}
              style={styles.nutritionTile}
            >
              <Text style={styles.tileText}>
                {dinner && dinner.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('RecipeSelection', { meal: 'dinner' })}
              style={styles.blankTile}
            >
              <Icon
                name="add-circle"
                size={22}
                color={colors.grey.standard}
              />
              <Text style={styles.blankTileText}>
                Add a dinner recipe
              </Text>
            </TouchableOpacity>
          )
        }
        {
          snack ? (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('Recipe', { recipe: snack })}
              style={styles.nutritionTile}
            >
              <Text style={styles.tileText}>
                {snack && snack.title}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.props.navigation.push('RecipeSelection', { meal: 'snack' })}
              style={styles.blankTile}
            >
              <Icon
                name="add-circle"
                size={22}
                color={colors.grey.standard}
              />
              <Text style={styles.blankTileText}>
                Add a snack recipe
              </Text>
            </TouchableOpacity>
          )
        }
      </View>
    );
    return (
      <View style={styles.container}>
        <CalendarStrip
          ref={this.calendarStrip}
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
    backgroundColor: colors.white,
  },
  loadingViewContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDisplayContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 7.5,
    paddingBottom: 7.5,
  },
  workoutTile: {
    opacity: 0.9,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
    backgroundColor: colors.coral.standard,
    borderRadius: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  nutritionTile: {
    opacity: 0.9,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
    backgroundColor: colors.violet.standard,
    borderRadius: 4,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  tileText: {
    fontFamily: fonts.boldItalic,
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
  },
  blankTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
    backgroundColor: colors.offWhite,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.grey.light,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  blankTileText: {
    marginTop: 4,
    marginLeft: 10,
    fontFamily: fonts.standard,
    fontSize: 20,
    color: colors.grey.standard,
  },
});
