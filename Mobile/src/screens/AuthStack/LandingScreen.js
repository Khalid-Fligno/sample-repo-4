import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Dimensions,
  StatusBar,
  ImageBackground,
  Platform,
} from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import CustomBtn from "../../components/Shared/CustomBtn";
import { containerPadding } from "../../styles/globalStyles";
import { db } from "../../../config/firebase";
const { width, height } = Dimensions.get("window");
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { getVersion } from "react-native-device-info";
import { checkVersion } from "react-native-check-version";
import AsyncStorage from "@react-native-community/async-storage";
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
      const version = await checkVersion();
      const versionCodeRef = db
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
            <ImageBackground
              source={require("../../../assets/images/OnBoardindImg/Thessy238.jpeg")}
              style={styles.carouselImageBackground}
            >
              <View style={styles.opacityOverlayTransparent} />
            </ImageBackground>
          </View>
          <View style={styles.absoluteButtonContainer}>
            <View style={styles.buttonContainer}>
              <CustomBtn
                customBtnStyle={{
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
                  padding: 12,
                  margin: 5,
                  borderColor: colors.black,
                  backgroundColor: colors.black,
                }}
                outline={false}
                Title="TRANSFORM"
                customBtnTitleStyle={{ color: colors.white }}
                onPress={() =>
                  this.props.navigation.navigate("Signup", { specialOffer })
                }
              />
              <CustomBtn
                customBtnStyle={{
                  padding: 12,
                  margin: 5,
                  borderColor: colors.themeColor.color,
                }}
                outline={false}
                Title="Sign In"
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
});
