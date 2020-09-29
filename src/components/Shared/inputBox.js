
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text, ColorPropType, StyleSheet, Dimensions } from 'react-native'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import PropTypes from 'prop-types';
import { Input } from 'react-native-elements'
const { width } = Dimensions.get('window');
const InputBox = (props)=>{
  let [isFocused,setFocused] = useState(false)
    return(
        <Input
        placeholderTextColor={colors.grey.standard}
        returnKeyType="next"
        autoCorrect={false}
        autoCapitalize="none"
        containerStyle={ styles.inputComponentContainer}
        inputContainerStyle={isFocused? styles.inputContainer1:styles.inputContainer}
        clearButtonMode="while-editing"
        onFocus={()=>setFocused(true)}
        {...props}
        onEndEditing={()=>setFocused(false)}
        />
        
    )
}

// InputBox.propTypes = {
//     placeholder:PropTypes.any,
//     value:PropTypes.any,
//     keyboardType:PropTypes.any,
//     onChangeText:PropTypes.any,
//     onSubmitEditing:PropTypes.any,
  
//   };

  const styles = StyleSheet.create({

    inputComponentContainer: {
      width: width - 30,
      alignItems: 'center',
    },
    inputContainer: {
      // width: width - 30,
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 5,
      borderBottomWidth: 2,
      backgroundColor: colors.transparentWhiteLight,
      // borderRadius: 4,
      borderBottomColor: colors.grey.light
    },
    inputContainer1: {
        // width: width - 30,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5,
        borderBottomWidth: 2,
        backgroundColor: colors.transparentWhiteLight,
        // borderRadius: 4,
        borderBottomColor:colors.themeColor.color
      },
    input: {
      width: width - 30,
      padding: 12,
      fontFamily: fonts.bold,
      fontSize: 14,
      color: colors.white,
      borderWidth: 1,
      borderColor: colors.grey.light,
      borderRadius: 4,
    },
   
  });
  

export default InputBox

// inputComponentContainer: {
  //   width: width - 30,
  //   alignItems: 'center',
  // },
  // inputContainer: {
  //   // width: width - 30,
  //   alignItems: 'center',
  //   marginTop: 5,
  //   marginBottom: 5,
  //   borderBottomWidth: 2,
  //   backgroundColor: colors.transparentWhiteLight,
  //   // borderRadius: 4,
  //   borderBottomColor:isFocused?colors.themeColor.color: colors.grey.light
  // },
  // input: {
  //   width: width - 30,
  //   padding: 12,
  //   fontFamily: fonts.bold,
  //   fontSize: 14,
  //   color: colors.white,
  //   borderWidth: 1,
  //   borderColor: colors.grey.light,
  //   borderRadius: 4,
  // },
  // loginButtonContainer: {
  //   marginTop: 7,
  //   marginBottom: 7,
  //   shadowColor: colors.charcoal.dark,
  //   shadowOpacity: 0.5,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 3,
  // },
  // loginButton: {
  //   backgroundColor: colors.coral.standard,
  //   height: 45,
  //   width: width - 30,
  //   borderRadius: 4,
  // },
  // loginButtonText: {
  //   marginTop: 4,
  //   fontFamily: fonts.bold,
  //   fontSize: 15,
  // },