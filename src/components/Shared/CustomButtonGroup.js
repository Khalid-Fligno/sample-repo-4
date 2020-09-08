import React from 'react'
import { ButtonGroup } from 'react-native-elements'
import globalStyle from '../../styles/globalStyles'
import colors from '../../styles/colors'
import { View } from 'react-native'

export default function CustomButtonGroup(props){
    return(
        <View style={globalStyle.absoluteFilterButtonsContainer}>
            <ButtonGroup
                onPress={props.onPress}
                selectedIndex={props.selectedIndex}
                buttons={props.buttons}
                containerStyle={globalStyle.filterButtonsContainer}
                buttonStyle={globalStyle.filterButton}
                textStyle={globalStyle.filterButtonText}
                selectedButtonStyle={globalStyle.filterButtonSelected}
                selectedTextStyle={globalStyle.filterButtonTextSelected}
                innerBorderStyle={{color:colors.offWhite}}
            />
        </View>    
    )
}