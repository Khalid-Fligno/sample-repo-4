import { StyleSheet } from "react-native";
import colors from "../colors";
import fonts from "../fonts";


export const specialOfferStyle = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingLarge: {
    fontFamily: fonts.ultraItalic,
    fontSize: 36,
    color: colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  heading: {
    fontFamily: fonts.standard,
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    padding: 15,
    paddingBottom: 0,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: 200,
    borderRadius: 4,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    backgroundColor: colors.coral.standard,
    shadowColor: colors.black,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
  disclaimer: {
    fontFamily: fonts.standard,
    fontSize: 8,
    color: colors.white,
    textAlign: 'center',
    padding: 15,
  },
});