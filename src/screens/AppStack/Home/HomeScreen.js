import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Text,
  AsyncStorage,
} from 'react-native';
import { Haptic, Segment } from 'expo';
import DoubleNewsFeedTile from '../../../components/Home/DoubleNewsFeedTile';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import Loader from '../../../components/Shared/Loader';
import ProgressBar from '../../../components/Home/ProgressBar';
import { db } from '../../../../config/firebase';
import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profile: undefined,
    };
  }
  componentDidMount = () => {
    this.fetchProfile();
  }
  componentWillUnmount = () => {
    this.unsubscribe();
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribe = await db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({ profile: await doc.data(), loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  openLink = (url, analyticsKey) => {
    Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
    Segment.track(`Link opened: ${analyticsKey}`);
  }
  render() {
    const { loading, profile } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.homeInfoContainer}>
            <Text style={styles.welcomeText}>
              { profile && `Welcome, ${profile.firstName}`}!
            </Text>
            <Text style={styles.bodyText}>
              Here is your progress for the week
            </Text>
            {
              profile && (
                <ProgressBar
                  progressBarType="resistance"
                  completedWorkouts={profile.weeklyTargets.resistanceWeeklyComplete}
                />
              )
            }
            {
              profile && (
                <ProgressBar
                  progressBarType="hiit"
                  completedWorkouts={profile.weeklyTargets.hiitWeeklyComplete}
                />
              )
            }
          </View>
          <DoubleNewsFeedTile
            imageLeft={require('../../../../assets/images/fitazfk-blog-sleep.jpg')}
            imageRight={require('../../../../assets/images/fitazfk-blog-mindset.jpg')}
            titleLeft1="BLOG POST:"
            titleLeft2="SLEEP"
            titleRight1="BLOG POST:"
            titleRight2="MINDSET"
            onPressLeft={() => this.openLink('https://www.fitazfkblog.com/home/2018/9/27/hitting-the-hay-the-right-way', 'Sleep Blog')}
            onPressRight={() => this.openLink('https://www.fitazfkblog.com/home/2018/9/3/get-your-head-in-the-weight-loss-game', 'Mindset Blog')}
          />
          <DoubleNewsFeedTile
            imageLeft={require('../../../../assets/images/fitazfk-blog-sleep.jpg')}
            imageRight={require('../../../../assets/images/fitazfk-blog-mindset.jpg')}
            titleLeft1="BLOG POST:"
            titleLeft2="SLEEP"
            titleRight1="BLOG POST:"
            titleRight2="MINDSET"
            onPressLeft={() => this.openLink('https://www.fitazfkblog.com/home/2018/9/27/hitting-the-hay-the-right-way', 'Sleep Blog')}
            onPressRight={() => this.openLink('https://www.fitazfkblog.com/home/2018/9/3/get-your-head-in-the-weight-loss-game', 'Mindset Blog')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/shop-bundles.jpg')}
            title="GRAB YOUR FITAZFK WORKOUT EQUIPMENT"
            onPress={() => this.openLink('https://fitazfk.com/collections/equipment', 'Online Store')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/fitazfk-army.jpg')}
            title="JOIN OUR FACEBOOK GROUP"
            onPress={() => this.openLink('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572', 'Facebook Group')}
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
  homeInfoContainer: {
    margin: 5,
    backgroundColor: colors.white,
    borderRadius: 2,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.grey.light,
  },
  welcomeText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
});
