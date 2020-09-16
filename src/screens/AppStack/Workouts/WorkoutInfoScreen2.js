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
import globalStyle from '../../../styles/globalStyles';
import WorkoutScreenStyle from './WorkoutScreenStyle';
const moment = require('moment');

const { width } = Dimensions.get('window');

export default class WorkoutInfoScreen2 extends React.PureComponent {
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
    <View style={WorkoutScreenStyle.carouselContainer}>
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
          style={WorkoutScreenStyle.exerciseTile}
        >
          <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
            <View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}
              >
                {index + 1}. {exercise.name}
              </Text>
            </View>
            <View>
              <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>
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
      if (workout.filters.indexOf('fullBody') > -1) {
        focus = 'full';
      } else if (workout.filters.indexOf('upperBody') > -1) {
        focus = 'upper';
      } else if (workout.filters.indexOf('lowerBody') > -1) {
        focus = 'lower';
      }
      return `workouts-${focus}`;
    };
    // const findFocusIcon = () => {
    //   let focus;
    //   if (workout.fullBody) {
    //     focus = 'full';
    //   } else if (workout.upperBody) {
    //     focus = 'upper';
    //   } else if (workout.lowerBody) {
    //     focus = 'lower';
    //   }
    //   return `workouts-${focus}`;
    // };
    return (
      <View style={[globalStyle.container,{paddingHorizontal:0}]}>
        <Modal
          isVisible={calendarModalVisible}
          animationIn="fadeIn"
          animationInTiming={600}
          animationOut="fadeOut"
          animationOutTiming={600}
          onBackdropPress={this.hideCalendarModal}
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
        {
          workout && (
            <View style={WorkoutScreenStyle.flatListContainer}>
              <FlatList
                data={workout.exercises}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListHeaderComponent={(
                  <View style={WorkoutScreenStyle.workoutInfoContainer}>
                    <View style={WorkoutScreenStyle.workoutNameContainer}>
                      <Text style={WorkoutScreenStyle.workoutName}>
                        {workout && workout.displayName.toUpperCase()}
                      </Text>
                      <AddToCalendarButton onPress={() => this.showCalendarModal()} />
                    </View>
                    <View style={WorkoutScreenStyle.workoutIconsRow}>
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <Icon
                          name="workouts-time"
                          size={40}
                          color={colors.charcoal.standard}
                        />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          18 Mins
                        </Text>
                      </View>
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <Icon
                          name="workouts-reps"
                          size={40}
                          color={colors.charcoal.standard}
                        />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          {reps * 18} Reps
                        </Text>
                      </View>
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <Icon
                          name={workout && findLocationIcon()}
                          size={40}
                          color={colors.charcoal.standard}
                        />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          {workout && findLocation(workout)}
                        </Text>
                      </View>
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <Icon
                          name={workout && findFocusIcon()}
                          size={40}
                          color={colors.charcoal.standard}
                        />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          {workout && findFocus(workout)}
                        </Text>
                      </View>
                    </View>
                    <View style={WorkoutScreenStyle.workoutPreviewHeaderContainer} >
                      <Text style={WorkoutScreenStyle.workoutPreviewHeaderText}>
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
                onPress={this.toggleMusicModal}
                style={WorkoutScreenStyle.musicModalCancelButton}
              >
                <Text style={WorkoutScreenStyle.musicModalButtonText}>
                  BACK
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.handleWorkoutStart}
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

