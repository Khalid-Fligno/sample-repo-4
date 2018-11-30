import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import ScalableImage from 'react-native-scalable-image';
import Carousel from 'react-native-carousel';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width, height } = Dimensions.get('window');

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
          <Carousel
            width={width}
            inactiveIndicatorColor={colors.white}
            indicatorColor={colors.white}
            indicatorOffset={100}
            indicatorSize={15}
            inactiveIndicatorText="○"
            indicatorText="●"
            animate={false}
          >
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-page-1.png')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayDark}>
                  <ScalableImage
                    source={require('../../../assets/icons/fitazfk-logo-outline-white.png')}
                    width={180}
                    style={styles.logo}
                  />
                </View>
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-page-2.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayLight}>
                  <Text style={styles.carouselCardText}>
                    WORKOUTS
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-page-3.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayLight}>
                  <Text style={styles.carouselCardText}>
                    RECIPES
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-page-4.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayLight}>
                  <Text style={styles.carouselCardText}>
                    INSPIRATION
                  </Text>
                </View>
              </ImageBackground>
            </View>
          </Carousel>
          <View style={styles.absoluteButtonContainer}>
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
          </View>
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
  carouselCardContainer: {
    flex: 1,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  carouselImageBackground: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  opacityOverlayDark: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparentBlackDark,
  },
  opacityOverlayLight: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparentBlackLight,
  },
  logo: {
    marginBottom: 45,
  },
  carouselCardText: {
    marginBottom: 45,
    textAlign: 'center',
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 32,
  },
  absoluteButtonContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    width,
    height: 70,
    backgroundColor: colors.transparent,
    padding: 10,
  },
  signupButton: {
    width: (width - 30) / 2,
    marginRight: 5,
    backgroundColor: colors.coral.dark,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
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
    fontSize: 16,
  },
  loginButton: {
    width: (width - 30) / 2,
    marginLeft: 5,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    shadowColor: colors.charcoal.dark,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  loginButtonText: {
    marginTop: 4,
    color: colors.coral.dark,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
