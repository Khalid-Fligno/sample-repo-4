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
import CalendarModal from '../Shared/CalendarModal';
import { Platform } from 'react-native';
import moment from 'moment';
import { NavigationActions, StackActions } from 'react-navigation';
class ChallengeSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading:false,
        calendarModalVisible:false,
        chosenDate:this.props.ScheduleData?new Date(this.props.ScheduleData.startDate):new Date()
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

  showCalendarModal = () => {
    this.setState({ calendarModalVisible: true });
  }

  hideCalendarModal = () => {
    this.setState({ calendarModalVisible: false,loading:false });
  }

  setDate = async (event, selectedDate) => {
    // console.log("setDate call")
    if(selectedDate && Platform.OS === 'android'){
      this.hideCalendarModal();
      this.setState({loading:true});
      this.resetChallengeDate(selectedDate);
    }
    if(selectedDate && Platform.OS === 'ios'){
    const currentDate = selectedDate;
    this.setState({ chosenDate: currentDate });
    }
  }

  resetChallengeDate(date){
      this.setShedular(date);
  }

  async setShedular(selectedDate){
    const TODAY = moment();
    this.setState({loading:true});
    const uid = await AsyncStorage.getItem('uid');
    let {ScheduleData} = this.props
          const userRef = db.collection('users').doc(uid).collection('challenges');
          const data = createUserChallengeData(ScheduleData,selectedDate);
          if(moment(selectedDate).isSame(TODAY, 'd')){
            Object.assign(data,{status:'Active'});
          }else{
            Object.assign(data,{isSchedule:true,status:'InActive'});
          }
          userRef.doc(ScheduleData.id).set(data,{merge:true}).then((res)=>{
            
            Alert.alert('',
              `Your start date has been added to your challenge. Go to ${moment(selectedDate).format('DD-MM-YY')} on the challenge dashboard to see what Day 1 looks like`,
              [
                { text: 'OK', onPress:()=>{
                    // this.hideCalendarModal();
                    this.props.navigation.reset([NavigationActions.navigate({ routeName: 'CalendarHome' })], 0);

                }},
              ],
              { cancelable: false },
            );
          }).catch((err)=>{
            console.log(err)
          })
    
  }

  async discardChallengeFromSchedular(){
    const {ScheduleData} = this.props
    this.setState({loading:true})
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid).collection('challenges').doc(ScheduleData.id);
    const newData = createUserChallengeData(ScheduleData,new Date())
    // console.log(newData)
    userRef.set(newData).then((res)=>{
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ 
              routeName: 'Tabs',
              action:NavigationActions.navigate({
                routeName:'ChallengeSubscription'
              })
            })],
          });
          this.props.navigation.dispatch(resetAction);
        // this.setState({loading:false})
        // this.props.onToggle()
        // setTimeout(()=>this.props.navigation.navigate('ChallengeSubscription'),100)
    }).catch((err)=>{
      console.log(err)
    })
  }

  render() {
      const {activeChallengeUserData,isSchedule} = this.props
      const {
        calendarModalVisible,
        chosenDate,
        loading
      } = this.state;
    //   console.log("activeChallengeUserData",this.props.activeChallengeUserData)
    const activeChallengeSetting = (
        <View
        style={{
            marginHorizontal:wp('4%'),
        }}
        >

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
    )

    const scheduleChallengeSetting = (
        <View
        style={{
            marginHorizontal:wp('4%'),
        }}
        >

            <View style={{
                marginTop:wp('5%'), 
                borderTopWidth:1,
                borderTopColor:colors.grey.light
            }}>
                <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={()=>{
                        Alert.alert('Are you sure!',
                            'You want to reset your challenge start date?',
                            [
                            {
                                text: 'Cancel', style: 'cancel',
                            },
                            {
                                text: 'Reset', onPress: () => this.showCalendarModal(),
                            }],
                            { cancelable: false },
                        )
                    }}
                >
                    <Text style={styles.title}>Reset challenge start Date</Text>
                    <DoubleRightArrow height={wp('3.5%')}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={()=>{
                        Alert.alert('Are you sure !',
                            'you want to remove challenge from schedular?',
                            [
                            {
                                text: 'Cancel', style: 'cancel',
                            },
                            {
                                text: 'Remove', onPress: () => this.discardChallengeFromSchedular(),
                            }],
                            { cancelable: false },
                        )
                    }}
                >
                    <Text style={styles.title}>Remove challenge from schedule</Text>
                    <DoubleRightArrow height={wp('3.5%')}/>
                    
                </TouchableOpacity>

            </View>

        </View>
    )
    
    return (
                    <SafeAreaView style={{
                        backgroundColor:'white',
                        height:hp('100%'),
                        width:wp('70%'),
                    }}>
                        <TouchableOpacity 
                            style={{alignSelf:"flex-end", marginHorizontal:wp('4%'),}}
                            onPress={this.props.onToggle}
                        >
                            <Icon name="cross" size={hp('2.5%')} color={colors.themeColor.color} />
                        </TouchableOpacity>
                        {
                            !isSchedule &&
                            activeChallengeSetting
                        }
                        {
                            isSchedule && 
                            scheduleChallengeSetting
                        }
                        <Loader
                            loading={this.state.loading}
                            color={colors.red.standard}
                        />
                        
                            <CalendarModal
                                isVisible={calendarModalVisible}
                                onBackdropPress={this.hideCalendarModal}
                                value={chosenDate}
                                onChange={this.setDate}
                                onPress={()=>this.resetChallengeDate(chosenDate)}
                                addingToCalendar={loading}
                                loading={loading}
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
        marginLeft:wp('2%'),
        width:'80%'
    }
});
