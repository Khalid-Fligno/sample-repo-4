import {
  Dimensions,
  StyleSheet
} from "react-native";
import colors from "../colors";
import fonts from "../fonts";
import { containerPadding } from "../globalStyles";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const { width } = Dimensions.get("window");

export const forgottenPasswordStyle = StyleSheet.create({
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
  formInputContainer: {
    alignItems: "center",
    paddingTop: "10%"
  },
  navigateButtonContainer: {
    display: "flex",
    alignItems: "center",
    bottom: 50,
  },
  Input: {
    height: hp("6%"),
    width: width - containerPadding * 2,
    padding: 8,
    margin: 5,
    borderWidth: 1,
    fontSize: hp('2%'),
    alignItems: "center",
    fontFamily: fonts.SimplonMonoMedium,
  },
});  