import React from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView, AsyncStorage, DatePickerIOS, Button } from 'react-native';
import { FileSystem, Video } from 'expo';
import Modal from 'react-native-modal';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import Icon from '../../../components/Icon';
import { findFocus, findLocation } from '../../../utils/workouts';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

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
    };
  }
  componentDidMount = async () => {
    const workout = this.props.navigation.getParam('workout', null);
    const reps = this.props.navigation.getParam('reps', null);
    this.setState({ workout, reps });
    this.props.navigation.setParams({
      handleStart: () => this.props.navigation.navigate('Exercise1', { exerciseList: workout.exercises, reps }),
    });
  }
  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
  }
  toggleModal = () => {
    this.setState((prevState) => ({ modalVisible: !prevState.modalVisible }));
  }
  addWorkoutToCalendar = async (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const { workout } = this.state;
    const uid = await AsyncStorage.getItem('uid');
    const calendarRef = db.collection('users').doc(uid).collection('calendarEntries').doc(formattedDate);
    const data = {
      workout,
    };
    await calendarRef.set(data, { merge: true });
  }
  render() {
    const {
      loading,
      workout,
      reps,
      chosenDate,
      modalVisible,
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
              style={{ width, height: width }}
            />
          </View>
        );
      });
    }
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          <Modal
            isVisible={modalVisible}
            onBackdropPress={() => this.toggleModal()}
          >
            <View
              style={{
                backgroundColor: colors.white,
                borderRadius: 8,
              }}
            >
              <DatePickerIOS
                mode="date"
                date={chosenDate}
                onDateChange={this.setDate}
                minimumDate={new Date()}
              />
              <Button
                title="Add to calendar"
                onPress={() => this.addWorkoutToCalendar(chosenDate)}
              />
            </View>
          </Modal>
          <Text style={styles.workoutName}>
            {workoutName}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width: width - 30,
              marginTop: 15,
              paddingTop: 8,
              paddingBottom: 5,
              borderTopWidth: 1,
              borderTopColor: colors.grey.light,
              borderBottomWidth: 1,
              borderBottomColor: colors.grey.light,
            }}
          >
            <Icon
              name="add-circle"
              size={22}
              color={colors.charcoal.standard}
            />
            <Text
              style={styles.workoutInfoFieldData}
              onPress={() => this.toggleModal()}
            >
              Add to Calendar
            </Text>
          </View>
          <View style={styles.workoutInfoSectionMiddle}>
            <Text style={styles.workoutInfoField}>
              Time
            </Text>
            <Text style={styles.workoutInfoFieldData}>
              6 minutes
            </Text>
          </View>
          <View style={styles.workoutInfoSectionMiddle}>
            <Text style={styles.workoutInfoField}>
              Total Reps
            </Text>
            <Text style={styles.workoutInfoFieldData}>
              {reps * 6}
            </Text>
          </View>
          <View style={styles.workoutInfoSectionMiddle}>
            <Text style={styles.workoutInfoField}>
              Workout Location
            </Text>
            <Text style={styles.workoutInfoFieldData}>
              {findLocation(workout)}
            </Text>
          </View>
          <View style={styles.workoutInfoSectionBottom}>
            <Text style={styles.workoutInfoField}>
              Focus
            </Text>
            <Text style={styles.workoutInfoFieldData}>
              {findFocus(workout)}
            </Text>
          </View>
          <View style={styles.workoutPreviewHeaderContainer}>
            <Text style={styles.workoutPreviewHeaderText}>
              Workout Preview
            </Text>
          </View>
          {exerciseDisplay}
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
    paddingBottom: 7.5,
  },
  workoutName: {
    fontFamily: fonts.knucklebones,
    fontSize: 72,
    paddingRight: 10,
  },
  workoutInfoSectionTop: {
    width: width - 30,
    marginTop: 15,
    paddingTop: 8,
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: colors.grey.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfoSectionMiddle: {
    width: width - 30,
    paddingTop: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfoSectionBottom: {
    width: width - 30,
    marginBottom: 15,
    paddingTop: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfoField: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
  },
  workoutInfoFieldData: {
    margin: 3,
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.standard,
  },
  workoutPreviewHeaderContainer: {
    width,
    backgroundColor: colors.coral.standard,
    marginBottom: 7.5,
  },
  workoutPreviewHeaderText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.white,
    paddingTop: 8,
    paddingBottom: 5,
  },
  exerciseTile: {
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
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
