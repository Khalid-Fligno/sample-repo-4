import React, { Component } from 'react';
import { View, Text, ImageBackground ,TouchableOpacity, StyleSheet} from 'react-native';
import globalStyle from '../../styles/globalStyles';
import RoundTick from '../../../assets/icons/RoundTick';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import CustomBtn from '../Shared/CustomBtn';
import PropTypes from 'prop-types';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
class ChallengeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const  {numberOfDays ,outline,btnTitle,onPress,imageUrl,disabled,numberOfWeeks,restartButton,onPressRestart} = this.props
   console.log("????",numberOfWeeks)
      return (
        <ImageBackground
            source ={{uri:imageUrl}}
            style={[globalStyle.FT_ImageContainer,{height:130,display:'flex'}]}
            imageStyle={{ borderRadius: 5,backgroundColor:colors.grey.medium,}}
        > 
              <View
                style={styles.ViewContainer}
              >
                  <View style={styles.titleContainer}>
                    <Text style={styles.numberTextLabel}>{numberOfWeeks}</Text>
                      <View style={{marginLeft:5}}> 
                          <Text style={styles.textLabel}>Week</Text>
                          <Text style={styles.textLabel}>challenge</Text>
                      </View>
                  </View>
                 <CustomBtn 
                    outline={outline}
                    Title={btnTitle}
                    customBtnStyle={{ 
                                      padding:8,
                                      backgroundColor:!outline?colors.themeColor.color:'transparent',
                                      borderRadius:50,
                                      width:'85%',
                                      marginTop:hp('1.8%'),
                                    }}
                    customBtnTitleStyle={{color:colors.offWhite,fontSize:14}}
                    onPress={onPress}
                    disabled = {disabled}
                 />
              </View> 
              { restartButton && 
              <View style={{width:'40%',flexBasis:'50%',marginLeft:'60%', }}>
              <CustomBtn 
                    outline={outline}
                    Title='Restart'
                    customBtnStyle={{ 
                                      padding:8,
                                      marginTop:10,
                                      backgroundColor:!outline?colors.themeColor.color:'transparent',
                                      borderRadius:50,
                                      width:'85%',
                                      marginTop:hp('1.8%'),
                                    }}
                    customBtnTitleStyle={{color:colors.offWhite,fontSize:14}}
                    onPress={onPressRestart}
                    disabled = {disabled}
                 />
              </View> 
            }
                
                
        </ImageBackground> 
    );
  }
}


ChallengeCard.propTypes = {
    numberOfDays:PropTypes.number,
    outline:PropTypes.bool,
    btnTitle:PropTypes.any,
    onPress:PropTypes.func,
    imageUrl:PropTypes.any,
    disabled:PropTypes.bool
  };


export default ChallengeCard;


const styles = StyleSheet.create({
    ViewContainer:{
        width:'50%',
        height:'100%',
        padding:10,
        paddingLeft:20,
        flexBasis:'50%',
        },
    titleContainer:{
        flexDirection:'row',
        alignItems:'flex-end'
    },
    numberTextLabel:{
        fontSize:50,
        fontFamily:fonts.GothamLight,
        marginBottom:-6,
        color:colors.offWhite
    } ,
    textLabel: {
        fontSize:15,
        fontFamily:fonts.GothamMedium,
        color:colors.offWhite,
    }  
});