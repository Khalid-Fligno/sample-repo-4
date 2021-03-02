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
import AsyncStorage from '@react-native-community/async-storage';
import { db } from '../../../config/firebase';
import Loader from '../Shared/Loader';
import { Alert } from 'react-native';
import createUserChallengeData from '../../components/Challenges/UserChallengeData'
class ChallengeSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading:false
    };
  }


  async resetChallenge(data,callBack){
    const {activeChallengeData} = this.props
    this.setState({loading:true})
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid).collection('challenges').doc(data.id);
    const newData = createUserChallengeData(activeChallengeData,new Date())
    // console.log(newData)
    userRef.set(newData).then((res)=>{
        this.setState({loading:false})
        this.props.onToggle()
        // console.log("res",res)
        setTimeout(()=>callBack(newData),100)
    }).catch((err)=>{
      console.log(err)
    })
  }

  async  quitChallenge(data){
    const callBack = ()=>{
                this.props.navigation.navigate('ChallengeSubscription');
            };
    this.resetChallenge(data,callBack);  
  }
  
  async  restartChallenge(data){
    const callBack = (newData)=>{
            this.props.navigation.navigate('ChallengeOnBoarding1',{
                    data:{
                        challengeData:newData
                    }
                })
            };
    this.resetChallenge(data,callBack); 
  }

  render() {
      const {activeChallengeUserData} = this.props
    //   console.log("activeChallengeUserData",this.props.activeChallengeUserData)
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
                                    onPress={()=>{
                                        Alert.alert('',
                                            'Are you sure you want to quit your challenge?',
                                            [
                                            {
                                                text: 'Cancel', style: 'cancel',
                                            },
                                            {
                                                text: 'Quit', onPress: () => this.quitChallenge(activeChallengeUserData),
                                            }],
                                            { cancelable: false },
                                        )
                                    }}
                                >
                                    <Text style={styles.title}>Quit challenge</Text>
                                    <DoubleRightArrow height={wp('3.5%')}/>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.btnContainer}
                                    onPress={()=>{
                                        Alert.alert('',
                                            'Are you sure you want to restart your challenge?',
                                            [
                                            {
                                                text: 'Cancel', style: 'cancel',
                                            },
                                            {
                                                text: 'Restart', onPress: () => this.restartChallenge(activeChallengeUserData),
                                            }],
                                            { cancelable: false },
                                        )
                                    }}
                                >
                                    <Text style={styles.title}>Restart challenge</Text>
                                    <DoubleRightArrow height={wp('3.5%')}/>
                                    
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    style={styles.btnContainer}
                                    onPress={()=>{
                                        Alert.alert('Are you sure?',
                                            'To choose another you need to quit current active challenge.',
                                            [
                                            {
                                                text: 'Cancel', style: 'cancel',
                                            },
                                            {
                                                text: 'Quit', onPress: () => this.quitChallenge(activeChallengeUserData),
                                            }],
                                            { cancelable: false },
                                        )
                                    }}    
                                >
                                    <Text style={styles.title}>Choose another challenge</Text>
                                    <DoubleRightArrow height={wp('3.5%')}/>

                                </TouchableOpacity>
                            </View>

                        </View>
                        <Loader
                            loading={this.state.loading}
                            color={colors.red.standard}
                        />
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
