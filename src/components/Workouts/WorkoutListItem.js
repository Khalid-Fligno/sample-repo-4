import React from 'react'
import Icon from '../Shared/Icon';
import { ImageBackground, Text,View, StyleSheet,Image } from 'react-native';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import { propTypes } from 'react-native-carousel';
import TimeSvg from '../../../assets/icons/time';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const WorkoutListItem =({timeInterval,description,title,url ,onPress,count})=>(
  <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.4}
  >
    <View style={styles.ItemContainer}>
      <View style={styles.imageContainer}>
        <ImageBackground
            style={styles.image}
            source={{uri:url}}
            imageStyle={{borderRadius:3}}
        >
          <View style={styles.opacityLayer}>
          </View>
          </ImageBackground>
      </View>
     
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {
          !count &&
          <View style={styles.timeContainer}> 
           <TimeSvg width={hp('2.5%')} height={hp('2.5%')} />
             <Text style={styles.time}>   
               {timeInterval}m
             </Text> 
          </View>  
        }
        {
          count &&
          <View style={styles.timeContainer}> 
           
          </View>  
        }
       
      </View>
     </View>
  </TouchableOpacity>
   )


   WorkoutListItem.propTypes ={
    timeInterval:PropTypes.number,
    description:PropTypes.string,
    title:PropTypes.string,
    url:PropTypes.any ,
    onPress:PropTypes.func
   }

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
      marginVertical:2,
    },

    title:{
      color:colors.charcoal.standard,
      fontFamily:fonts.bold,
      fontSize:15
    },
    description:{
      color:colors.grey.dark,
       fontFamily:fonts.bold,
       fontSize:10,
       width:wp('50%'),
       lineHeight:wp('3%')
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