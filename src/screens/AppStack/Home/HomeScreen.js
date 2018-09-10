import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
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
          image={require('../../../../assets/images/fitazfk-army.jpg')}
          title="Join our facebook group"
          onPress={() => Linking.openURL('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
        />
        <NewsFeedTile
          image={require('../../../../assets/images/shop-bundles.jpg')}
          title="Shop Bundles Online"
          onPress={() => Linking.openURL('https://fitazfk.com/collections/equipment')}
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
  doubleTileContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  cardContainer: {
    flex: 1,
    margin: 5,
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 1,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6 )',
    padding: 8,
    paddingBottom: 3,
    maxWidth: width / 2.4,
    borderRadius: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 15,
    textAlign: 'center',
  },
});
