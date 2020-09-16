import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  Linking,
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
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import globalStyle from '../../../styles/globalStyles';
import WorkoutScreenStyle from './WorkoutScreenStyle';

const moment = require('moment');

const { width, height } = Dimensions.get('window');

const workIntervalMap = {
  1: 30,
  2: 40,
  3: 50,
};

const restIntervalMap = {
  1: 30,
  2: 20,
  3: 10,
};

export default class HiitCircuitWorkoutInfoScreen extends React.PureComponent {
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
    this.props.navigation.navigate('HiitCircuitCountdown', { exerciseList: workout.exercises, fitnessLevel });
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
  keyExtractor = (item) => item.id;
  renderItem = ({ item: exercise, index }) => (
    <View style={styles.carouselContainer}>
      <Carousel
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
                {workIntervalMap[this.state.fitnessLevel]}s on/{restIntervalMap[this.state.fitnessLevel]}s off
              </Text>
            </View>
          </View>
          <Video
            ref={(ref) => this.videoRef = ref}
            source={{ uri: `${FileSystem.cacheDirectory}exercise-hiit-circuit-${index + 1}.mp4` }}
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
      chosenDate,
      calendarModalVisible,
      addingToCalendar,
      fitnessLevel,
      musicModalVisible,
      appleMusicAvailable,
      spotifyAvailable,
    } = this.state;
    return (
      <View style={[globalStyle.container,{paddingHorizontal:0}]}>
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
        {
          workout && (
            <View style={[WorkoutScreenStyle.flatListContainer,{paddingBottom:12}]}>
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
                          HIIT CIRCUIT
                        </Text>
                      </View>
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <Icon
                          name="workouts-time"
                          size={40}
                          color={colors.charcoal.standard}
                        />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          18 mins
                        </Text>
                      </View>
                      <View style={WorkoutScreenStyle.workoutIconContainer}>
                        <Icon
                          name="workouts-reps"
                          size={40}
                          color={colors.charcoal.standard}
                        />
                        <Text style={WorkoutScreenStyle.workoutInfoFieldData}>
                          3 rounds
                        </Text>
                      </View>
                    </View>
                    <View style={WorkoutScreenStyle.workoutPreviewHeaderContainer} >
                      <Text style={WorkoutScreenStyle.workoutPreviewHeaderText}>
                        WORKOUT PREVIEW 
                      </Text>
                    </View>
                  </View>
                )}
                ListFooterComponent={(
                  <Text style={WorkoutScreenStyle.workoutPreviewFooterText}>
                    3 TIMES THROUGH
                  </Text>
                )}
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
  carouselContainer: {
    paddingBottom: 8,
    ...Platform.select({
      android: {
        height: width + 40,
        width: width,
      }
    })
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
    fontSize: 15,
    color: colors.white,
  },
  exerciseTileHeaderBarRight: {
    fontFamily: fonts.standardNarrow,
    fontSize: 15,
    color: colors.white,
  },
});
