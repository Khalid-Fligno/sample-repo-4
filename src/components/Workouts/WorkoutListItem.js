import React from 'react'
import Icon from '../Shared/Icon';
import { ImageBackground, Text,View, StyleSheet } from 'react-native';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

const WorkoutListItem =({item ,onPress})=>(
  <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.4}
  >
    <View style={styles.ItemContainer}>
      <View style={styles.imageContainer}>
        <ImageBackground
            style={styles.image}
            source={item.url}
            imageStyle={{borderRadius:3}}
        >
          <View style={styles.opacityLayer}>
          </View>
          </ImageBackground>
      </View>
     
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.timeContainer}> 
          <Icon
            name="timer"
            size={22}
            color={colors.charcoal.standard}
          />
          <Text style={styles.time}>   
            {item.time}m
          </Text> 
        </View>  
      </View>
     </View>
  </TouchableOpacity>
   )

const styles= StyleSheet.create({
    ItemContainer:{
      flexDirection:'row', 
      marginVertical: 15
    },

    imageContainer:{borderRadius:50},

    image:{height:90,width:90},

    opacityLayer:{
      flex: 1,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.transparentBlackLightest,
      borderRadius:3
    },

    textContainer:{
      marginLeft:15,
      flexDirection:'column',
      justifyContent:'space-between',
      marginBottom:2
    },

    title:{
      color:colors.charcoal.standard,
      fontFamily:fonts.bold,
      fontSize:18
    },
    description:{
      color:colors.grey.dark,
       fontFamily:fonts.bold,
       fontSize:10
    },

    timeContainer:{
      flexDirection:'row',
      alignItems:'center'
    },

    time:{
      color:colors.grey.dark, 
      fontFamily:fonts.bold,
      marginLeft:5
    }
})   

 export default WorkoutListItem  