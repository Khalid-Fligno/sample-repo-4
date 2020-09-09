import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
  Platform,
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
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import globalStyle from '../../../styles/globalStyles';
import WorkoutScreenStyle from './WorkoutScreenStyle';

const moment = require('moment');

const { width, height } = Dimensions.get('window');

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
              style={WorkoutScreenStyle.exerciseTile}
            >
              <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
                <View>
                  <Text style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}>
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
                    playWhenInactive
                    resizeMode="contain"
                    repeat
                    muted
                    selectedAudioTrack={{
                      type: 'disabled',
                    }}
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
            <View style={WorkoutScreenStyle.exerciseDescriptionContainer}>
              <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
                <View>
                  <Text style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}>
                    ADDITIONAL INFORMATION
                  </Text>
                </View>
              </View>
              <View style={WorkoutScreenStyle.exerciseDescriptionTextContainer}>
                {
                  exercise.recommendedResistance && (
                    <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>Recommended resistance:</Text>
                  )
                }
                {
                  exercise.recommendedResistance && (
                    <Text style={WorkoutScreenStyle.exerciseDescriptionText}>{exercise.recommendedResistance}</Text>
                  )
                }
                {
                  exercise.coachingTip && (
                    <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>Coaching tip:</Text>
                  )
                }
                {
                  exercise.coachingTip && exercise.coachingTip.map((tip) => (
                    <Text
                      key={tip}
                      style={WorkoutScreenStyle.exerciseDescriptionText}
                    >
                      {`• ${tip}`}
                    </Text>
                  ))
                }
                {
                  exercise.scaledVersion && (
                    <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>Scaled version:</Text>
                  )
                }
                {
                  exercise.scaledVersion && (
                    <Text style={WorkoutScreenStyle.exerciseDescriptionText}>{exercise.scaledVersion}</Text>
                  )
                }
                {
                  exercise.otherInfo && exercise.otherInfo.map((text) => (
                    <Text
                      key={text}
                      style={WorkoutScreenStyle.exerciseDescriptionHeader}
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
      <View style={[globalStyle.container,{paddingHorizontal:0}]}>
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
            <View style={globalStyle.modalContainer}>
              <DateTimePicker
                mode="date"
                value={chosenDate}
                onChange={this.setDate}
                minimumDate={new Date()}
              />
              <TouchableOpacity
                onPress={() => this.addWorkoutToCalendar(chosenDate)}
                style={globalStyle.modalButton}
              >
                {
                  addingToCalendar ? (
                    <DotIndicator
                      color={colors.white}
                      count={3}
                      size={6}
                    />
                  ) : (
                    <Text style={globalStyle.modalButtonText}>
                      ADD TO CALENDAR
                    </Text>
                  )
                }
              </TouchableOpacity>
            </View>
          </Modal>
          <View style={WorkoutScreenStyle.workoutInfoContainer}>
            <View style={WorkoutScreenStyle.workoutNameContainer}>
              <Text style={WorkoutScreenStyle.workoutName}>
                {workout && workout.displayName.toUpperCase()}
              </Text>
              <AddToCalendarButton onPress={this.showCalendarModal} />
            </View>
            <View style={WorkoutScreenStyle.workoutIconsRow}>
              <View style={WorkoutScreenStyle.workoutIconContainer}>
                <Icon
                  name="workouts-hiit"
                  size={36}
                  color={colors.charcoal.standard}
                  style={WorkoutScreenStyle.hiitIcon}
                />
                <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                  HIIT
                </Text>
              </View>
              <View style={WorkoutScreenStyle.workoutIconContainer}>
                <Icon
                  name="workouts-time"
                  size={40}
                  color={colors.charcoal.standard}
                />
                <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                  16 mins
                </Text>
              </View>
              <View style={WorkoutScreenStyle.workoutIconContainer}>
                <Icon
                  name="workouts-reps"
                  size={40}
                  color={colors.charcoal.standard}
                />
                <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                  8 rounds
                </Text>
              </View>
            </View>
          </View>
          <View style={WorkoutScreenStyle.workoutPreviewContainer}>
            <Text style={WorkoutScreenStyle.workoutPreviewHeaderText}>
              WORKOUT PREVIEW
            </Text>
            <View style={styles.carouselContainer }>
              {exerciseDisplay}
            </View>
          </View>
        </ScrollView>
        <Modal
          isVisible={musicModalVisible}
          animationIn="fadeIn"
          animationInTiming={800}
          animationOut="fadeOut"
          animationOutTiming={800}
        >
          <View style={WorkoutScreenStyle.musicModalContainer}>
            <View style={WorkoutScreenStyle.musicModalTextContainer}>
              <Text style={WorkoutScreenStyle.musicModalHeaderText}>
                Choose your music
              </Text>
              <View style={WorkoutScreenStyle.musicIconContainer}>
                <TouchableOpacity
                  style={[
                    WorkoutScreenStyle.appleMusicIcon,
                    !appleMusicAvailable && WorkoutScreenStyle.appleMusicDisabled,
                  ]}
                  disabled={!appleMusicAvailable}
                  onPress={() => this.openApp('music:')}
                >
                  <Image
                    source={require('../../../../assets/icons/apple-music-icon.png')}
                    style={WorkoutScreenStyle.musicIconImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.openApp('spotify:open')}
                  disabled={!spotifyAvailable}
                  style={[
                    WorkoutScreenStyle.spotifyIcon,
                    !spotifyAvailable && WorkoutScreenStyle.spotifyDisabled,
                  ]}
                >
                  <Image
                    source={require('../../../../assets/icons/spotify-icon.png')}
                    style={WorkoutScreenStyle.musicIconImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={WorkoutScreenStyle.musicModalButtonContainer}>
              <TouchableOpacity
                onPress={() => this.toggleMusicModal()}
                style={WorkoutScreenStyle.musicModalCancelButton}
              >
                <Text style={WorkoutScreenStyle.musicModalButtonText}>
                  BACK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.handleHiitWorkoutStart(workout, fitnessLevel)}
                style={WorkoutScreenStyle.musicModalContinueButton}
              >
                <Text style={WorkoutScreenStyle.musicModalButtonText}>
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
  scrollView: {
    alignItems: 'center',
    paddingTop: 7.5,
  },
  exerciseTileHeaderBarRight: {
    fontFamily: fonts.standardNarrow,
    fontSize: 16,
    color: colors.white,
  },
  carouselContainer: {
    width: width,
    ...Platform.select({
      android: {
        height: (width + 30) * 2
      }
    })
  }
});
