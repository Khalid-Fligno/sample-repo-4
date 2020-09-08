'use strict';
import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import colors from './colors';

const { width } = Dimensions.get('window');
const globalStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.containerBackground,
        paddingHorizontal:20,
    },

  //Big Heading Back Button
      bigHeadingTitleContainer:{
          height:70,
          width:'100%',
          marginVertical:10
      },
      bigHeadingTitleText:{
          fontSize:35,
          fontWeight:'bold'
      },
      bigHeadingWithBackButtonText : {
          fontSize:15,
          fontWeight:'bold',
          color:colors.coral.standard,
          marginLeft:10,
      },
  //**********END ************* */
//Custom Filter Button Style Section
    absoluteFilterButtonsContainer: {
      width: width - 40,
      shadowColor: colors.grey.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.7,
      shadowRadius: 2,
      marginTop:10,
      padding:0
    },
    filterButtonsContainer: {
        height: 40,
        backgroundColor:colors.containerBackground,
        borderWidth:0,
        borderRadius:0,
        marginLeft:0,
        marginRight:0
      },
      filterButton: {
        backgroundColor: colors.containerBackground,
        borderColor: colors.violet.standard,
        borderBottomWidth:2,
        borderColor: colors.grey.light,
        marginRight:-1,
        marginLeft:-1
      },
      filterButtonText: {
        fontFamily: fonts.standard,
        fontSize: 11,
        color: colors.grey.standard,
        marginTop: 2,
        fontWeight:'bold'
      },
      filterButtonSelected: {
        backgroundColor: colors.containerBackground,
        borderBottomWidth:2,
        borderColor: colors.coral.standard,
      },
      filterButtonTextSelected: {
        fontFamily: fonts.standard,
        fontSize: 11,
        color: colors.black,
        marginTop: 2,
      },
//*********** END***************/ 
        
}) 

export default globalStyle