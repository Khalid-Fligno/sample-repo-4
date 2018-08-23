import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import NewsFeedTile from '../../../components/NewsFeedTile';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

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
          <View style={styles.doubleTileContainer}>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.fitazfkblog.com/home/2018/7/3/the-18-min-workout-that-will-transform-your-life')}
              style={styles.cardContainer}
            >
              <ImageBackground
                source={require('../../../../assets/images/fitazfk-blog.jpg')}
                style={styles.image}
              >
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    CHECK OUT SOME TACOS
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.fitazfkblog.com/home/2018/7/3/the-18-min-workout-that-will-transform-your-life')}
              style={styles.cardContainer}
            >
              <ImageBackground
                source={require('../../../../assets/images/fitazfk-blog.jpg')}
                style={styles.image}
              >
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    CHECK OUT SOME TACOS
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <NewsFeedTile
            image={require('../../../../assets/images/fitazfk-facebook-group.jpg')}
            title="Join the FitazFK Army"
            onPress={() => Linking.openURL('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
          />
          <NewsFeedTile
            image={require('../../../../assets/images/fitazfk-shop-now.jpg')}
            title="Shop Bundles Online"
            onPress={() => Linking.openURL('https://fitazfk.com/collections/equipment')}
          />
        </ScrollView>
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
    flex: 1,
    padding: 5,
  },
  doubleTileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cardContainer: {
    flex: 1,
    margin: 5,
    shadowColor: colors.grey.dark,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 1.5,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 1,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8 )',
    padding: 5,
    paddingBottom: 0,
    maxWidth: width / 3,
    borderRadius: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    textAlign: 'center',
  },
});
