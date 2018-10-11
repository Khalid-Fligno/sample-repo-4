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
import { FileSystem, Video } from 'expo';
import Modal from 'react-native-modal';
import Carousel from 'react-native-carousel';
import { DotIndicator } from 'react-native-indicators';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const moment = require('moment');

const { width } = Dimensions.get('window');

const workIntervalMap = {
  1: 30,
  2: 60,
  3: 90,
};

const restIntervalMap = {
  1: 90,
  2: 60,
  3: 30,
};

export default class HiitWorkoutInfoScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      workout: null,
      fitnessLevel: null,
      chosenDate: new Date(),
      modalVisible: false,
      addingToCalendar: false,
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    const workout = this.props.navigation.getParam('workout', null);
    const fitnessLevel = await AsyncStorage.getItem('fitnessLevel', null);
    this.setState({ workout, loading: false, fitnessLevel: parseInt(fitnessLevel, 10) });
    this.props.navigation.setParams({
      handleStart: () => this.props.navigation.navigate('HiitCountdown', { exerciseList: workout.exercises, fitnessLevel }),
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
      `${workout.name.toUpperCase()}`,
      [
        { text: 'OK', onPress: () => this.setState({ modalVisible: false }), style: 'cancel' },
      ],
      { cancelable: false },
    );
  }
  render() {
    const {
      loading,
      workout,
      chosenDate,
      modalVisible,
      addingToCalendar,
      fitnessLevel,
    } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
      );
    }
    let exerciseDisplay;
    if (workout) {
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
                    {index === 0 && `${workIntervalMap[fitnessLevel]} seconds`}
                    {index === 1 && `${restIntervalMap[fitnessLevel]} seconds`}
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
              <TouchableOpacity
                onPress={() => this.addWorkoutToCalendar(chosenDate)}
                style={styles.modalButton}
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
          <View style={styles.workoutInfoContainer}>
            <View style={styles.workoutNameContainer}>
              <Text style={styles.workoutName}>
                {workout && workout.name.toUpperCase()}
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
                  name="workouts-hiit"
                  size={36}
                  color={colors.charcoal.standard}
                  style={{ margin: 2 }}
                />
                <Text style={styles.workoutInfoFieldData}>
                  HIIT
                </Text>
              </View>
              <View style={styles.workoutIconContainer}>
                <Icon
                  name="workouts-time"
                  size={40}
                  color={colors.charcoal.standard}
                />
                <Text style={styles.workoutInfoFieldData}>
                  16 mins
                </Text>
              </View>
              <View style={styles.workoutIconContainer}>
                <Icon
                  name="workouts-reps"
                  size={40}
                  color={colors.charcoal.standard}
                />
                <Text style={styles.workoutInfoFieldData}>
                  8 rounds
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
    borderRadius: 4,
    overflow: 'hidden',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
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
