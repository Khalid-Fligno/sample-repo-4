import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { containerPadding } from "../../../styles/globalStyles";
const { width } = Dimensions.get('window');
const NutritionStyles = StyleSheet.create({

// Recipe Screen*************************

    container: {
      flex: 1,
      backgroundColor: colors.themeColor.backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    recipeInfoContainer: {
      padding: 15,
    },
    recipeTitle: {
      fontFamily: fonts.bold,
      fontSize: 24,
      color: colors.charcoal.standard,
    },
    recipeSubTitle: {
      fontFamily: fonts.standardItalic,
      fontSize: 16,
      color: colors.charcoal.standard,
      marginBottom: 8,
    },
    addToCalendarButtonContainer: {
      marginBottom: 10,
    },
    modalContainer: {
      backgroundColor: colors.white,
      borderRadius: 4,
      overflow: 'hidden',
    },
    modalButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.black,
      height: 50,
      width: '100%',
      marginBottom: 0,
    },
    disabledModalButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.grey.standard,
      height: 50,
      width: '100%',
      marginBottom: 0,
    },
    modalButtonText: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: colors.white,
      marginTop: 3,
    },
    calendarMealButtonContainer: {
      flexDirection: 'row',
      width: '100%',
      padding: 4,
    },
    calendarMealButton: {
      flex: 1,
      margin: 5,
      paddingTop: 8,
      paddingBottom: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.themeColor.color,
      borderRadius: 4,
    },
    calendarMealButtonActive: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.themeColor.color,
    },
    calendarMealButtonText: {
      fontFamily: fonts.standard,
      fontSize: 14,
      color: colors.themeColor.color,
    },
    calendarMealButtonTextActive: {
      fontFamily: fonts.standard,
      fontSize: 14,
      color: colors.white,
    },
    divider: {
      backgroundColor: colors.grey.standard,
    },
    infoBar: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    //   justifyContent: 'space-between',
      width: width - 30,
      paddingVertical:12
    },
    infoFieldContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5,
    },
    infoText: {
      fontFamily: fonts.standard,
      color: colors.grey.dark,
      marginLeft: 8,
    },

    recipeSummaryText: {
      fontFamily: fonts.standard,
      fontSize: 14,
      color: colors.charcoal.standard,
      marginTop: 15,
    },
    ingredientsContainer: {
    //   padding: 15,
    //   borderWidth: 1,
    //   borderColor: colors.grey.light,
    //   borderRadius: 10,
      marginTop: 15,
    },
    ingredientsHeading: {
      fontFamily: fonts.bold,
      fontSize: 18,
      color: colors.charcoal.standard,
      marginBottom: 5,
    },
    ingredientsText: {
      fontFamily: fonts.standard,
      fontSize: 14,
      color: colors.charcoal.standard,
      marginTop: 3,
      marginBottom: 3,
      lineHeight:20
    },

    //****************End************* */
    /*************Start******************* */
    carouselCard: {
      flex: 1,
      marginTop: 12,
      marginBottom: 12,
      borderRadius: 5,
      backgroundColor: colors.white,
      shadowColor: colors.themeColor.darkColor,
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 5,
      borderWidth: 1,
      borderColor: colors.themeColor.darkColor,
    },
    carouselHeaderContainer: {
      backgroundColor: colors.white,
      borderRadius: 5,
    },
    carouselHeaderContentContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.themeColor.darkColor,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    },
    carouselHeaderText: {
      fontFamily: fonts.bold,
      fontSize: 16,
      color: colors.themeColor.color,
      marginTop: 3,
    },
    carouselHeaderButton: {
      width: 45,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.themeColor.darkColor,
      shadowOpacity: 0.4,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 1,
    },
    carouselContentContainer: {
      flex: 1,
      backgroundColor: colors.offWhite,
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
    },
    carouselBottomContainer: {
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 10,
    },
    carouselTextContainer: {
      backgroundColor: colors.themeColor.color,
      borderRadius: 20,
      borderBottomRightRadius: 4,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 10,
      paddingLeft: 12,
    },
    carouselText: {
      fontFamily: fonts.medium,
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.white,
    },
    /*************End*********************** */
  });
  
  export default NutritionStyles