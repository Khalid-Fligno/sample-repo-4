import React from 'react';
import {
  StyleSheet,
  View,
  Linking,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  NativeModules,
  Alert,
} from 'react-native';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

const { InAppUtils } = NativeModules;

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  loadProducts = () => {
    InAppUtils.loadProducts((['com.fitazfk.fitazfkapp.sub.fullaccess.monthly']), (error, products) => {
      if (error) {
        console.log(error);
      }
      console.log(products);
    });
  }
  canMakePayments = () => {
    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.doubleTileContainer}>
          <TouchableOpacity
            // onPress={() => Linking.openURL('https://www.fitazfkblog.com/home/2018/9/27/hitting-the-hay-the-right-way')}
            onPress={() => this.canMakePayments()}
            // onPress={() => this.loadProducts()}
            style={styles.cardContainer}
          >
            <ImageBackground
              resizeMode="cover"
              source={require('../../../../assets/images/fitazfk-blog-sleep.jpg')}
              style={styles.image}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  BLOG POST:
                </Text>
                <Text style={styles.title}>
                  SLEEP
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.fitazfkblog.com/home/2018/9/3/get-your-head-in-the-weight-loss-game')}
            style={styles.cardContainer}
          >
            <ImageBackground
              resizeMode="cover"
              source={require('../../../../assets/images/fitazfk-blog-mindset.jpg')}
              style={styles.image}
            >
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  BLOG POST:
                </Text>
                <Text style={styles.title}>
                  MINDSET
                </Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
        <NewsFeedTile
          image={require('../../../../assets/images/shop-bundles.jpg')}
          title="GRAB YOUR FITAZFK WORKOUT EQUIPMENT"
          onPress={() => Linking.openURL('https://fitazfk.com/collections/equipment')}
        />
        <NewsFeedTile
          image={require('../../../../assets/images/fitazfk-army.jpg')}
          title="JOIN OUR FACEBOOK GROUP"
          onPress={() => Linking.openURL('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
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
