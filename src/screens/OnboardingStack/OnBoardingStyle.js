import { StyleSheet, Dimensions } from "react-native";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";
const { width } = Dimensions.get('window');
const onboardingStyle = StyleSheet.create({
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
   
  });
  export default  onboardingStyle