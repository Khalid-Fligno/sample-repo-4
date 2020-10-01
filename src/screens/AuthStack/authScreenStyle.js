import colors from "../../styles/colors";
import { Dimensions, StyleSheet } from "react-native";
import fonts from "../../styles/fonts";
import { containerPadding } from "../../styles/globalStyles";
const { width } = Dimensions.get('window');

const authScreenStyle = StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      backgroundColor: colors.black,
    },
    container: {
      flex: 1,
      backgroundColor: colors.themeColor.themeBackgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      // width,
      // paddingHorizontal:20
    },
    // imageBackground: {
    //   flex: 1,
    //   width: undefined,
    //   height: undefined,
    // },
    scrollView: {
      alignItems: 'center',
    },
    closeIconContainer: {
      alignItems: 'flex-end',
      width,
    },
    closeIconButton: {
      padding: containerPadding,
      paddingBottom:0,
      // paddingLeft: 20,
      // paddingBottom: 20,
      // shadowColor: colors.charcoal.standard,
      // shadowOpacity: 0.5,
      // shadowOffset: { width: 0, height: 2 },
      // shadowRadius: 1,
    },
    
    appleButton: {
      // height: 45,
      width: width - containerPadding*2,
      marginTop: 8,
      borderWidth:2,
      borderColor:colors.grey.standard,
      borderRadius:30,
      padding:27,
    },
    dividerOverlay: {
      marginVertical:20,
      backgroundColor: colors.transparent,
    },
    dividerOverlayText: {
      fontFamily: fonts.bold,
      fontSize: 18,
      color: colors.grey.standard,
      textAlign:'center'
    },
    navigateToButton: {
      // fontWeight:'700',
      fontFamily:fonts.bold,
      letterSpacing:0.5,
      fontSize: 16,
      marginTop: 50,
      textAlign: 'center',
      color: colors.themeColor.color,
      // textDecorationStyle: 'solid',
      // textDecorationColor: colors.themeColor.color,
      // textDecorationLine: 'underline',
    },
  
  });
  
  export default authScreenStyle