import React from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '../../components/Shared/Icon'
import colors from '../../styles/colors'



export default function RoundButton(props){
    let leftIconUrl =''
    if(props.title === 'NUTRITION'){
        leftIconUrl = require('../../../assets/icons/'+'fitazfk2-nutrition.png')
    }else if(props.title === 'WORKOUT'){
        leftIconUrl = require('../../../assets/icons/'+'fitazfk2-workout.png')
    }
    return(
        <View style={styles.roundButton1} >
            <TouchableOpacity
            style={{  
                alignItems: "center",
                width:'100%',
                borderRadius:20,
                borderWidth:2,
                borderColor:colors.coral.standard
            }}
            >
            <View style={{flexDirection:'row',marginTop:8,marginBottom:8,width:'88%',justifyContent:'space-between'}}>
                <Image
                        source={leftIconUrl}
                        style={{width:25,height:25,alignSelf:'center'}}
                    />
                <Text  style={{fontFamily: fonts.bold,alignSelf:'center',fontSize:12}}>{props.title}</Text>
                <Icon
                name={props.rightIcon}
                size={15}
                color={colors.coral.standard}
                style={{alignSelf:'center'}}
                />
            </View>
            </TouchableOpacity>
        </View>
    )
   
} 

const styles = StyleSheet.create({
    roundButton1: {
        width: '49%',
        height: 40
      }
})