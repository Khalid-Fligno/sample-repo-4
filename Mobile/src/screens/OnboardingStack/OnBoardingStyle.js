import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
const { width } = Dimensions.get("window");
const onboardingStyle = StyleSheet.create({
  onBoardingTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.transparentBlackDark,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "space-between",
  },
  IntensityTitleText: {
    fontSize: 14,
    color: "#d4d8db",
    fontWeight: fonts.fontWeight,
    letterSpacing: fonts.letterSpacing,
  },
});
export default onboardingStyle;
