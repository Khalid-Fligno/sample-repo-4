import React, { Component } from 'react';
import { View, Text, ImageBackground ,TouchableOpacity, StyleSheet} from 'react-native';
import globalStyle from '../../styles/globalStyles';
import RoundTick from '../../../assets/icons/RoundTick';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import CustomBtn from '../Shared/CustomBtn';
import PropTypes from 'prop-types';
class ChallengeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const  {numberOfDays ,outline,btnTitle,onPress,imageUrl} = this.props
    return (
        <ImageBackground
            source ={{uri:imageUrl}}
            style={[globalStyle.FT_ImageContainer,{height:130}]}
            imageStyle={{ borderRadius: 5,backgroundColor:colors.grey.medium}}
        > 
              <View
                style={styles.ViewContainer}
              >
                  <View style={styles.titleContainer}>
                    <Text style={styles.numberTextLabel}>{numberOfDays}</Text>
                      <View style={{marginLeft:5}}> 
                          <Text style={styles.textLabel}>Day</Text>
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
                                      marginTop:15,
                                    }}
                    customBtnTitleStyle={{color:colors.offWhite,fontSize:14}}
                    onPress={onPress}
                 />
              </View>  
                
                
        </ImageBackground> 
    );
  }
}


ChallengeCard.propTypes = {
    numberOfDays:PropTypes.number,
    outline:PropTypes.bool,
    btnTitle:PropTypes.any,
    onPress:PropTypes.func,
    imageUrl:PropTypes.any
  };


export default ChallengeCard;


const styles = StyleSheet.create({
    ViewContainer:{
        width:'50%',
        height:'100%',
        padding:10,
        paddingLeft:20
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