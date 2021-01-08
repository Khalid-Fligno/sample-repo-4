import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native';
import { Modal } from 'react-native';
import { View, Text } from 'react-native';
import colors from '../../styles/colors';
import { heightPercentageToDP as hp ,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from '../Shared/Icon';
import { StyleSheet } from 'react-native';
import fonts from '../../styles/fonts';
import DoubleRightArrow from '../../../assets/icons/DoubleRightArrow';

class ChallengeSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
                    <SafeAreaView style={{
                        backgroundColor:'white',
                        height:hp('100%'),
                        width:wp('70%'),
                    }}>
                        <View
                        style={{
                            marginHorizontal:wp('4%'),
                        }}
                        >
                            <TouchableOpacity 
                                style={{alignSelf:"flex-end"}}
                                onPress={this.props.onToggle}
                            >
                                <Icon name="cross" size={hp('2.5%')} color={colors.themeColor.color} />
                            </TouchableOpacity>
                            <View style={{
                                marginTop:wp('5%'), 
                                borderTopWidth:1,
                                borderTopColor:colors.grey.light
                            }}>
                                <TouchableOpacity
                                    style={styles.btnContainer}
                                >
                                    <Text style={styles.title}>Quit challenge</Text>
                                    <DoubleRightArrow height={wp('3.5%')}/>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.btnContainer}
                                >
                                    <Text style={styles.title}>Restart challenge</Text>
                                    <DoubleRightArrow height={wp('3.5%')}/>
                                    
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.btnContainer}>
                                    <Text style={styles.title}>Choose another challenge</Text>
                                    <DoubleRightArrow height={wp('3.5%')}/>

                                </TouchableOpacity>
                            </View>

                        </View>
                    
                    </SafeAreaView>
    );
  }
}

export default ChallengeSetting;

const styles = StyleSheet.create({
    btnContainer:{
        paddingVertical:wp('3%'),
        // paddingBottom:wp('1.5%'),
        // marginBottom:wp('1%'),
        borderBottomWidth:1,
        borderBottomColor:colors.grey.light,
        flexDirection:'row',
        justifyContent:'space-between',
    },
    title:{
        fontFamily:fonts.GothamMedium,
        fontSize:wp('2.8%'),
        color:colors.black,
        textTransform:'uppercase',
        marginLeft:wp('2%')
    }
});
