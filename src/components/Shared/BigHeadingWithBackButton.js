import React from 'react'
import globalStyle from '../../styles/globalStyles'
import { View, Text } from 'react-native'
import Icon from '../../components/Shared/Icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../../styles/colors';
import PropTypes from 'prop-types';

 function BigHeadingWithBackButton(props){
    return(
        <View style={[globalStyle.bigHeadingTitleContainer,props.customContainerStyle]}>
            {props.isBackButton && (
                <TouchableOpacity
                    style={{flexDirection:"row",alignItems:'center',marginBottom:8}}
                    onPress={props.onPress}
                >
                    <Icon
                        name="chevron-left"
                        size={10}
                        color={colors.themeColor.color}
                    />
                    <Text style={globalStyle.bigHeadingWithBackButtonText}>
                        {props.backButtonText}
                    </Text>
                </TouchableOpacity>
            )}
            
            {props.isBigTitle && (
                 <Text style={[globalStyle.bigHeadingTitleText,props.bigTitleStyle?props.bigTitleStyle:{}]}>
                 {(props.bigTitleText.charAt(0).toUpperCase() + props.bigTitleText.slice(1))}
                 </Text>
            )}
           
        </View>
    )
}

BigHeadingWithBackButton.propTypes = {
    bigTitleStyle:PropTypes.object,
    customBtnTitleStyle:PropTypes.object,
    bigTitleText:PropTypes.string,
    backButtonText:PropTypes.string,
    isBigTitle:PropTypes.bool.isRequired,
    isBackButton:PropTypes.bool.isRequired,
    customContainerStyle:PropTypes.object
  };
  export default BigHeadingWithBackButton