import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../../styles/fonts";
import colors from "../../../styles/colors";
const { width } = Dimensions.get('window');
const WorkoutScreenStyle = StyleSheet.create({
  carouselContainer: {
    paddingBottom: 8,
    ...Platform.select({
      android: {
        height: width + 40,
        width: width,
      }
    })
  },
  slide: {
    flex: 1,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    resizeMode: 'cover',
    height: '100%',
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  titleContainer: {
    justifyContent: 'center',
    paddingTop: 8,
    paddingRight: 12,
    paddingBottom: 3,
    paddingLeft: 12,
    borderRadius: 2,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
  },
  weeklyTargetText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.white,
    textAlign: 'center',
    shadowColor: colors.black,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
  },
    scrollView: {
      padding: 0,
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
    /***********workout Info**************/
    flatListContainer: {
      width,
      backgroundColor: colors.grey.light,
    },
    hiitIcon: {
      margin: 2,
    },
    workoutInfoFieldData: {
      fontFamily: fonts.bold,
      fontSize: 12,
      color: colors.charcoal.standard,
      marginTop: 8,
    },
    workoutPreviewContainer: {
      width,
      backgroundColor: colors.grey.light,
      paddingTop: 13,
      paddingBottom: 15,
    },
    workoutPreviewHeaderContainer: {
      width,
      backgroundColor: colors.grey.light,
      paddingTop: 12,
    },
    workoutPreviewHeaderText: {
      textAlign: 'center',
      fontFamily: fonts.standard,
      fontSize: 14,
      color: colors.charcoal.dark,
    },
    workoutInfoContainer: {
      backgroundColor: colors.white,
    },
     workoutNameContainer: {
      width,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingLeft: 20,
      paddingBottom: 10,
      paddingRight: 20,
    },
    workoutName: {
      marginTop: 6,
      marginRight: 10,
      fontFamily: fonts.bold,
      fontSize: 20,
      color: colors.themeColor.color,
    },
    workoutIconsRow: {
      width,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: 15,
    },
    workoutIconContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    workoutInfoFieldData: {
      fontFamily: fonts.bold,
      fontSize: 12,
      color: colors.charcoal.standard,
      marginTop: 8,
    },musicModalContainer: {
      flexShrink: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 4,
      overflow: 'hidden',
    },
    musicModalHeaderText: {
      fontFamily: fonts.bold,
      fontSize: 28,
      color: colors.charcoal.light,
      marginBottom: 10,
    },
    musicModalTextContainer: {
      width: '100%',
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      padding: 15,
    },
    musicIconContainer: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: colors.grey.light,
      borderRadius: 4,
    },  appleMusicDisabled: {
      marginRight: 10,
      opacity: 0.1,
      shadowOpacity: 0,
    },
    spotifyDisabled: {
      opacity: 0.1,
      shadowOpacity: 0,
    },
    musicIconImage: {
      height: 60,
      width: 60,
    },
    musicModalButtonContainer: {
      backgroundColor: colors.white,
      width: '100%',
    },
    musicModalCancelButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.charcoal.standard,
      height: 50,
      width: '100%',
    },
    musicModalContinueButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.themeColor.color,
      height: 50,
      width: '100%',
    },
    musicModalButtonText: {
      fontFamily: fonts.bold,
      fontSize: 14,
      color: colors.white,
      marginTop: 3,
    },  appleMusicIcon: {
      marginRight: 10,
      shadowColor: colors.grey.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 3,
    },
    spotifyIcon: {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.6,
      shadowRadius: 3,
    },
    exerciseTile: {
      width: width - 30,
      marginTop: 7.5,
      marginBottom: 20,
      marginLeft: 15,
      marginRight: 15,
      borderWidth: 2,
      borderRadius: 4,
      borderColor: colors.themeColor.color,
      overflow: 'hidden',
    },
    exerciseTileHeaderBar: {
      width: width - 34,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 8,
      paddingBottom: 5,
      backgroundColor: colors.themeColor.color,
    },
    exerciseTileHeaderTextLeft: {
      // width: width - 72,
      fontFamily: fonts.standardNarrow,
      fontSize: 14,
      color: colors.white,
    },
    exerciseTileHeaderBarRight: {
      // width: 30,
      fontFamily: fonts.standardNarrow,
      fontSize: 13,
      color: colors.white,
    },
    exerciseDescriptionContainer: {
      width: width - 30,
      marginTop: 7.5,
      marginBottom: 20,
      marginLeft: 15,
      marginRight: 15,
      borderWidth: 2,
      borderRadius: 4,
      borderColor: colors.themeColor.color,
      backgroundColor: colors.white,
      overflow: 'hidden',
    },
    exerciseDescriptionTextContainer: {
      padding: 15,
    },
    exerciseDescriptionHeader: {
      fontFamily: fonts.bold,
      fontSize: 13,
      color: colors.charcoal.standard,
    },
    exerciseDescriptionText: {
      fontFamily: fonts.standard,
      fontSize: 13,
      color: colors.charcoal.standard,
      marginTop: 3,
      marginBottom: 3,
    },
   
     /**********workout Info***************/


//*************Workout Home Screen **************** */
    subTitleText:{
      fontFamily:fonts.bold,
      fontSize:15,
      lineHeight:40,
      color:colors.grey.dark
    },
    description:{
      color:colors.grey.dark,
       fontFamily:fonts.standard,
       marginVertical:8,
    },
//*************Workout Home Screen **************** */

      
  });
  export default  WorkoutScreenStyle