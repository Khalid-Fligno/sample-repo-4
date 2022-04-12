import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  StatusBar,
  ImageBackground,
  Platform,
  Text
} from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import CustomBtn from "../../components/Shared/CustomBtn";
import { containerPadding } from "../../styles/globalStyles";
import { db } from "../../config/firebase";
const { width, height } = Dimensions.get("window");
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { getVersion } from "react-native-device-info";
import { checkVersion } from "react-native-check-version";
import AsyncStorage from "@react-native-community/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
export default class LandingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      specialOffer: props.navigation.getParam("specialOffer", undefined),
    };
  }

  componentDidMount = async () => {
    this.checkAppVersion();
  };

  async checkAppVersion() {
    const uid = await AsyncStorage.getItem("uid");
    if (uid) {
      console.log('uid: ', uid)
      const version = await checkVersion();
      console.log('version: ', version)
      await db
        .collection("users")
        .doc(uid)
        .set(
          {
            AppVersionUse:
              Platform.OS === "ios"
                ? String(version.version)
                : String(getVersion()),
          },
          { merge: true }
        );
    }
  }

  render() {
    const { specialOffer } = this.state;
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />

          <View style={styles.carouselCardContainer}>

            <View style={styles.padding}>
              <ImageBackground
                source={require("../../assets/icons/FITAZ_BrandMark.png")}
                style={styles.carouselImageBackground}
              >
              </ImageBackground>
              <View style={styles.textPadding}>
                <Text style={styles.fontText}>em
                  <Text style={styles.underline}>powered</Text>
                </Text>
                <Text style={styles.fontText}>by you.</Text>
              </View>
            </View>

            <View style={{ paddingBottom: hp("2%") }}>
              <TouchableOpacity onPress={() =>
                this.props.navigation.navigate("FindAccount")}
              >
                <View style={styles.transformProgram}>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.Text}>I have just purchased my {"\n"}1st Transform Program</Text>
                  </View>
                  <View style={{ marginRight: 10 }}>
                    <Icon name="angle-right" size={45} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() =>
                this.props.navigation.navigate("Signup", { specialOffer })}
              >
                <View style={styles.transformProgram}>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.Text}>I want to do a 7 day free {"\n"}trial of the Fitaz App </Text>
                  </View>
                  <View style={{ marginRight: 10 }}>
                    <Icon name="angle-right" size={45} />
                  </View>
                </View>
              </TouchableOpacity>
            </View>

          </View>
          <View style={styles.absoluteButtonContainer}>
            <View style={styles.buttonContainer}>
              <View style={{
                paddingTop: hp("2%"),
                paddingBottom: hp("2%"),
                alignItems: 'center'
              }}>
                <Text
                  style={{ fontSize: hp("1.9%"), fontFamily: fonts.SimplonMonoMedium, }}
                >Already have an account?</Text>
              </View>
              <CustomBtn
                customBtnStyle={{
                  padding: 12,
                  margin: 5,
                  borderColor: colors.themeColor.color,
                }}
                outline={false}
                Title="SIGN IN"
                customBtnTitleStyle={{ color: colors.black }}
                onPress={() =>
                  this.props.navigation.navigate("Login", { specialOffer })
                }
              />
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
    backgroundColor: colors.citrus,
  },
  carouselImageBackground: {
    width: 95,
    height: 80,
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
    height: hp("18%")
  },
  buttonContainer: {
    width,
    backgroundColor: colors.transparent,
    padding: 12,
    paddingHorizontal: containerPadding,
  },
  loginButton: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
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
    fontFamily: fonts.SimplonMonoMedium,
    fontSize: hp("1.8%"),
    letterSpacing: 0.7,
    color: colors.white,
    letterSpacing: 0.5,
    textAlign: "center",
    color: colors.black,
  },
  padding: {
    paddingBottom: hp("20%"),
    flexDirection: 'row',
  },
  textPadding: {
    paddingLeft: wp("5%")
  },
  fontText: {
    fontSize: hp('3%'),
    fontWeight: "300",
    fontFamily: fonts.SimplonMonoMedium,
  },
  underline: {
    fontSize: hp('3%'),
    fontWeight: "300",
    textDecorationLine: 'underline',
    fontFamily: fonts.SimplonMonoMedium,
  },
  transformProgram: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    width: wp("90%"),
    height: hp("10%"),
  },
  Text: {
    fontSize: hp('2%'),
    fontFamily: fonts.SimplonMonoMedium,
  }
});
