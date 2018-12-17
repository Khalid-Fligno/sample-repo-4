import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
} from 'react-native';
import { Haptic, Segment } from 'expo';
import DoubleNewsFeedTile from '../../../components/Home/DoubleNewsFeedTile';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import colors from '../../../styles/colors';

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  openLink = (url, analyticsKey) => {
    Haptic.impact(Haptic.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
    Segment.track(`Link opened: ${analyticsKey}`);
  }
  render() {
    return (
      <View style={styles.container}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: 5,
  },
});
