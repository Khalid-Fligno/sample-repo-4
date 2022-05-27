import { 
  StyleSheet,
  Dimensions
} from "react-native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.themeColor.themeBackgroundColor,
    alignItems: "center",
  },
  imageBackgroundContainer: {
    height: width / 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingBottom: 15,
    paddingLeft: 25,
  },
  smallheaderText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.black,
    textAlign: "center",
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.offWhite,
    textAlign: "center",
  },
  headerText2: {
    fontSize: 30,
    marginTop: 0,
    fontWeight: "700",
    fontStyle: "italic",
    color: colors.themeColor.color,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    width,
  },
  subscriptionTileRow: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  chevronUp: {
    alignSelf: "center",
  },
  disclaimerTextContainer: {
    width,
    padding: 20,
    paddingTop: 10,
  },
  link: {
    color: colors.blue.standard,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  subscriptionTermsTitle: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.black,
  },
  disclaimerText: {
    fontFamily: fonts.standard,
    fontSize: 8,
    color: colors.black,
  },
  paymentOptionText: {
    fontFamily: fonts.GothamMedium,
    fontSize: 12,
    color: colors.grey.dark,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  }
});