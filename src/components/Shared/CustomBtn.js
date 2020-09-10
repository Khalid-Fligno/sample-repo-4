import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text } from 'react-native'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import PropTypes from 'prop-types';

const CustomBtn = (props)=>{
   const customBtnStyle = {
        flexDirection:"row",
        backgroundColor:colors.themeColor.color,
        padding:18,
        justifyContent:'center',
    }
    const customBtnTitleStyle ={
        fontFamily: fonts.bold,
        fontSize: 14,
        marginTop: 3,
        color:colors.white
    }
    return(
        <TouchableOpacity
           style={[customBtnStyle,props.style,props.customBtnStyle]}
           activeOpacity={0.5}
           onPress={props.onPress}
        >
            <Text style={[customBtnTitleStyle,props.customBtnTitleStyle]}>{props.Title}</Text>
        </TouchableOpacity>
    )
}

CustomBtn.propTypes = {
    customBtnStyle:PropTypes.object,
    customBtnTitleStyle:PropTypes.object,
    Title:PropTypes.string
  };

export default CustomBtn