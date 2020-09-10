import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'


export default function Tag(props){
    return(
        <View
          style={styles.tagCircle}
          key={props.tag}
        >
        <Text style={styles.tagText}>
          {props.tag}
        </Text>
      </View>
    )
}

const styles = StyleSheet.create({
    tagCircle: {
        height: 22,
        width: 22,
        marginRight: 5,
        borderWidth: 0,
        // borderColor: colors.violet.standard,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:colors.themeColor.color,
        alignSelf:'baseline'
      },
      tagText: {
        fontFamily: fonts.bold,
        fontSize: 9,
        color: colors.white,
        // marginTop: 4,
      },
})