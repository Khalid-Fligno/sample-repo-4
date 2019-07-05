import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  ScrollView,
  AsyncStorage,
  Text,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import DoubleNewsFeedTile from '../../../components/Home/DoubleNewsFeedTile';
import Loader from '../../../components/Shared/Loader';
import ProgressBar from '../../../components/Progress/ProgressBar';
import { db } from '../../../../config/firebase';
import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

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
    const switchWelcomeHeader = await AsyncStorage.getItem('switchWelcomeHeader');
    if (switchWelcomeHeader === null) {
      this.setState({ switchWelcomeHeader: false });
      AsyncStorage.setItem('switchWelcomeHeader', 'true');
    }
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    this.unsubscribe = userRef.onSnapshot(async (doc) => {
      this.setState({
        profile: await doc.data(),
        loading: false,
      });
      if (await doc.data().weeklyTargets.currentWeekStartDate !== moment().startOf('week').format('YYYY-MM-DD')) {
        const data = {
          weeklyTargets: {
            resistanceWeeklyComplete: 0,
            hiitWeeklyComplete: 0,
            currentWeekStartDate: moment().startOf('week').format('YYYY-MM-DD'),
          },
        };
        await userRef.set(data, { merge: true });
      }
    });
  }
  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
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
          {
            (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) && (
              <View style={styles.workoutProgressContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.bodyText}>
                    TODAYS RECOMMENDED WORKOUT
                  </Text>
                </View>
                <Text>
                  Resistance
                </Text>
              </View>
            )
          }
          {
            (dayOfWeek === 2 || dayOfWeek === 4) && (
              <View style={styles.workoutProgressContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.bodyText}>
                    TODAYS RECOMMENDED WORKOUT
                  </Text>
                </View>
                <Text>
                  HIIT
                </Text>
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
    fontSize: 20,
    color: colors.black,
    margin: 5,
    marginTop: 12,
  },
  welcomeBodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.black,
    margin: 5,
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
    backgroundColor: colors.charcoal.dark,
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
});
