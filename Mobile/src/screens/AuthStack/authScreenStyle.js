import colors from "../../styles/colors";
import { StyleSheet } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const authScreenStyleV2 = StyleSheet.create({
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
  imageContainer: {
    alignItems: "center",
		padding: 10
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
});

export default authScreenStyleV2;
