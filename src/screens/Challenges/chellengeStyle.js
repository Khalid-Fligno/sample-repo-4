import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
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
      selectBox:{
        height:50,
        width:'48%',
        borderWidth:colors.themeColor.themeBorderWidth,
        borderColor:colors.themeColor.themeBorderColor,
        marginTop:20,
        alignItems:'center',
        flexDirection:"column",
        justifyContent:'center',

      },
      selectBoxText:{
        fontFamily:fonts.standard
      },
      btnContainer:{
        flex:1,
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'flex-end'
      },
      checkBoxConteiner:{
          backgroundColor:'transparent',
          borderWidth:0
        },
    checkBox:{
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'flex-end',
        },
  });
  export default  ChallengeStyle