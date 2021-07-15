import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from "react-native";
import Carousel from "react-native-carousel";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import CustomBtn from "../../components/Shared/CustomBtn";
import globalStyle, { containerPadding } from "../../styles/globalStyles";
const { width, height } = Dimensions.get("window");
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
export default class LandingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      specialOffer: props.navigation.getParam("specialOffer", undefined),
    };
  }
  render() {
    const { specialOffer } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          {/* <Carousel
            width={width}
            inactiveIndicatorColor={colors.black}
            indicatorColor={colors.themeColor.color}
            indicatorOffset={hp("23%")}
            indicatorSize={20}
            inactiveIndicatorText="○"
            indicatorText="●"
            animate={false}
          >
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require("../../../assets/images/OnBoardindImg/OB_1.jpg")}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayTransparent} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require("../../../assets/images/OnBoardindImg/OB_2.jpg")}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayTransparent} />
              </ImageBackground>
            </View>
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require("../../../assets/images/OnBoardindImg/OB_3.jpg")}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayTransparent} />
              </ImageBackground>
            </View>
            
            <View style={styles.carouselCardContainer}>
              <ImageBackground
                source={require("../../../assets/images/OnBoardindImg/OB_5.jpg")}
                style={styles.carouselImageBackground}
              >
                <View style={styles.opacityOverlayTransparent} />
              </ImageBackground>
            </View>
          </Carousel> */}
          <View style={styles.carouselCardContainer}>
            <ImageBackground
              source={require("../../../assets/images/OnBoardindImg/OB_1.jpg")}
              style={styles.carouselImageBackground}
            >
              <View style={styles.opacityOverlayTransparent} />
            </ImageBackground>
          </View>
          <View style={styles.absoluteButtonContainer}>
            <View style={styles.buttonContainer}>
              <CustomBtn
                customBtnStyle={{
                  borderRadius: 50,
                  padding: 16,
                  marginBottom: 5,
                }}
                Title="Start 7 Day Free Trial"
                onPress={() =>
                  this.props.navigation.navigate("Signup", { specialOffer })
                }
              />
              <CustomBtn
                customBtnStyle={{
                  borderRadius: 50,
                  padding: 12,
                  margin: 5,
                  borderColor: colors.themeColor.color,
                }}
                outline={true}
                Title="Transform Now"
                customBtnTitleStyle={{ color: colors.themeColor.color }}
                onPress={() =>
                  this.props.navigation.navigate("Signup", { specialOffer })
                }
              />
              {/* <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Signup', { specialOffer })}
                activeOpacity={0.6}
                style={styles.signupButton}
              >
                <Text style={styles.signupButtonText}>
                  START FREE TRIAL
                </Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Login", { specialOffer })
                }
                activeOpacity={0.6}
                style={styles.haveAAccountBtnStyle}
              >
                <Text style={styles.haveAAccountTitleStyle}>Sign In</Text>
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
    backgroundColor: colors.themeColor.themeBackgroundColor,
  },
  carouselCardContainer: {
    flex: 1,
    width,
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparentBlackLighter,
  },
  opacityOverlayTransparent: {
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparent,
  },
  absoluteButtonContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    backgroundColor: colors.themeColor.themeBackgroundColor,
  },
  buttonContainer: {
    width,
    backgroundColor: colors.transparent,
    padding: 12,
    paddingHorizontal: containerPadding,
  },
  // signupButton: {
  //   width: width - 20,
  //   height: 45,
  //   marginTop: 5,
  //   marginBottom: 5,
  //   backgroundColor: colors.coral.standard,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: colors.charcoal.dark,
  //   borderRadius: 2,
  //   shadowOpacity: 0.5,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 2,
  // },
  // signupButtonText: {
  //   marginTop: 4,
  //   color: colors.white,
  //   fontFamily: fonts.bold,
  //   fontSize: 14,
  // },
  loginButton: {
    // width: width - 20,
    // height: 45,
    marginTop: 5,
    // backgroundColor: colors.transparentCoral,
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: colors.charcoal.dark,
    // borderRadius: 2,
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 2,
  },
  loginButtonText: {
    marginTop: 4,
    color: colors.themeColor.color,
    fontFamily: fonts.bold,
    fontSize: 15,
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  haveAAccountBtnStyle: {
    //flexDirection:"row",
    padding: hp("2%"),
    justifyContent: "center",
    borderRadius: 50,
    padding: 12,
    margin: 5,
    backgroundColor: colors.themeColor.themeBackgroundColor,
    borderColor: colors.themeColor.color,
    borderWidth: 2,
  },
  haveAAccountTitleStyle: {
    fontFamily: fonts.GothamMedium,
    fontSize: hp("1.8%"),
    letterSpacing: 0.7,
    color: colors.white,
    letterSpacing: 0.5,
    textAlign: "center",
    color: colors.themeColor.color,
  },
});
