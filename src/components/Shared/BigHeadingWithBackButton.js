import React from 'react'
import globalStyle from '../../styles/globalStyles'
import { View, Text } from 'react-native'
import Icon from '../../components/Shared/Icon';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../../styles/colors';



export default function BigHeadingWithBackButton(props){
    return(
        <View style={globalStyle.bigHeadingTitleContainer}>
            {props.isBackButton && (
                <TouchableOpacity
                    style={{flexDirection:"row",alignItems:'center',marginTop:10}}
                    onPress={props.onPress}
                >
                    <Icon
                        name="chevron-left"
                        size={15}
                        color={colors.coral.standard}
                    />
                    <Text style={globalStyle.bigHeadingWithBackButtonText}>
                        {props.backButtonText}
                    </Text>
                </TouchableOpacity>
            )}
            
            {props.isBigTitle && (
                 <Text style={globalStyle.bigHeadingTitleText}>
                 {(props.bigTitleText.charAt(0).toUpperCase() + props.bigTitleText.slice(1))}
                 </Text>
            )}
           
        </View>
    )
}

