import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Text,Image } from 'react-native'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'
import PropTypes from 'prop-types';
import { propTypes } from 'react-native-carousel'
import Icon from './Icon'
import { DotIndicator } from 'react-native-indicators'

const CustomBtn = (props)=>{
   const customBtnStyle = {
        flexDirection:"row",
        backgroundColor:colors.themeColor.color,
        padding:17,
        justifyContent:'center',
        
    }
    const customBtnTitleStyle ={
        fontFamily:fonts.GothamMedium,
        fontSize:17,
        letterSpacing:0.7,
        // marginTop: 3,
        color:colors.white,
        letterSpacing:0.5,
        textAlign:'center'
    }
    const outlineBtnStyle ={
        backgroundColor:colors.themeColor.themeBackgroundColor,
        borderColor:colors.themeColor.color,
        borderWidth:2
    }
    const outlineBtnTitleStyle ={
        color:colors.themeColor.color,
        fontSize:17,
        fontWeight:'500',
    }

    const titleCapitaliseStyle={
        fontSize:14,
        fontFamily:fonts.bold
    }
    return(
        <TouchableOpacity
           disabled={props.disabled}
           style={[
               customBtnStyle,
               props.style,props.outline?outlineBtnStyle:{},
               props.customBtnStyle
            
            ]}
           activeOpacity={0.5}
           onPress={props.onPress}
        >
            {
                props.leftIcon && (
                    <Image
                        source={props.leftIconUrl}
                        style={{width: 20,
                            height: 20,
                            marginRight: 10,
                        }}
                    />
                )
            } 
            {
                props.isLeftIcon && (
                    <Icon
                    name={props.leftIconName}
                    size={props.leftIconSize}
                    color={props.leftIconColor}
                    style={{alignSelf:'center',marginRight:5}}
                />
                )
            }
            {
                props.loading ? (
                <DotIndicator
                    color={colors.white}
                    count={3}
                    size={6}
                />
                ) : (
                    <Text style={[
                        customBtnTitleStyle,
                        props.outline?outlineBtnTitleStyle:{},
                        props.titleCapitalise?titleCapitaliseStyle:{},
                        props.customBtnTitleStyle
                    ]}>
                        {props.Title}
                    </Text>
                )
            }
              {
                props.isRightIcon && (
                    <Icon
                    name={props.rightIconName}
                    size={props.rightIconSize}
                    color={props.rightIconColor}
                    style={{alignSelf:'center',marginLeft:5}}
                />
                )
            }
           
            {/* <Text style={[customBtnTitleStyle,props.outline?outlineBtnTitleStyle:{},props.customBtnTitleStyle]}>{props.Title}</Text> */}
        </TouchableOpacity>
    )
}

CustomBtn.propTypes = {
    customBtnStyle:PropTypes.object,
    customBtnTitleStyle:PropTypes.object,
    Title:PropTypes.string,
    outline:PropTypes.bool,
    leftIcon:PropTypes.bool,
    leftIconUrl:PropTypes.any,
    isLeftIcon:PropTypes.bool,
    leftIconName:PropTypes.any,
    leftIconColor:PropTypes.any,
    isRightIcon:PropTypes.bool,
    rightIconName:PropTypes.any,
    rightIconColor:PropTypes.any,
    loading:PropTypes.bool,
    titleCapitalise:PropTypes.bool,
    disabled:PropTypes.bool,
    leftIconSize:PropTypes.number
  };

  CustomBtn.defaultProps ={
    leftIconSize:10
  }

export default CustomBtn