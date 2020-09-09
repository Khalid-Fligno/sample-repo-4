'use strict';
import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import colors from './colors';

const { width } = Dimensions.get('window');
export const containerPadding = 20
const globalStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.containerBackground,
        paddingHorizontal:containerPadding,
    },
    safeContainer: {
      flex: 1,
      backgroundColor: colors.containerBackground,
    },
    scrollView: {
      paddingTop: 15,
      alignItems: 'center',
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

//*************Component**************** */
modalContainer: {
  backgroundColor: colors.white,
  borderRadius: 4,
  overflow: 'hidden',
},
modalButton: {
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: colors.coral.standard,
  height: 50,
  width: '100%',
  marginBottom: 0,
},
modalButtonText: {
  fontFamily: fonts.bold,
  fontSize: 14,
  color: colors.white,
  marginTop: 3,
},
opacityLayer: {
  flex: 1,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.transparentBlackLight,
},
carouselsContainer: {
  flex: 1,
  paddingTop: 4,
  paddingBottom: 5,
},
flexContainer: {
  flex: 1,
  alignItems: 'center',
},
flex: {
  flex: 1,
},
carouselTitleContainer: {
  width: width * 0.8,
  flexDirection: 'row',
  justifyContent: 'space-between',
},
carouselTitle: {
  fontFamily: fonts.bold,
  fontSize: 12,
  color: colors.grey.dark,
  marginTop: 3,
},
chevron: {
  alignSelf: 'center',
},
buttonContainer: {
  paddingBottom: 10,
},

//*************END********************* */
        
}) 

export default globalStyle