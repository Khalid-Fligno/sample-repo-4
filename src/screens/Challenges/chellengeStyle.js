import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
import { containerPadding } from "../../styles/globalStyles";
const { width } = Dimensions.get('window');
const ChallengeStyle = StyleSheet.create({
    Title:{
        padding:20,
        fontSize:25,
        paddingLeft:10
    },
    onBoardingTitle:{
        fontFamily:fonts.bold,
        fontSize:20,
        color:colors.transparentBlackDark
    },
    container: {
        flex: 1,
        backgroundColor: colors.black,
        justifyContent: 'space-between',
      },
   
      btnContainer:{
        //flex:1,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'flex-end'
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
   
  });
  export default  ChallengeStyle