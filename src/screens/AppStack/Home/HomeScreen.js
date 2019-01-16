import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  ScrollView,
} from 'react-native';
import { Haptic } from 'expo';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import DoubleNewsFeedTile from '../../../components/Home/DoubleNewsFeedTile';
import TripleNewsFeedTile from '../../../components/Home/TripleNewsFeedTile';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  openLink = (url) => {
    Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }
  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
        >
          <DoubleNewsFeedTile
            imageLeft={require('../../../../assets/images/homeScreenTiles/home-screen-nutrition.jpg')}
            imageRight={require('../../../../assets/images/homeScreenTiles/home-screen-workouts.jpg')}
            titleLeft1="NUTRITION"
            titleRight1="WORKOUTS"
            onPressLeft={() => this.props.navigation.navigate('Nutrition')}
            onPressRight={() => this.props.navigation.navigate('Workouts')}
          />
          <DoubleNewsFeedTile
            imageLeft={require('../../../../assets/images/homeScreenTiles/home-screen-calendar.jpg')}
            imageRight={require('../../../../assets/images/homeScreenTiles/home-screen-blog.jpg')}
            titleLeft1="CALENDAR"
            titleRight1="BLOG"
            onPressLeft={() => this.props.navigation.navigate('Calendar')}
            onPressRight={() => this.props.navigation.navigate('HomeBlog')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/shop-bundles.jpg')}
            title="GRAB YOUR FITAZFK WORKOUT EQUIPMENT"
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
            title="JOIN OUR FACEBOOK GROUP"
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
});
