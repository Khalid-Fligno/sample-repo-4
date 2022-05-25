import {
    Dimensions,
    StyleSheet
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { containerPadding } from "../../../styles/globalStyles";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
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