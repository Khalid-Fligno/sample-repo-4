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
  Image,
  Linking,
} from 'react-native';
import { FileSystem, Video } from 'expo';
import Modal from 'react-native-modal';
import Carousel from 'react-native-carousel';
import { DotIndicator } from 'react-native-indicators';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import AddToCalendarButton from '../../../components/Shared/AddToCalendarButton';
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
      calendarModalVisible: false,
      addingToCalendar: false,
    };
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    const workout = this.props.navigation.getParam('workout', null);
    const fitnessLevel = await AsyncStorage.getItem('fitnessLevel', null);
    this.setState({ workout, loading: false, fitnessLevel });
    this.props.navigation.setParams({
      handleStart: () => this.toggleMusicModal(),
    });
  }
  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
  }
  toggleCalendarModal = () => {
    this.setState((prevState) => ({ calendarModalVisible: !prevState.calendarModalVisible }));
  }
  toggleMusicModal = () => {
    this.setState((prevState) => ({ musicModalVisible: !prevState.musicModalVisible }));
  }
  handleHiitWorkoutStart = (workout, fitnessLevel) => {
    this.setState({ musicModalVisible: false });
    this.props.navigation.navigate('HiitCountdown', { exerciseList: workout.exercises, fitnessLevel });
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
        { text: 'OK', onPress: () => this.setState({ calendarModalVisible: false }), style: 'cancel' },
      ],
      { cancelable: false },
    );
  }
  render() {
    const {
      loading,
      workout,
      chosenDate,
      calendarModalVisible,
      addingToCalendar,
      fitnessLevel,
      musicModalVisible,
    } = this.state;
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
            isVisible={calendarModalVisible}
            onBackdropPress={() => this.toggleCalendarModal()}
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
              <AddToCalendarButton onPress={() => this.toggleCalendarModal()} />
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
        {
          loading && (
            <Loader
              loading={loading}
              color={colors.coral.standard}
            />
          )
        }
        <Modal
          isVisible={musicModalVisible}
          animationIn="fadeIn"
          animationInTiming={800}
          animationOut="fadeOut"
          animationOutTiming={800}
        >
          <View style={styles.musicModalContainer}>
            <View style={styles.musicModalTextContainer}>
              <Text style={styles.musicModalHeaderText}>
                Choose your music
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 10,
                  backgroundColor: colors.grey.light,
                  borderRadius: 4,
                }}
              >
                <TouchableOpacity
                  style={{ marginRight: 10 }}
                  onPress={() => Linking.openURL('music:')}
                >
                  <Image
                    source={require('../../../../assets/icons/apple-music-icon.png')}
                    style={{
                      height: 50,
                      width: 50,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => Linking.openURL('spotify:')}
                >
                  <Image
                    source={require('../../../../assets/icons/spotify-icon.png')}
                    style={{
                      height: 50,
                      width: 50,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ backgroundColor: colors.white, width: '100%' }}>
              <TouchableOpacity
                onPress={() => this.toggleMusicModal()}
                style={styles.musicModalCancelButton}
              >
                <Text style={styles.musicModalButtonText}>
                  BACK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleHiitWorkoutStart(workout, fitnessLevel)}
                style={styles.musicModalContinueButton}
              >
                <Text style={styles.musicModalButtonText}>
                  CONTINUE
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    flexWrap: 'wrap',
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
  musicModalContainer: {
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 4,
    overflow: 'hidden',
  },
  musicModalHeaderText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  musicModalTextContainer: {
    width: '100%',
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    padding: 15,
  },
  musicModalCancelButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.charcoal.standard,
    height: 50,
    width: '100%',
  },
  musicModalContinueButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.coral.standard,
    height: 50,
    width: '100%',
  },
  musicModalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
});
