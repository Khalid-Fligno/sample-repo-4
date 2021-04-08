import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import { containerPadding } from "../../styles/globalStyles";
const { width } = Dimensions.get('window');
const ChallengeStyle = StyleSheet.create({
    Title:{
        padding:25,
        fontSize:23,
        paddingLeft:0,
        fontFamily:fonts.GothamMedium,
        paddingBottom:5
    },
    onBoardingTitle:{
        fontFamily:fonts.bold,
        fontSize:30,
        color:colors.black,
        marginTop:10
    },
    container: {
        flex: 1,
        backgroundColor: colors.black,
        justifyContent: 'space-between',
      },
   
      btnContainer:{
        //flex:1,
        justifyContent:'space-between',
        flexDirection:'column',
        alignItems:'flex-end',
      },
      checkBoxConteiner:{
          backgroundColor:'transparent',
          borderWidth:0,
          padding:0,
          marginLeft:0,
          marginRight:0,
        },
    checkBox:{
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center',
        marginVertical:20
        },
    inputButton:{
          width:width/2,
          padding: 15,
          paddingBottom: 12,
          backgroundColor: colors.white,
          borderWidth: colors.themeColor.themeBorderWidth,
          borderColor: colors.themeColor.themeBorderColor,
          borderRadius: 2,
          marginLeft:20
        },
    inputSelectionText: {
          fontFamily: fonts.bold,
          fontSize: 14,
          color: colors.charcoal.dark,
        },
        IntensityTitleText:{
          fontSize: 15,
          color: '#d4d8db',
          fontWeight:fonts.fontWeight,
          letterSpacing:fonts.letterSpacing
         },
         errorText: {
          fontFamily: fonts.standard,
          fontSize: 12,
          color: colors.themeColor.color,
          textAlign: 'center',
          margin: 10,
          marginVertical:10,
        },
        filtnesslevelTitle: {
          marginLeft: 2,
          fontFamily: fonts.bold,
          fontSize: 14,
          color: colors.charcoal.light,
          marginBottom: 10,
        },
  });
  export default  ChallengeStyle