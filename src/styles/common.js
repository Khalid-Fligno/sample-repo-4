import { Dimensions } from 'react-native';
import colors from './colors';
import fonts from './fonts';

const { width } = Dimensions.get('window');

const common = {
  button: {
    solid: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: width - 20,
      borderRadius: 2,
      shadowOpacity: 1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 3,
    },
    outline: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: width - 20,
      borderRadius: 2,
      borderWidth: 4,
      shadowOpacity: 0.5,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 3,
      backgroundColor: colors.white,
    },
    outlineDisabled: {
      backgroundColor: colors.white,
      opacity: 0.5,
    },
    text: {
      fontFamily: fonts.bold,
      fontSize: 16,
      marginTop: 3,
    },
  },
};

export default common;
