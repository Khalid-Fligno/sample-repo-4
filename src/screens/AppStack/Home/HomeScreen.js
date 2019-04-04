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
import { Haptic } from 'expo';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import DoubleNewsFeedTile from '../../../components/Home/DoubleNewsFeedTile';
import TripleNewsFeedTile from '../../../components/Home/TripleNewsFeedTile';
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
    };
  }
  componentDidMount = () => {
    this.fetchProfile();
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribe = db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            profile: await doc.data(),
            loading: false,
          });
        }
      });
  }
  openLink = (url) => {
    Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }
  render() {
    const { loading, profile } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          <Text style={styles.welcomeText}>
            Hi{profile && `, ${profile.firstName}`}
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
          <DoubleNewsFeedTile
            imageLeft={require('../../../../assets/images/homeScreenTiles/home-screen-nutrition.jpg')}
            imageRight={require('../../../../assets/images/homeScreenTiles/home-screen-workouts.jpg')}
            titleLeft1="EAT"
            titleRight1="TRAIN"
            onPressLeft={() => this.props.navigation.navigate('Nutrition')}
            onPressRight={() => this.props.navigation.navigate('Workouts')}
          />
          <DoubleNewsFeedTile
            imageLeft={require('../../../../assets/images/homeScreenTiles/home-screen-calendar.jpg')}
            imageRight={require('../../../../assets/images/homeScreenTiles/home-screen-blog.jpg')}
            titleLeft1="PLAN"
            titleRight1="LEARN"
            onPressLeft={() => this.props.navigation.navigate('Calendar')}
            onPressRight={() => this.props.navigation.navigate('HomeBlog')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/shop-bundles.jpg')}
            title="SHOP WORKOUT EQUIPMENT"
            onPress={() => this.openLink('https://fitazfk.com/collections/equipment')}
          />
          <TripleNewsFeedTile
            imageLeft={require('../../../../assets/images/hiit-rest-placeholder.jpg')}
            imageCenter={require('../../../../assets/images/homeScreenTiles/home-screen-profile.jpg')}
            imageRight={require('../../../../assets/images/workouts-hiit-rowing.jpg')}
            titleLeft="FAQ"
            titleCenter="PROFILE"
            titleRight="PROGRESS"
            onPressLeft={() => this.openLink('https://fitazfk.zendesk.com/hc/en-us')}
            onPressCenter={() => this.props.navigation.navigate('ProfileHome')}
            onPressRight={() => this.props.navigation.navigate('Progress')}
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
  welcomeText: {
    fontFamily: fonts.bold,
    fontSize: 16,
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
