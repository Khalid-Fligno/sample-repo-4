import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import ScalableImage from 'react-native-scalable-image';
import Carousel from 'react-native-carousel';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

export default class LandingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Image
            source={require('../../../assets/images/landing-page-1.png')}
            resizeMode="cover"
            style={styles.backgroundImage}
          />
          <View style={styles.opacityOverlay}>
            <Carousel
              width={width}
              inactiveIndicatorColor={colors.grey.dark}
              indicatorColor={colors.white}
              indicatorOffset={10}
              indicatorSize={30}
              animate={false}
            >
              <View style={styles.carouselCardContainer}>
                <ScalableImage
                  source={require('../../../assets/icons/fitazfk-logo-outline-white.png')}
                  width={180}
                />
              </View>
              <View style={styles.carouselCardContainer}>
                <View style={styles.carouselCardImageContainer}>
                  <ScalableImage
                    source={require('../../../assets/images/landing-screen-carousel-1.png')}
                    width={180}
                  />
                </View>
                <View style={styles.carouselCardTextContainer}>
                  <Text style={styles.carouselCardText}>
                    A fuckload of workouts
                  </Text>
                </View>
              </View>
              <View style={styles.carouselCardContainer}>
                <View style={styles.carouselCardImageContainer}>
                  <ScalableImage
                    source={require('../../../assets/images/landing-screen-carousel-2.png')}
                    width={180}
                  />
                </View>
                <View style={styles.carouselCardTextContainer}>
                  <Text style={styles.carouselCardText}>
                    Shit-tonnes of recipes
                  </Text>
                </View>
              </View>
              <View style={styles.carouselCardContainer}>
                <View style={styles.carouselCardImageContainer}>
                  <ScalableImage
                    source={require('../../../assets/images/landing-screen-carousel-3.png')}
                    width={180}
                  />
                </View>
                <View style={styles.carouselCardTextContainer}>
                  <Text style={styles.carouselCardText}>
                    Created by a lovely homosexual couple
                  </Text>
                </View>
              </View>
            </Carousel>

          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Signup')}
            activeOpacity={0.6}
            style={styles.signupButton}
          >
            <Text style={styles.signupButtonText}>
              SIGN UP
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Login')}
            activeOpacity={0.6}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>
              LOG IN
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  backgroundImage: {
    flex: 1,
    width,
  },
  opacityOverlay: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselCardContainer: {
    height: '100%',
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  carouselCardImageContainer: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  carouselCardTextContainer: {
    width: 180,
    marginTop: 15,
  },
  carouselCardText: {
    textAlign: 'center',
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    width,
    height: 70,
    backgroundColor: colors.white,
    borderColor: colors.grey.light,
    borderWidth: 1,
    padding: 10,
    borderRadius: 3,
  },
  signupButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: colors.coral.dark,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: 4,
    borderColor: colors.coral.dark,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  signupButtonText: {
    marginTop: 4,
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
  loginButton: {
    flex: 1,
    marginLeft: 5,
    backgroundColor: 'white',
    borderColor: colors.coral.dark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderRadius: 4,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  loginButtonText: {
    marginTop: 4,
    color: colors.coral.dark,
    fontFamily: fonts.bold,
    fontSize: 15,
  },
});
