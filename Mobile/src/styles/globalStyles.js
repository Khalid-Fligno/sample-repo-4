import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import colors from "./colors";
import fonts from "./fonts";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
const { width } = Dimensions.get("window");
export const containerPadding = 20;
const globalStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.themeColor.themeBackgroundColor,
    paddingHorizontal: containerPadding,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: colors.themeColor.themeBackgroundColor,
  },
  scrollView: {
    paddingTop: 15,
    alignItems: "center",
  },

  //Big Heading Back Button
  bigHeadingTitleContainer: {
    height: 50,
    marginVertical: hp("2%"),
    // backgroundColor:"green",
    paddingTop: 10,
  },
  bigHeadingTitleText: {
    // fontSize:35,
    fontSize: hp("4%"),
    fontFamily: fonts.SimplonMonoLight,
    color: colors.black,
    letterSpacing: 0.5,
    textTransform: "capitalize",
  },
  bigHeadingWithBackButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.themeColor.color,
    marginLeft: 5,
  },
  //**********END ************* */
  //Custom Filter Button Style Section
  absoluteFilterButtonsContainer: {
    // width: width - 40,
    // shadowColor: colors.grey.dark,
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.7,
    // shadowRadius: 2,
    marginTop: 10,
    padding: 0,
  },
  filterButtonsContainer: {
    height: 40,
    backgroundColor: colors.themeColor.themeBackgroundColor,
    borderWidth: 0,
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  filterButton: {
    backgroundColor: colors.themeColor.themeBackgroundColor,
    borderColor: colors.violet.standard,
    borderBottomWidth: 2,
    borderColor: colors.grey.light,
    marginRight: -1,
    marginLeft: -1,
  },
  filterButtonText: {
    fontFamily: fonts.standard,
    fontSize: wp("2.5%"),
    color: colors.grey.standard,
    marginTop: 2,
    fontWeight: "bold",
  },
  filterButtonSelected: {
    backgroundColor: colors.themeColor.themeBackgroundColor,
    borderBottomWidth: 2,
    borderColor: colors.themeColor.color,
  },
  filterButtonTextSelected: {
    fontFamily: fonts.standard,
    fontSize: 11,
    color: colors.black,
    marginTop: 2,
  },
  //*********** END***************/

  //*************Component model**************** */
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: "hidden",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor.color,
    height: 50,
    width: "100%",
    marginBottom: 0,
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.transparentBlackLight,
  },
  carouselsContainer: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 5,
  },
  flexContainer: {
    flex: 1,
    alignItems: "center",
  },
  flex: {
    flex: 1,
  },
  carouselTitleContainer: {
    width: width * 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  carouselTitle: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.grey.dark,
    marginTop: 3,
  },
  chevron: {
    alignSelf: "center",
  },
  buttonContainer: {
    paddingBottom: 10,
  },

  //*************Component model END********************* */
  /**************Start****************** */
  defaultHeaderShadow: {
    backgroundColor: colors.black,
    shadowColor: colors.charcoal.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  noShadow: {
    backgroundColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderBottomWidth: 0,
  },
  logoutButton: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
    marginLeft: 4,
  },
  skipButton: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
    marginRight: 4,
  },

  headerContentContainer: {
    flexGrow: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContentContainerLeft: {
    flex: 1,
    height: 50,
    paddingLeft: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  headerContentContainerRight: {
    flex: 1,
    height: 50,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  headerContentContainerRightLoading: {
    flex: 1,
    height: 50,
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  activityIndicator: {
    marginRight: 10,
  },
  headerTitleText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
  },
  fitazfkIcon: {
    width: 120,
    height: 50,
  },
  /**************END******************** */

  /**************Select Box ************** */
  selectBoxContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 30,
  },
  selectBox: {
    height: 50,
    width: "75%",
    borderWidth: colors.themeColor.themeBorderWidth,
    borderColor: colors.themeColor.themeBorderColor,
    marginTop: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 50,
  },
  selectBoxText: {
    fontFamily: fonts.GothamMedium,
    fontSize: 15,
  },
  selectedBox: {
    borderColor: colors.themeColor.color,
  },
  /************** /Select Box ************** */

  /***************FItness level box */
  FT_ImageContainer: {
    width: width - containerPadding * 2,
    height: 110,
    marginTop: 20,
  },
  FT_InnerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  FT_Title: {
    fontSize: 20,
    fontWeight: fonts.fontWeight,
    color: colors.offWhite,
    letterSpacing: fonts.letterSpacing,
    marginStart: 15,
  },

  FT_Paragraph: {
    fontSize: 12,
    fontWeight: fonts.fontWeight,
    color: colors.offWhite,
    letterSpacing: fonts.letterSpacing,
    marginStart: 15,
  },

  /***************FItness level box */
});

export default globalStyle;
