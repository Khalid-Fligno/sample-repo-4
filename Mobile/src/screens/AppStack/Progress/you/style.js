import {
  StyleSheet,
  Dimensions
} from 'react-native'
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: "center",
  },
  contentContainer: {
    width,
    backgroundColor: colors.offWhite,
    alignItems: "center",
    paddingBottom: 5,
  },
  imagesContainer: {
    width,
    flexDirection: "row",
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: width / 2,
    height: (width / 3) * 2,
  },
  imagePlaceholder: {
    backgroundColor: colors.smoke,
    width: width / 2,
    height: (width / 3) * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderButton: {
    backgroundColor: colors.themeColor.lightColor,
    width: "70%",
    padding: 10,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  disabledImagePlaceHolderButton: {
    backgroundColor: colors.themeColor.lightColor,
    width: "70%",
    padding: 10,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    opacity: 0.5,
  },
  imagePlaceholderButtonText: {
    color: colors.black,
    fontFamily: fonts.standard,
    fontSize: 12,
    textAlign: "center",
  },
  addIcon: {
    alignSelf: "center",
    marginBottom: 10,
  },
  dateRowContainer: {
    width,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
  },
  dataRowContainer: {
    width: width - 20,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 2,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fieldContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.themeColor.lightColor,
  },
  fieldText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.black,
    marginTop: 5,
    marginBottom: 5,
  },
  dataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dataText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.black,
  },
  dataTextPositive: {
    marginBottom: 5,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
  },
  dataTextNegative: {
    marginBottom: 5,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
  },
  buttonContainer: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  workoutProgressContainer: {
    alignItems: "center",
    width: width - 20,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: "transparent",
    borderRadius: 2,
    shadowColor: colors.themeColor.lightColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sectionHeader: {
    alignItems: "center",
    // backgroundColor: colors.themeColor.lightColor,
    width: width - 20,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    padding: 8,
    paddingBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.black,
    fontWeight: "500",
    paddingVertical: 20,
    textAlign: "center",
    width: "100%",
  },
});
