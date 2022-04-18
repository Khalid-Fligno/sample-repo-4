import colors from "../../styles/colors";
import { 
  Dimensions, 
  StyleSheet 
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { containerPadding } from "../globalStyles";
import fonts from "../fonts";

const { width } = Dimensions.get("window");

export const findAccountStyle = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: colors.themeColor.themeBackgroundColor,
  },
  crossIconContainer: {
    alignItems: "flex-end",
    padding: 20
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "10%"
  },
  formHeaderContainer: {
    width: wp("90%"),
    alignItems: "center"
  },
  formInputContainer: {
    paddingTop: hp("3%")
  },
  navigateButtonContainer: {
    display: "flex",
    alignItems: "center",
    bottom: 50,
  },
  Text: {
    fontSize: hp('3%'),
    fontFamily: fonts.bold,
    textAlign: 'center'
  },
  Input: {
    height: hp("6%"),
    width: width - containerPadding * 2,
    padding: 8,
    margin: 5,
    borderWidth: 1,
    fontSize: hp('2%'),
    alignItems: "center",
    fontFamily: fonts.SimplonMonoMedium
  },
  navigateToButton: {
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
    fontSize: 16,
    marginTop: width / 10,
    textAlign: "center",
    color: colors.black,
  }
});