import {
  StyleSheet,
  Dimensions
} from 'react-native'
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import { containerPadding } from "../../../styles/globalStyles";

const { width } = Dimensions.get("window");

export const onboarding1Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.offWhite,
  },
  buttonRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - containerPadding * 2,
    marginTop: 15,
  },

  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingHorizontal: containerPadding,
  },
  headerText: {
    fontFamily: fonts.SimplonMonoLight,
    fontSize: 40,
    color: colors.offWhite,
    marginBottom: 7,
    textTransform: "capitalize",
  },
  bodyText: {
    fontFamily: fonts.StyreneAWebRegular,
    fontSize: 13,
    color: "#eaeced",
    width: "65%",

    letterSpacing: fonts.letterSpacing,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  inputFieldContainer: {
    marginBottom: 20,
  },
  inputFieldTitle: {
    marginLeft: 2,
    fontSize: 15,
    color: colors.black,
    marginBottom: 5,
    fontFamily: fonts.StyreneAWebRegular,
    letterSpacing: fonts.letterSpacing,
  },
  inputButton: {
    width: width - containerPadding * 2,
    padding: 15,
    paddingBottom: 12,
    backgroundColor: colors.containerBackground,
    borderBottomWidth: 2,
    paddingLeft: 0,
    borderColor: colors.themeColor.color,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  inputSelectionText: {
    fontFamily: fonts.StyreneAWebRegular,
    letterSpacing: fonts.letterSpacing,
    fontSize: 15,
    color: colors.grey.dark,
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: "flex-start",
    padding: 10,
    width: width - containerPadding * 2,
  },
});