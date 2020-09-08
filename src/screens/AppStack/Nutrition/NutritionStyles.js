import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { containerPadding } from "../../../styles/globalStyles";
const { width } = Dimensions.get('window');
const NutritionStyles = StyleSheet.create({

// Recipe Screen*************************

    container: {
      flex: 1,
      backgroundColor: colors.containerBackground,
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
      backgroundColor: colors.violet.standard,
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
      borderColor: colors.violet.standard,
      borderRadius: 4,
    },
    calendarMealButtonActive: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.violet.standard,
    },
    calendarMealButtonText: {
      fontFamily: fonts.standard,
      fontSize: 14,
      color: colors.violet.standard,
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
  });
  
  export default NutritionStyles