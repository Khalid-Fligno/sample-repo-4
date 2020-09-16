import { StyleSheet, Dimensions } from "react-native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import { containerPadding } from "../../../styles/globalStyles";
const { width } = Dimensions.get('window');
const ProfileStyles = StyleSheet.create({
  scrollView: {
    width,
    padding: 15,
  },
  avatarOutline: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBackdrop: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.grey.standard,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  nameTextContainer: {
    width,
    alignItems: 'center',
  },
  nameText: {
    marginTop: 15,
    fontFamily: fonts.bold,
    fontSize: 24,
  },

  listContainer: {
    width,
    marginBottom: 20,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  listItemContainer: {
    borderBottomColor: colors.grey.light,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
  },
  listItemContainerBottom: {
    backgroundColor: colors.white,
  },
  listItemTitleStyle: {
    fontFamily: fonts.bold,
    color: colors.grey.standard,
    fontSize: 14,
  },
  listItemSubtitleStyle: {
    fontFamily: fonts.bold,
    color: colors.charcoal.standard,
    fontSize: 14,
    marginTop: 5,
  },
  listItemContainerGreen: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0,
    backgroundColor: colors.themeColor.lightColor,
  },
 
  listItemTitleStyleGreen: {
    fontFamily: fonts.bold,
    color: colors.green.forest,
    marginTop: 5,
    fontSize: 14,
  },
  header: {
    fontFamily: fonts.bold,
    fontSize: 24,
    marginBottom: 10,
  },
  paragraphHeading: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.dark,
    marginTop: 5,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
    marginBottom: 8,
  },
  link: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.blue.vivid,
    marginBottom: 8,
    textDecorationStyle: 'solid',
    textDecorationColor: colors.blue.vivid,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  });
  
  export default ProfileStyles