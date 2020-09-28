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
        padding:17,
        justifyContent:'center',
        
    }
    const customBtnTitleStyle ={
        // fontFamily: fonts.bold,
        fontSize: 14,
        // marginTop: 3,
        color:colors.white,
        letterSpacing:0.5
    }
    const outlineBtnStyle ={
        backgroundColor:colors.themeColor.themeBackgroundColor,
        borderColor:colors.themeColor.color,
        borderWidth:2
    }
    const outlineBtnTitleStyle ={
        color:colors.themeColor.color,
        fontSize:19,
        fontWeight:'500',
    }
    return(
        <TouchableOpacity
           style={[customBtnStyle,props.style,props.customBtnStyle,props.outline?outlineBtnStyle:{}]}
           activeOpacity={0.5}
           onPress={props.onPress}
        >
            <Text style={[customBtnTitleStyle,props.customBtnTitleStyle,props.outline?outlineBtnTitleStyle:{}]}>{props.Title}</Text>
        </TouchableOpacity>
    )
}

CustomBtn.propTypes = {
    customBtnStyle:PropTypes.object,
    customBtnTitleStyle:PropTypes.object,
    Title:PropTypes.string,
    outline:PropTypes.bool
  };

export default CustomBtn