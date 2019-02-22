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
            indicatorColor={colors.transparentWhite}
            indicatorOffset={70}
            indicatorSize={15}
            inactiveIndicatorText="○"
            indicatorText="●"
            animate={false}
          >
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-screen-carousel-1.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayLight} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-screen-carousel-2.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayLight} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-screen-carousel-3.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayLight} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-screen-carousel-4.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayLight} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/landing-screen-carousel-5.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayDark}>
                  <ScalableImage
                    source={require('../../../assets/icons/fitazfk-logo-outline-white.png')}
                    width={160}
                    style={styles.logo}
                  />
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
                  GET STARTED
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
    backgroundColor: colors.transparentBlackLightest,
  },
  logo: {
    marginBottom: 60,
  },
  absoluteButtonContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
  },
  buttonContainer: {
    width,
    backgroundColor: colors.transparent,
    padding: 10,
  },
  signupButton: {
    width: width - 20,
    height: 50,
    marginTop: 5,
    backgroundColor: colors.coral.dark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.charcoal.dark,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  signupButtonText: {
    marginTop: 4,
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
  },
});
