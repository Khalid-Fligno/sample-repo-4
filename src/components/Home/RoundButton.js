import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '../../components/Shared/Icon'
import colors from '../../styles/colors'
import fonts from '../../styles/fonts'



export default function RoundButton(props){
    let leftIconUrl =''
    if(props.title === 'NUTRITION'){
        leftIconUrl = require('../../../assets/icons/'+'fitazfk2-nutrition.png')
    }else if(props.title === 'WORKOUT'){
        leftIconUrl = require('../../../assets/icons/'+'fitazfk2-workout.png')
    }
    return(
        <View style={styles.Container} >
            <TouchableOpacity
            style={[styles.btnContainer,props.customBtnStyle]}
            onPress={props.onPress}
            >
            <View style={styles.roundButtonInnerContainer}>
                {/* <Image
                        source={leftIconUrl}
                        style={{width:25,height:25,alignSelf:'center'}}
                    /> */}
                <Text  style={styles.btnText}>
                    {props.title}
                   
                </Text>
                <Icon
                        name={props.rightIcon}
                        size={15}
                        color={colors.grey.standard}
                        style={{marginLeft:10}}
                    />
            </View>
            </TouchableOpacity>
        </View>
    )
   
} 

const styles = StyleSheet.create({
    Container: {
        width: '50%',
        height: 50,
      
    },
    btnContainer:{
        alignItems: "center",
        width:'100%',
        borderWidth:1,
        borderColor:colors.grey.medium,
        padding:10,
        backgroundColor:colors.offWhite,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 8,
    },
    roundButtonInnerContainer: {
        flexDirection:'row',
        marginTop:8,
        marginBottom:8,
        width:'100%',
        justifyContent:'center'
    },
    btnText:{
        fontFamily: fonts.bold,
        alignSelf:'center',
        fontSize:12,
        color:colors.transparentBlackDark,
        marginLeft:10
    }
})