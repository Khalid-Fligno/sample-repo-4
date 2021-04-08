import { StyleSheet, Dimensions } from "react-native";
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
const { width } = Dimensions.get('window');
import { heightPercentageToDP as hp ,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";



const calendarStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.offWhite,
      },
      calendarStripContainer: {
        // shadowColor: colors.grey.dark,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 2,
        borderBottomWidth:2,
        borderBottomColor:colors.grey.light,
        paddingBottom:10,
        paddingHorizontal:5
      },
      calendarStrip: {
        height: 90,
        paddingTop: 10,
        paddingBottom: 20,
      },
      calendarStripHeader: {
        fontFamily: fonts.bold,
        color: colors.themeColor.color,
        marginTop: 0,
        marginBottom: 15,
      },
      dayDisplayContainer: {
        alignItems: 'center',
      },
      headerText: {
        fontFamily: fonts.bold,
        fontSize: wp('4.5%'),
        color: colors.charcoal.dark,
        marginVertical: wp('4%'),
        // marginBottom: -10,
      },
      listContainer: {
        width,
        // marginTop: 10,
        // borderWidth: 0,
        // borderTopColor: colors.grey.light,
        // shadowColor: colors.grey.standard,
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // shadowRadius: 3,
        paddingHorizontal:20
      },
      listContainerBottom: {
        width,
        marginTop: 20,
        borderTopWidth: 0,
        borderTopColor: colors.grey.light,
        shadowColor: colors.grey.standard,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      listItemContainer: {
        width:'100%',
        // height: 80,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderBottomWidth: 2,
        borderBottomColor: colors.grey.light,
        paddingHorizontal:0
      },
    
      blankListItemTitle: {
        fontFamily: fonts.bold,
        fontSize: 14,
        color: colors.charcoal.dark,
        marginBottom: 5,
        textTransform:'capitalize'
      },
      blankListItemSubtitle: {
        fontFamily: fonts.GothamMedium,
        fontSize: 12,
        color: colors.grey.dark,
      },
      workoutListItemTitle: {
        fontFamily: fonts.bold,
        fontSize: 14,
        color: colors.themeColor.color,
        marginBottom: 5,
      },
      workoutSubtitleContainer: {
        flexDirection: 'row',
        // marginLeft: 8,
      },
      workoutSubtitleText: {
        fontFamily: fonts.GothamMedium,
        color: colors.grey.dark,
        marginTop: 4,
        marginLeft: 5,
        marginRight: 15,
        textTransform:'capitalize'
      },
      recipeListItemTitle: {
        fontFamily: fonts.bold,
        fontSize: 14,
        color: colors.themeColor.color,
        marginBottom: 5,
        textTransform:'capitalize'
      },
      recipeListItemSubtitle: {
        fontFamily: fonts.standard,
        fontSize: 12,
        color: colors.charcoal.standard,
      },
      deleteButton: {
        width: 80,
        //height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.themeColor.color,
      },
      deleteButtonText: {
        fontFamily: fonts.bold,
        color: colors.white,
        marginTop: 4,
      },
    
      ChallengeProgressCardContainer:{
        flexDirection:'column',
        alignItems:'center',
        width:width-containerPadding*2
      },
      challengeLabel:{
        fontSize:wp('4.5%'),
        fontFamily:fonts.bold,
        color:colors.charcoal.dark,
        marginVertical:hp('2%')
      },
      challengeProgressContainer:{
        flexDirection:'column',
        width:'100%',
        marginTop:-20
      },
    //   progressCircleContainer:{
    //     width:'50%',
    //     borderRightWidth:2,
    //     borderRightColor:colors.grey.light,
    //     paddingLeft:wp('3.5%')
    //   },
      progressCircleContainer:{
        width:'100%',
      },
     phaseContainer:{
       width:'100%',
       alignItems:'center'
      },
      phaseBodyText:{
        marginTop:hp('1.3%'),
        fontSize:hp('1.4%'),
        color:"#8d8d8d",
        fontFamily:fonts.GothamMedium
      },
      sliderContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    sliderSideText:{
        fontFamily:fonts.GothamMedium,
        color:colors.grey.dark,
        fontSize:13
   },
   slider:{
    flex: 1, 
    alignItems: 'stretch', 
    justifyContent: 'center',
    marginHorizontal:10 
    }
});

export default calendarStyles