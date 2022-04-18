import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../../styles/fonts";
import colors from "../../../styles/colors";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const { width } = Dimensions.get('window');

export const lifestyleStyle = StyleSheet.create({
  scrollView: {
    padding: 0,
  },
  welcomeHeaderText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.black,
    margin: 8,
    marginTop: 10,
  },
  welcomeBodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.black,
    margin: 8,
    marginTop: 0,
  },
  workoutProgressContainer: {
    alignItems: 'center',
    borderRadius: 2,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 20,
  },
  sectionHeader: {
    alignItems: 'flex-start',
  },
  bodyText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.grey.dark,
    fontWeight: '500',
    paddingVertical: 20,
    textAlign: "center",
    width: '100%'
  },
  recommendedWorkoutContainer: {
    flexDirection: 'row',
  },
  recommendedWorkoutSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
  },
  recommendedWorkoutText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.charcoal.standard,
    marginTop: 12,
  },
  reminderContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    margin: 5,
    marginRight: 8,
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.black,
    margin: 4,
    marginTop: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.charcoal.darkest,
    shadowColor: colors.grey.dark,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: width - 40,
    borderRadius: 4,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    marginTop: 3,
  },
  roundButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('4%'),
    height: 100,
    marginBottom: 20
  },
  cardContainer: {
    borderRadius: 30,
    height: wp("40%"),
    marginBottom: 18
  },
  flexContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.grey.medium,
    borderRadius: 3,
  },
  opacityLayer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    paddingHorizontal: wp("5%"),
    paddingVertical: wp("4%"),
  },
  titleContainer: {
    maxWidth: width / 1.8,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: wp("6%"),
    textTransform: 'capitalize',
    color: colors.offWhite,
  },
  lookContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%')
  },
  title1: {
    fontFamily: fonts.StyreneAWebRegular,
    fontWeight: '800',
    fontSize: wp("5%"),
    color: colors.black,
  },
  oblongBtnStyle: {
    alignItems: 'center',
    marginVertical: hp('2%'),
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: colors.white,
    color: colors.black,
    marginHorizontal: hp('10%')
  },
});