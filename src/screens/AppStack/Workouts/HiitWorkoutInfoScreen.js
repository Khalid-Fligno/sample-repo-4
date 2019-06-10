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
import { FileSystem } from 'expo';
import Video from 'react-native-video';
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
  1: 40,
  2: 60,
  3: 80,
};

const restIntervalMap = {
  1: 80,
  2: 60,
  3: 40,
};

export default class HiitWorkoutInfoScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      workout: this.props.navigation.getParam('workout', null),
      fitnessLevel: this.props.navigation.getParam('fitnessLevel', null),
      chosenDate: new Date(),
      calendarModalVisible: false,
      addingToCalendar: false,
      musicModalVisible: false,
      appleMusicAvailable: undefined,
      spotifyAvailable: undefined,
    };
  }
  componentDidMount = async () => {
    await this.props.navigation.setParams({
      handleStart: () => this.handleStart(),
    });
    this.checkMusicAppAvailability();
  }
  setDate = (newDate) => {
    this.setState({ chosenDate: newDate });
  }
  checkMusicAppAvailability = async () => {
    this.setState({
      appleMusicAvailable: await Linking.canOpenURL('music:'),
      spotifyAvailable: await Linking.canOpenURL('spotify:'),
    });
  }
  openApp = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Cannot open this app');
      }
    }).catch((err) => Alert.alert('An error occurred', err));
  }
  handleStart = () => {
    this.toggleMusicModal();
  }
  showCalendarModal = () => {
    this.setState({ calendarModalVisible: true });
  }
  hideCalendarModal = () => {
    this.setState({ calendarModalVisible: false });
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
      '',
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
      appleMusicAvailable,
      spotifyAvailable,
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
                    {index === 0 && `${workIntervalMap[fitnessLevel]}s`}
                    {index === 1 && `${restIntervalMap[fitnessLevel]}s`}
                  </Text>
                </View>
              </View>
              {
                index === 0 && (
                  <Video
                    ref={(ref) => this.videoRef = ref}
                    source={{ uri: `${FileSystem.cacheDirectory}exercise-hiit-1.mp4` }}
                    isMuted
                    resizeMode="contain"
                    repeat
                    style={{ width: width - 30, height: width - 30 }}
                  />
                )
              }
              {
                index === 1 && (
                  <Image
                    source={require('../../../../assets/images/hiit-rest-placeholder.jpg')}
                    style={{ width: width - 30, height: width - 30 }}
                  />
                )
              }
            </View>
            <View style={styles.exerciseDescriptionContainer}>
              <View style={styles.exerciseTileHeaderBar}>
                <View>
                  <Text style={styles.exerciseTileHeaderTextLeft}>
                    ADDITIONAL INFORMATION
                  </Text>
                </View>
              </View>
              <View style={styles.exerciseDescriptionTextContainer}>
                {
                  exercise.recommendedResistance && (
                    <Text style={styles.exerciseDescriptionHeader}>Recommended resistance:</Text>
                  )
                }
                {
                  exercise.recommendedResistance && (
                    <Text style={styles.exerciseDescriptionText}>{exercise.recommendedResistance}</Text>
                  )
                }
                {
                  exercise.coachingTip && (
                    <Text style={styles.exerciseDescriptionHeader}>Coaching tip:</Text>
                  )
                }
                {
                  exercise.coachingTip && exercise.coachingTip.map((tip) => (
                    <Text
                      key={tip}
                      style={styles.exerciseDescriptionText}
                    >
                      {`• ${tip}`}
                    </Text>
                  ))
                }
                {
                  exercise.scaledVersion && (
                    <Text style={styles.exerciseDescriptionHeader}>Scaled version:</Text>
                  )
                }
                {
                  exercise.scaledVersion && (
                    <Text style={styles.exerciseDescriptionText}>{exercise.scaledVersion}</Text>
                  )
                }
                {
                  exercise.otherInfo && exercise.otherInfo.map((text) => (
                    <Text
                      key={text}
                      style={styles.exerciseDescriptionHeader}
                    >
                      {text}
                    </Text>
                  ))
                }
              </View>
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
            onBackdropPress={this.hideCalendarModal}
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
                {workout && workout.displayName.toUpperCase()}
              </Text>
              <AddToCalendarButton onPress={this.showCalendarModal} />
            </View>
            <View style={styles.workoutIconsRow}>
              <View style={styles.workoutIconContainer}>
                <Icon
                  name="workouts-hiit"
                  size={36}
                  color={colors.charcoal.standard}
                  style={styles.hiitIcon}
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
              <View style={styles.musicIconContainer}>
                <TouchableOpacity
                  style={[
                    styles.appleMusicIcon,
                    !appleMusicAvailable && styles.appleMusicDisabled,
                  ]}
                  disabled={!appleMusicAvailable}
                  onPress={() => this.openApp('music:')}
                >
                  <Image
                    source={require('../../../../assets/icons/apple-music-icon.png')}
                    style={styles.musicIconImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.openApp('spotify:')}
                  disabled={!spotifyAvailable}
                  style={[
                    styles.spotifyIcon,
                    !spotifyAvailable && styles.spotifyDisabled,
                  ]}
                >
                  <Image
                    source={require('../../../../assets/icons/spotify-icon.png')}
                    style={styles.musicIconImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.musicModalButtonContainer}>
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
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
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
    paddingLeft: 15,
    paddingBottom: 10,
    paddingRight: 15,
  },
  workoutName: {
    marginTop: 6,
    marginRight: 10,
    fontFamily: fonts.bold,
    fontSize: 20,
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
  hiitIcon: {
    margin: 2,
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
    fontFamily: fonts.standardNarrow,
    fontSize: 16,
    color: colors.white,
  },
  exerciseTileHeaderBarRight: {
    fontFamily: fonts.standardNarrow,
    fontSize: 16,
    color: colors.white,
  },
  exerciseDescriptionContainer: {
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.coral.standard,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  exerciseDescriptionTextContainer: {
    padding: 15,
  },
  exerciseDescriptionHeader: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.charcoal.standard,
  },
  exerciseDescriptionText: {
    fontFamily: fonts.standard,
    fontSize: 13,
    color: colors.charcoal.standard,
    marginTop: 3,
    marginBottom: 3,
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
  musicIconContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.grey.light,
    borderRadius: 4,
  },
  appleMusicIcon: {
    marginRight: 10,
    shadowColor: colors.grey.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  spotifyIcon: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
  appleMusicDisabled: {
    marginRight: 10,
    opacity: 0.1,
    shadowOpacity: 0,
  },
  spotifyDisabled: {
    opacity: 0.1,
    shadowOpacity: 0,
  },
  musicIconImage: {
    height: 60,
    width: 60,
  },
  musicModalButtonContainer: {
    backgroundColor: colors.white,
    width: '100%',
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
