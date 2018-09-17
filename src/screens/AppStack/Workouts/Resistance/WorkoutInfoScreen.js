import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  AsyncStorage,
  DatePickerIOS,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { FileSystem, Video } from 'expo';
import Modal from 'react-native-modal';
import Carousel from 'react-native-carousel';
import { db } from '../../../../../config/firebase';
import Loader from '../../../../components/Loader';
import Icon from '../../../../components/Icon';
import { findFocus, findLocation } from '../../../../utils/workouts';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const moment = require('moment');

const { width } = Dimensions.get('window');

export default class WorkoutInfoScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      workout: null,
      reps: null,
      chosenDate: new Date(),
      modalVisible: false,
      addingToCalendar: false,
    };
  }
  componentDidMount = async () => {
    const workout = this.props.navigation.getParam('workout', null);
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ workout, reps });
    this.props.navigation.setParams({
      handleStart: () => this.props.navigation.navigate('Countdown', { exerciseList: workout.exercises, reps }),
    });
  }
  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }));
  }
  addWorkoutToCalendar = async (date) => {
    if (this.state.addingToCalendar) {
      return;
    }
    this.setState({ addingToCalendar: true });
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const { workout } = this.state;
    const uid = await AsyncStorage.getItem('uid');
    const calendarRef = db.collection('users').doc(uid).collection('calendarEntries').doc(formattedDate);
    const data = {
      workout,
    };
    await calendarRef.set(data, { merge: true });
    this.setState({ addingToCalendar: false });
    Alert.alert(
      'Added to calendar!',
      `${workout.name}\n${formattedDate}`,
      [
        { text: 'Ok', onPress: () => this.setState({ modalVisible: false }), style: 'cancel' },
      ],
      { cancelable: false },
    );
  }
  render() {
    const {
      loading,
      workout,
      reps,
      chosenDate,
      modalVisible,
      addingToCalendar,
    } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
      );
    }
    let workoutName;
    let exerciseDisplay;
    if (workout) {
      workoutName = workout.name;
      exerciseDisplay = workout.exercises.map((exercise, index) => {
        return (
          <Carousel
            key={exercise.id}
            width={width}
            inactiveIndicatorColor={colors.coral.standard}
            indicatorColor={colors.coral.standard}
            indicatorOffset={-2}
            indicatorSize={13}
            inactiveIndicatorText="○"
            indicatorText="●"
            animate={false}
          >
            <View
              key={exercise.id}
              style={styles.exerciseTile}
            >
              <View style={styles.exerciseTileHeaderBar}>
                <View>
                  <Text style={styles.exerciseTileHeaderTextLeft}>
                    {index + 1}. {exercise.name}
                  </Text>
                </View>
                <View>
                  <Text style={styles.exerciseTileHeaderBarRight}>
                    {reps} reps
                  </Text>
                </View>
              </View>
              <Video
                source={{ uri: `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4` }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="contain"
                shouldPlay
                isLooping
                style={{ width: width - 30, height: width - 30 }}
              />
            </View>
            <View
              style={{
                height: '100%',
                width,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
            >
              <Text>This is an exercise description</Text>
            </View>
          </Carousel>
        );
      });
    }
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
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
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
              <View style={styles.addToCalendarModalButtonContainer}>
                <Button
                  title="Add to calendar"
                  onPress={() => this.addWorkoutToCalendar(chosenDate)}
                  loading={addingToCalendar}
                  buttonStyle={styles.addToCalendarModalButton}
                />
              </View>
            </View>
          </Modal>
          <View style={styles.workoutInfoContainer}>
            <View style={styles.workoutNameContainer}>
              <Text style={styles.workoutName}>
                {workout && workoutName.toUpperCase()}
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
            </View>
            <View style={styles.workoutIconsRow}>
              <View style={styles.workoutIconContainer}>
                <Icon
                  name="workouts-time"
                  size={40}
                  color={colors.charcoal.standard}
                />
                <Text style={styles.workoutInfoFieldData}>
                  18 Mins
                </Text>
              </View>
              <View style={styles.workoutIconContainer}>
                <Icon
                  name="workouts-reps"
                  size={40}
                  color={colors.charcoal.standard}
                />
                <Text style={styles.workoutInfoFieldData}>
                  {reps * 18} Reps
                </Text>
              </View>
              <View style={styles.workoutIconContainer}>
                <Icon
                  name={workout && findLocationIcon()}
                  size={40}
                  color={colors.charcoal.standard}
                />
                <Text style={styles.workoutInfoFieldData}>
                  {findLocation(workout)}
                </Text>
              </View>
              <View style={styles.workoutIconContainer}>
                <Icon
                  name={workout && findFocusIcon()}
                  size={40}
                  color={colors.charcoal.standard}
                />
                <Text style={styles.workoutInfoFieldData}>
                  {findFocus(workout)}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.workoutPreviewContainer}>
            <Text style={styles.workoutPreviewHeaderText}>
              WORKOUT PREVIEW
            </Text>
            {exerciseDisplay}
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
  },
  scrollView: {
    alignItems: 'center',
    paddingTop: 7.5,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
  },
  addToCalendarModalButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  addToCalendarModalButton: {
    width: width - 60,
    backgroundColor: colors.coral.standard,
    borderRadius: 4,
  },
  workoutInfoContainer: {
    backgroundColor: colors.white,
  },
  workoutNameContainer: {
    width,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 10,
    paddingRight: 20,
  },
  workoutName: {
    marginTop: 6,
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.coral.standard,
  },
  addToCalendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 150,
    padding: 3,
    borderWidth: 2,
    borderColor: colors.charcoal.light,
    borderRadius: 4,
  },
  addToCalendarButtonText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginTop: 3,
    marginLeft: 5,
  },
  workoutIconsRow: {
    width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 15,
  },
  workoutIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfoFieldData: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.charcoal.standard,
    marginTop: 8,
  },
  workoutPreviewContainer: {
    width,
    backgroundColor: colors.grey.light,
    paddingTop: 13,
    paddingBottom: 15,
  },
  workoutPreviewHeaderText: {
    textAlign: 'center',
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.dark,
  },
  exerciseTile: {
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.coral.standard,
    overflow: 'hidden',
  },
  exerciseTileHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingBottom: 5,
    backgroundColor: colors.coral.standard,
  },
  exerciseTileHeaderTextLeft: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: 'white',
  },
  exerciseTileHeaderBarRight: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: 'white',
  },
});
