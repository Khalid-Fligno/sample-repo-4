import React from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Carousel from 'react-native-carousel';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width, height } = Dimensions.get('window');

export default class LandingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      specialOffer: props.navigation.getParam('specialOffer', undefined),
    };
  }
  render() {
    const { specialOffer } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Carousel
            width={width}
            inactiveIndicatorColor={colors.white}
            indicatorColor={colors.transparentWhite}
            indicatorOffset={120}
            indicatorSize={15}
            inactiveIndicatorText="○"
            indicatorText="●"
            animate={false}
          >
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/app-onboarding-carousel-1.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayLight} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/app-onboarding-carousel-2.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayTransparent} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/app-onboarding-carousel-3.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayTransparent} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/app-onboarding-carousel-4.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayTransparent} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require('../../../assets/images/app-onboarding-carousel-5.jpg')}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayTransparent} />
              </ImageBackground>
            </View>
          </Carousel>
          <View style={styles.absoluteButtonContainer}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Signup', { specialOffer })}
                activeOpacity={0.6}
                style={styles.signupButton}
              >
                <Text style={styles.signupButtonText}>
                  START FREE TRIAL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Login', { specialOffer })}
                activeOpacity={0.6}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>
                  I ALREADY HAVE AN ACCOUNT
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
  opacityOverlayLight: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparentBlackLighter,
  },
  opacityOverlayTransparent: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.transparent,
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
    height: 45,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: colors.coral.standard,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.charcoal.dark,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  signupButtonText: {
    marginTop: 4,
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  loginButton: {
    width: width - 20,
    height: 45,
    marginTop: 5,
    backgroundColor: colors.transparentCoral,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.charcoal.dark,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  loginButtonText: {
    marginTop: 4,
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 14,
    opacity: 0.8,
  },
});
