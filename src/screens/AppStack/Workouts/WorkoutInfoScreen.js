import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import Carousel from 'react-native-carousel';
import { DotIndicator } from 'react-native-indicators';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import AddToCalendarButton from '../../../components/Shared/AddToCalendarButton';
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
      workout: this.props.navigation.getParam('workout', null),
      reps: this.props.navigation.getParam('reps', null),
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
  setDate = async (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({ chosenDate: currentDate });
  }
  checkMusicAppAvailability = async () => {
    this.setState({
      appleMusicAvailable: await Linking.canOpenURL('music:'),
      spotifyAvailable: await Linking.canOpenURL('spotify:'),
    });
  }
  handleStart = () => {
    this.toggleMusicModal();
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
  toggleMusicModal = () => {
    this.setState((prevState) => ({ musicModalVisible: !prevState.musicModalVisible }));
  }
  showCalendarModal = () => {
    this.setState({ calendarModalVisible: true });
  }
  hideCalendarModal = () => {
    this.setState({ calendarModalVisible: false });
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
    await calendarRef.set(data);
    this.setState({ addingToCalendar: false });
    Alert.alert(
      '',
      'Added to calendar!',
      [
        { text: 'OK', onPress: this.hideCalendarModal, style: 'cancel' },
      ],
      { cancelable: false },
    );
  }
  handleWorkoutStart = () => {
    const { workout, reps } = this.state;
    this.setState({ musicModalVisible: false });
    this.props.navigation.navigate('Countdown', { exerciseList: workout.exercises, reps, resistanceCategoryId: workout.resistanceCategoryId });
  }
  keyExtractor = (exercise) => exercise.id;
  renderItem = ({ item: exercise, index }) => (
    <View style={styles.carouselContainer}>
      <Carousel
        key={exercise.id}
        width={width}
        inactiveIndicatorColor={colors.coral.standard}
        indicatorColor={colors.coral.standard}
        indicatorOffset={-5}
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
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.exerciseTileHeaderTextLeft}
              >
                {index + 1}. {exercise.name}
              </Text>
            </View>
            <View>
              <Text style={styles.exerciseTileHeaderBarRight}>
                x{this.state.reps}
              </Text>
            </View>
          </View>
          <Video
            ref={(ref) => this.videoRef = ref}
            source={{ uri: `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4` }}
            playWhenInactive
            resizeMode="contain"
            repeat
            muted
            selectedAudioTrack={{
              type: 'disabled',
            }}
            style={{ width: width - 30, height: width - 30 }}
          />
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
    </View>
  );
  render() {
    const {
      loading,
      workout,
      reps,
      chosenDate,
      calendarModalVisible,
      addingToCalendar,
      musicModalVisible,
      appleMusicAvailable,
      spotifyAvailable,
    } = this.state;

    const findLocationIcon = () => {
      let location;
      if (workout.home) {
        location = 'home';
      } else if (workout.gym) {
        location = 'gym';
      } else if (workout.outdoors) {
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
      }
      return `workouts-${focus}`;
    };
    return (
      <View style={styles.container}>
        <Modal
          isVisible={calendarModalVisible}
          animationIn="fadeIn"
          animationInTiming={600}
          animationOut="fadeOut"
          animationOutTiming={600}
          onBackdropPress={this.hideCalendarModal}
        >
          <View style={styles.modalContainer}>
            <DateTimePicker
              mode="date"
              value={chosenDate}
              onChange={this.setDate}
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
        {
          workout && (
            <View style={styles.flatListContainer}>
              <FlatList
                data={workout.exercises}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListHeaderComponent={(
                  <View style={styles.workoutInfoContainer}>
                    <View style={styles.workoutNameContainer}>
                      <Text style={styles.workoutName}>
                        {workout && workout.displayName.toUpperCase()}
                      </Text>
                      <AddToCalendarButton onPress={() => this.showCalendarModal()} />
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
                          {workout && findLocation(workout)}
                        </Text>
                      </View>
                      <View style={styles.workoutIconContainer}>
                        <Icon
                          name={workout && findFocusIcon()}
                          size={40}
                          color={colors.charcoal.standard}
                        />
                        <Text style={styles.workoutInfoFieldData}>
                          {workout && findFocus(workout)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.workoutPreviewHeaderContainer} >
                      <Text style={styles.workoutPreviewHeaderText}>
                        WORKOUT PREVIEW
                      </Text>
                    </View>
                  </View>
                  )
                }
              />
            </View>
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
                  onPress={() => this.openApp('spotify:open')}
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
                onPress={this.toggleMusicModal}
                style={styles.musicModalCancelButton}
              >
                <Text style={styles.musicModalButtonText}>
                  BACK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleWorkoutStart}
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
  workoutInfoFieldData: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.charcoal.standard,
    marginTop: 8,
  },
  flatListContainer: {
    width,
    backgroundColor: colors.grey.light,
  },
  workoutPreviewHeaderContainer: {
    width,
    backgroundColor: colors.grey.light,
    paddingTop: 12,
  },
  workoutPreviewHeaderText: {
    textAlign: 'center',
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.dark,
  },
  carouselContainer: {
    paddingBottom: 8,
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
    width: width - 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingBottom: 5,
    backgroundColor: colors.coral.standard,
  },
  exerciseTileHeaderTextLeft: {
    width: width - 72,
    fontFamily: fonts.standardNarrow,
    fontSize: 14,
    color: colors.white,
  },
  exerciseTileHeaderBarRight: {
    width: 22,
    fontFamily: fonts.standardNarrow,
    fontSize: 14,
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
