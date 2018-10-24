import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  AsyncStorage,
} from 'react-native';
import { FileSystem } from 'expo';
import Carousel from 'react-native-snap-carousel';
import FadeInView from 'react-native-fade-in-view';
import moment from 'moment';
import CustomButton from '../../../components/Shared/CustomButton';
import Loader from '../../../components/Shared/Loader';
import HelperModal from '../../../components/Shared/HelperModal';
import { db } from '../../../../config/firebase';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

const workoutTypes = [
  { displayName: 'RESISTANCE', resistance: true },
  { displayName: 'HIIT', hiit: true },
];

const workoutLocations = [
  { displayName: 'GYM', image: require('../../../../assets/images/workouts-gym.jpg') },
  { displayName: 'HOME', image: require('../../../../assets/images/workouts-home.jpg') },
  { displayName: 'PARK', image: require('../../../../assets/images/workouts-park.jpg') },
];

const resistanceWorkouts = [
  { displayName: 'FULL BODY', image: require('../../../../assets/images/workouts-full.jpg') },
  { displayName: 'UPPER BODY', image: require('../../../../assets/images/workouts-upper.jpg') },
  { displayName: 'LOWER BODY', image: require('../../../../assets/images/workouts-lower.jpg') },
  { displayName: 'CORE', image: require('../../../../assets/images/workouts-core.jpg') },
];

const hiitWorkouts = [
  { displayName: 'JOGGING' },
  { displayName: 'CYCLING' },
  { displayName: 'ROWING' },
  { displayName: 'SKIPPING' },
];

const workoutFocusMap = {
  0: 'fullBody',
  1: 'upperBody',
  2: 'lowerBody',
  3: 'core',
};

const workoutLocationMap = {
  0: 'gym',
  1: 'home',
  2: 'park',
};

const hiitTypeMap = {
  0: 'jogging',
  1: 'cycling',
  2: 'rowing',
  3: 'skipping',
};

export default class WorkoutsHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedWorkoutTypeIndex: 0,
      selectedWorkoutLocationIndex: 0,
      selectedHiitWorkoutIndex: 0,
      selectedResistanceFocusIndex: 0,
      helperModalVisible: false,
      resistanceWeeklyTarget: undefined,
      hiitWeeklyTarget: undefined,
      resistanceWeeklyComplete: undefined,
      hiitWeeklyComplete: undefined,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setParams({ toggleHelperModal: this.toggleHelperModal });
    this.fetchWeeklyTargetInfo();
  }
  componentWillUnmount = () => {
    this.unsubscribe();
    this.unsubscribe2();
  }
  fetchWeeklyTargetInfo = async () => {
    const uid = await AsyncStorage.getItem('uid', null);
    const userRef = db.collection('users').doc(uid);
    this.unsubscribe2 = userRef.onSnapshot(async (doc) => {
      this.setState({
        resistanceWeeklyTarget: await doc.data().resistanceWeeklyTarget,
        hiitWeeklyTarget: await doc.data().hiitWeeklyTarget,
        resistanceWeeklyComplete: await doc.data().resistanceWeeklyComplete,
        hiitWeeklyComplete: await doc.data().hiitWeeklyComplete,
      });
      if (await doc.data().currentWeekStartDate !== moment().startOf('week').format('YYYY-MM-DD')) {
        const data = {
          resistanceWeeklyComplete: 0,
          hiitWeeklyComplete: 0,
          currentWeekStartDate: moment().startOf('week').format('YYYY-MM-DD'),
        };
        await userRef.set(data, { merge: true });
      }
    });
  }
  toggleHelperModal = () => {
    this.setState((prevState) => ({
      helperModalVisible: !prevState.helperModalVisible,
    }));
  }
  handleWorkoutSelected = (selectedWorkoutLocationIndex, selectedResistanceFocusIndex) => {
    const workoutLocation = workoutLocationMap[selectedWorkoutLocationIndex];
    const workoutType = workoutFocusMap[selectedResistanceFocusIndex];
    this.props.navigation.navigate('WorkoutsSelection', {
      workoutType,
      workoutLocation,
    });
  }
  handleHiitWorkoutSelected = async (selectedHiitWorkoutIndex) => {
    this.setState({ loading: true });
    const type = hiitTypeMap[selectedHiitWorkoutIndex];
    try {
      this.unsubscribe = await db.collection('workouts')
        .where(type, '==', true)
        .get()
        .then(async (querySnapshot) => {
          let workout;
          await querySnapshot.forEach(async (doc) => {
            workout = await doc.data();
          });
          const { exercises } = workout;
          await Promise.all(exercises.map(async (exercise, index) => {
            await FileSystem.downloadAsync(
              exercise.videoURL,
              `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
            );
          }));
          this.setState({ loading: false });
          this.props.navigation.navigate('HiitWorkoutInfo', { workout });
        });
    } catch (err) {
      this.setState({ loading: false });
    }
  }
  renderItem = ({ item }) => {
    const {
      resistanceWeeklyTarget,
      hiitWeeklyTarget,
      resistanceWeeklyComplete,
      hiitWeeklyComplete,
    } = this.state;
    return (
      <View style={styles.slide}>
        <ImageBackground
          source={item.image || require('../../../../assets/images/workouts-upper.jpg')}
          style={styles.image}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {item.displayName}
            </Text>
            {
              item.resistance && (
                <Text style={styles.weeklyTargetText}>
                  {
                    resistanceWeeklyTarget &&
                    `${resistanceWeeklyComplete}/${resistanceWeeklyTarget} sessions this week`
                  }
                </Text>
              )
            }
            {
              item.hiit && (
                <Text style={styles.weeklyTargetText}>
                  {
                    hiitWeeklyTarget &&
                    `${hiitWeeklyComplete}/${hiitWeeklyTarget} sessions this week`
                  }
                </Text>
              )
            }
          </View>
        </ImageBackground>
      </View>
    );
  }
  render() {
    // const start = moment('2018-08-05').startOf('week').format('YYYY-MM-DD');
    // const now = moment().startOf('week').format('YYYY-MM-DD');
    // console.log(moment().startOf('week').subtract(11, 'weeks').format('YYYY-MM-DD') === moment('2018-08-04').startOf('week').format('YYYY-MM-DD'));
    const {
      loading,
      selectedWorkoutTypeIndex,
      selectedWorkoutLocationIndex,
      selectedHiitWorkoutIndex,
      selectedResistanceFocusIndex,
      helperModalVisible,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.carouselsContainer}>
          <View style={{ flex: 1 }}>
            <Carousel
              ref={(c) => { this.carousel = c; }}
              data={workoutTypes}
              renderItem={this.renderItem}
              sliderWidth={width}
              itemWidth={width * 0.8}
              onSnapToItem={(slideIndex) => this.setState({ selectedWorkoutTypeIndex: slideIndex })}
            />
          </View>
          <View style={{ flex: 1 }}>
            {
              selectedWorkoutTypeIndex === 0 && (
                <FadeInView duration={1500} style={{ flex: 1 }}>
                  <Carousel
                    ref={(c) => { this.carousel = c; }}
                    data={workoutLocations}
                    renderItem={this.renderItem}
                    sliderWidth={width}
                    itemWidth={width * 0.8}
                    onSnapToItem={(slideIndex) => this.setState({ selectedWorkoutLocationIndex: slideIndex })}
                  />
                </FadeInView>
              )
            }
            {
              selectedWorkoutTypeIndex === 1 && (
                <FadeInView duration={1000} style={{ flex: 1 }}>
                  <Carousel
                    ref={(c) => { this.carousel = c; }}
                    data={hiitWorkouts}
                    renderItem={this.renderItem}
                    sliderWidth={width}
                    itemWidth={width * 0.8}
                    onSnapToItem={(slideIndex) => this.setState({ selectedHiitWorkoutIndex: slideIndex })}
                  />
                </FadeInView>
              )
            }
          </View>
          <View style={{ flex: 1 }}>
            {
              selectedWorkoutTypeIndex === 0 && (
                <FadeInView duration={1000} style={{ flex: 1 }}>
                  <Carousel
                    ref={(c) => { this.carousel = c; }}
                    data={resistanceWorkouts}
                    renderItem={this.renderItem}
                    sliderWidth={width}
                    itemWidth={width * 0.8}
                    onSnapToItem={(slideIndex) => this.setState({ selectedResistanceFocusIndex: slideIndex })}
                  />
                </FadeInView>
              )
            }
          </View>
        </View>
        <View style={{ paddingBottom: 10 }}>
          <CustomButton
            title={selectedWorkoutTypeIndex === 0 ? 'SHOW WORKOUTS' : 'GO TO WORKOUT'}
            onPress={
              selectedWorkoutTypeIndex === 0 ?
                () => this.handleWorkoutSelected(selectedWorkoutLocationIndex, selectedResistanceFocusIndex) :
                () => this.handleHiitWorkoutSelected(selectedHiitWorkoutIndex)}
            primary
          />
        </View>
        <HelperModal
          helperModalVisible={helperModalVisible}
          toggleHelperModal={() => this.toggleHelperModal()}
          headingText="Workouts"
          bodyText="Select what type of workout you'd like to do, working from top to bottom."
          bodyText2="When you have finished selecting your workout type, press the button at the bottom of your screen to continue."
          color="coral"
        />
        <Loader color={colors.coral.standard} loading={loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
  },
  carouselsContainer: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  slide: {
    flex: 1,
    marginTop: 12.5,
    marginBottom: 12.5,
    borderRadius: 2,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  titleContainer: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.65 )',
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 3,
    paddingLeft: 12,
    borderRadius: 2,
  },
  weeklyTargetContainer: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.65 )',
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 3,
    paddingLeft: 12,
    borderRadius: 2,
  },
  weeklyTargetText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.black,
    textAlign: 'center',
  },
});
