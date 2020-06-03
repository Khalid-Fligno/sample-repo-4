import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Text,
  Dimensions,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import * as Localization from 'expo-localization';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import DoubleNewsFeedTile from '../../../components/Home/DoubleNewsFeedTile';
import Loader from '../../../components/Shared/Loader';
import ProgressBar from '../../../components/Progress/ProgressBar';
import { db } from '../../../../config/firebase';
import Icon from '../../../components/Shared/Icon';
import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

const workoutTypeMap = {
  1: 'Resistance',
  2: 'HIIT',
  3: 'Resistance',
  4: 'HIIT',
  5: 'Resistance',
};

const workoutIconMap = {
  1: 'dumbbell',
  2: 'workouts-hiit',
  3: 'dumbbell',
  4: 'workouts-hiit',
  5: 'dumbbell',
};

const resistanceFocusMap = {
  1: 'Full Body',
  3: 'Upper Body',
  5: 'Abs, Butt & Thighs',
};

const resistanceFocusIconMap = {
  1: 'workouts-full',
  3: 'workouts-upper',
  5: 'workouts-lower',
};

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profile: undefined,
      switchWelcomeHeader: true,
      dayOfWeek: undefined,
    };
  }
  componentDidMount = () => {
    this.fetchProfile();
    this.switchWelcomeHeader();
    this.setDayOfWeek();
  }
  componentWillUnmount = () => {
    this.unsubscribe();
  }
  setDayOfWeek = async () => {
    const timezone = await Localization.timezone;
    const dayOfWeek = momentTimezone.tz(timezone).day();
    this.setState({ dayOfWeek });
  }
  switchWelcomeHeader = async () => {
    // const switchWelcomeHeader = await AsyncStorage.getItem('switchWelcomeHeader');
    // if (switchWelcomeHeader === null) {
    //   this.setState({ switchWelcomeHeader: false });
    //   AsyncStorage.setItem('switchWelcomeHeader', 'true');
    // }
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    // const uid = await AsyncStorage.getItem('uid');
    // const userRef = db.collection('users').doc(uid);
    // this.unsubscribe = userRef.onSnapshot(async (doc) => {
    //   this.setState({
    //     profile: await doc.data(),
    //     loading: false,
    //   });
    //   if (await doc.data().weeklyTargets.currentWeekStartDate !== moment().startOf('week').format('YYYY-MM-DD')) {
    //     const data = {
    //       weeklyTargets: {
    //         resistanceWeeklyComplete: 0,
    //         hiitWeeklyComplete: 0,
    //         currentWeekStartDate: moment().startOf('week').format('YYYY-MM-DD'),
    //       },
    //     };
    //     await userRef.set(data, { merge: true });
    //   }
    // });
  }
  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }
  goToBurpeeTest = async () => {
    this.setState({ loading: true });
    await FileSystem.downloadAsync(
      'https://firebasestorage.googleapis.com/v0/b/fitazfk-app.appspot.com/o/videos%2FBURPEES.mp4?alt=media&token=688885cb-2d70-4fc6-82a9-abc4e95daf89',
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
    );
    this.setState({ loading: false });
    this.props.navigation.navigate('Burpee1');
  }
  render() {
    const {
      loading,
      profile,
      switchWelcomeHeader,
      dayOfWeek,
    } = this.state;
    const personalisedMessage = () => {
      const { resistanceWeeklyComplete, hiitWeeklyComplete } = profile.weeklyTargets;
      const totalWeeklyWorkoutsCompleted = resistanceWeeklyComplete + hiitWeeklyComplete;
      if (totalWeeklyWorkoutsCompleted === 0) {
        return 'Time to get started!';
      } else if (resistanceWeeklyComplete > 2 && hiitWeeklyComplete > 1) {
        return 'Well done!';
      }
      return 'Keep working, you\'ve got this!';
    };
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          <Text style={styles.welcomeHeaderText}>
            {switchWelcomeHeader ? 'Welcome back' : 'Hi'}{profile && `, ${profile.firstName}`}
          </Text>
          <Text style={styles.welcomeBodyText}>
            Here is your progress for the week. {profile && personalisedMessage()}
          </Text>
          <View style={styles.workoutProgressContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.bodyText}>
                WEEKLY WORKOUT PROGRESS
              </Text>
            </View>
            {
              profile && (
                <ProgressBar
                  progressBarType="Resistance"
                  completedWorkouts={profile.weeklyTargets.resistanceWeeklyComplete}
                />
              )
            }
            {
              profile && (
                <ProgressBar
                  progressBarType="HIIT"
                  completedWorkouts={profile.weeklyTargets.hiitWeeklyComplete}
                />
              )
            }
          </View>
          <View style={styles.workoutProgressContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.bodyText}>
                TODAYS RECOMMENDED WORKOUT
              </Text>
            </View>
            <View style={styles.recommendedWorkoutContainer}>
              {
                (dayOfWeek > 0 && dayOfWeek < 6) ? (
                  <View style={styles.recommendedWorkoutSection}>
                    <Icon
                      name={workoutIconMap[dayOfWeek]}
                      size={28}
                      color={colors.charcoal.light}
                    />
                    <Text style={styles.recommendedWorkoutText}>
                      {workoutTypeMap[dayOfWeek]}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.recommendedWorkoutSection}>
                    <Icon
                      name="calendar-tick"
                      size={28}
                      color={colors.charcoal.light}
                    />
                    <Text style={styles.recommendedWorkoutText}>
                      Rest Day
                    </Text>
                  </View>
                )
              }
              {
                (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) && (
                  <View style={styles.recommendedWorkoutSection}>
                    <Icon
                      name={resistanceFocusIconMap[dayOfWeek]}
                      size={28}
                      color={colors.charcoal.standard}
                    />
                    <Text style={styles.recommendedWorkoutText}>
                      {resistanceFocusMap[dayOfWeek]}
                    </Text>
                  </View>
                )
              }
            </View>
          </View>
          {
            profile && profile.initialBurpeeTestCompleted === undefined && (
              <View style={styles.workoutProgressContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.bodyText}>
                    REMINDER
                  </Text>
                </View>
                <View style={styles.reminderContentContainer}>
                  <Icon
                    name="stopwatch"
                    size={32}
                    color={colors.charcoal.dark}
                    style={styles.reminderIcon}
                  />
                  <View style={styles.reminderTextContainer}>
                    <Text style={styles.reminderText}>
                      Complete a burpee test to assess your current fitness level.  The results from this test will determine the intensity of your workouts!
                    </Text>
                  </View>
                </View>
                <Button
                  title="START BURPEE TEST"
                  buttonStyle={styles.button}
                  titleStyle={styles.buttonText}
                  onPress={this.goToBurpeeTest}
                />
              </View>
            )
          }
          <NewsFeedTile
            image={require('../../../../assets/images/homeScreenTiles/home-screen-shop-apparel-jumper.jpg')}
            title="SHOP APPAREL"
            onPress={() => this.openLink('https://fitazfk.com/collections/wear-fitazfk-apparel')}
          />
          <DoubleNewsFeedTile
            imageLeft={require('../../../../assets/images/homeScreenTiles/home-screen-blog.jpg')}
            imageRight={require('../../../../assets/images/hiit-rest-placeholder.jpg')}
            titleLeft1="BLOG"
            titleRight1="FAQ"
            onPressLeft={() => this.props.navigation.navigate('HomeBlog')}
            onPressRight={() => this.openLink('https://fitazfk.zendesk.com/hc/en-us')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/shop-bundles.jpg')}
            title="SHOP EQUIPMENT"
            onPress={() => this.openLink('https://fitazfk.com/collections/equipment')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/fitazfk-army.jpg')}
            title="JOIN THE FITAZFK ARMY"
            onPress={() => this.openLink('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
          />
        </ScrollView>
        <Loader
          loading={loading}
          color={colors.charcoal.standard}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  scrollView: {
    padding: 5,
  },
  welcomeHeaderText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.black,
    margin: 8,
    marginTop: 10,
  },
  welcomeBodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.black,
    margin: 8,
    marginTop: 0,
  },
  workoutProgressContainer: {
    alignItems: 'center',
    width: width - 20,
    margin: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: colors.white,
    borderRadius: 2,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sectionHeader: {
    alignItems: 'center',
    backgroundColor: colors.charcoal.darkest,
    width: width - 20,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    padding: 8,
    paddingBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.white,
  },
  recommendedWorkoutContainer: {
    flexDirection: 'row',
  },
  recommendedWorkoutSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  recommendedWorkoutText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.charcoal.standard,
    marginTop: 12,
  },
  reminderContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    margin: 5,
    marginRight: 8,
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.black,
    margin: 4,
    marginTop: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.charcoal.darkest,
    shadowColor: colors.grey.dark,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: width - 40,
    borderRadius: 4,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    marginTop: 3,
  },
});
