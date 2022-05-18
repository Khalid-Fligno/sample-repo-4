import { StyleSheet } from "react-native";
import colors from "../../colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts from "../../fonts";

export const feedStyle = StyleSheet.create({
  scrollView: {
    padding: 0,
  },
  oblongBtnStyle: {
    alignItems: "center",
    marginTop: hp("2%"),
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: colors.white,
    color: colors.black,
    height: hp("8%"),
    marginHorizontal: hp("10%"),
  },
  lookContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("3%"),
  },
  title1: {
    fontFamily: fonts.StyreneAWebRegular,
    fontWeight: "800",
    fontSize: wp("5%"),
    color: colors.black,
  },
  bars: {
    borderRadius: 0,
    width: wp("8%"),
    height: 5,
    right: wp("10%"),
    bottom: hp("1%"),
    top: wp("2%"),
  },
});
