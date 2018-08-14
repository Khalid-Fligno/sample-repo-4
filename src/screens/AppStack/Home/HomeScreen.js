import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  ScrollView,
} from 'react-native';
import NewsFeedTile from '../../../components/NewsFeedTile';
import colors from '../../../styles/colors';

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <NewsFeedTile
            image={require('../../../../assets/images/fitazfk-blog.jpg')}
            title="FitazFK Blog"
            subTitle="Ground Bean Tacos with Avocado Cream"
            onPress={() => Linking.openURL('https://www.fitazfkblog.com/home/2018/7/3/the-18-min-workout-that-will-transform-your-life')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/fitazfk-facebook-group.jpg')}
            title="Join the FitazFK Army"
            subTitle="Share progress and trade tips and tricks for following our guides"
            onPress={() => Linking.openURL('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/fitazfk-shop-now.jpg')}
            title="Buy Now"
            subTitle="Browse our range of fitness equipment"
            onPress={() => Linking.openURL('https://fitazfk.com/collections/equipment')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/fitazfk-shop-now.jpg')}
            title="Keto Glo"
            subTitle="Coming Soon"
            onPress={() => Linking.openURL('https://www.fitazfkblog.com/home/2018/7/3/the-18-min-workout-that-will-transform-your-life')}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    paddingBottom: 15,
  },
});
