import React, { Component } from 'react';
import { View, Text, SafeAreaView,ScrollView,TouchableOpacity, Alert, } from 'react-native';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import fonts from '../../../styles/fonts';
import createUserChallengeData from '../../../components/Challenges/UserChallengeData';
import colors from '../../../styles/colors';
import Loader from '../../../components/Shared/Loader';
import { db } from '../../../../config/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import FitnessLevelCard from '../../../components/Onboarding/FitnessLevelCard';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import storeProgressInfo from '../../../components/Challenges/storeProgressInfo';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DotIndicator } from 'react-native-indicators';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
const levelOfFiness=["Begineer","Intermediate","Advanced"];
export default class OnBoarding6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitnessLevel:2,
      loading:false,
      challengeData:null,
      btnDisabled:true,
      loading:false,
      calendarModalVisible: false,
      addingToCalendar: false,
      chosenDate: new Date(),
    };
  }
  
  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    const fitnessLevel = data['challengeData']['onBoardingInfo']['fitnessLevel']
    this.setState({
      challengeData:data['challengeData'],
      btnDisabled:false,
      fitnessLevel:fitnessLevel?fitnessLevel:2
    });
  }
  
  // add a focus listener onDidMount
  async componentDidMount () {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }
  
  // and don't forget to remove the listener
  componentWillUnmount () {
    this.focusListener.remove()
  }

  goToScreen(type){
    let {challengeData,fitnessLevel} = this.state
    let burpeeCount=0;
    if(fitnessLevel === 1)
        burpeeCount=10;
    else if(fitnessLevel === 2 )
        burpeeCount=15;
    else if(fitnessLevel === 3)
        burpeeCount=20;

        const onBoardingInfo = Object.assign({},challengeData.onBoardingInfo,{
          fitnessLevel,
          burpeeCount
        })
        let updatedChallengedata = Object.assign({},challengeData,{
          onBoardingInfo,
          status:'Active'
        })
        if(type === 'next'){
          this.setState({ challengeData: updatedChallengedata });
          // calendarModalVisible true calendar popup
          this.setState({ calendarModalVisible: true });
        }else{
          this.props.navigation.navigate('ChallengeOnBoarding5',{
            data:{
                   challengeData:updatedChallengedata,
                 }
          })
        } 
      }

      addChallengeToCalendar = async (date) => {
        if (this.state.addingToCalendar) {
          return;
        }
        this.setState({ addingToCalendar: true });
        ////////////////////saving on calendar
        const updatedChallengedata=this.state.challengeData;
        const data = createUserChallengeData(updatedChallengedata,new Date(date));
        const progressData = {
          photoURL: updatedChallengedata.onBoardingInfo.beforePhotoUrl,
          weight: updatedChallengedata.onBoardingInfo.measurements.weight,
          waist: updatedChallengedata.onBoardingInfo.measurements.waist,
          hip: updatedChallengedata.onBoardingInfo.measurements.hip,
          burpeeCount:updatedChallengedata.onBoardingInfo.burpeeCount,
          fitnessLevel:updatedChallengedata.onBoardingInfo.fitnessLevel
        }
        const stringDate = moment(date).format('YYYY-MM-DD').toString();

        if(new Date(updatedChallengedata.startDate).getTime() < new Date(stringDate).getTime()){
          data.isSchedule= true;
          data.status='InActive';
        }
        storeProgressInfo(progressData)
        this.saveOnBoardingInfo(data)
        ////////////end saving
        if(Platform.OS === 'android'){
          this.hideCalendarModal();
          Alert.alert(
            '',
            'Added to calendar!',
            [
              { text: 'OK', style: 'cancel' },
            ],
            { cancelable: false },
          );
        }else{
          this.setState({ addingToCalendar: false});
        Alert.alert(
          '',
          'Added to calendar!',
          [
            { text: 'OK', onPress: this.hideCalendarModal, style: 'cancel' },
          ],
          { cancelable: false },
        );
        }
      }     

async  saveOnBoardingInfo(data){
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid).collection('challenges').doc(data.id);
    userRef.set(data,{merge:true}).then((res)=>{
      this.setState({loading:false})
      this.props.navigation.navigate('Home');
    }).catch((err)=>{
      console.log(err)
    })
  }
  showCalendarModal = () => {
    this.setState({ calendarModalVisible: true });
  }
  hideCalendarModal = () => {
    this.setState({ calendarModalVisible: false,loading:false });
  }
  setDate = async (event, selectedDate) => {
    console.log("setDate call")
    if(selectedDate && Platform.OS === 'android'){
      this.setState({loading:true});
      this.addChallengeToCalendar(selectedDate);
    }
    if(selectedDate && Platform.OS === 'ios'){
    const currentDate = selectedDate;
    this.setState({ chosenDate: currentDate });
    }
  }
  render() {
    let {
      fitnessLevel,
      loading,
      challengeData,
      btnDisabled,
      calendarModalVisible,
      addingToCalendar,
      chosenDate
    } = this.state

    // console.log(challengeData)
    return (
      <SafeAreaView style={ChallengeStyle.container}>
          <View style={globalStyle.container}>
          {
          Platform.OS === 'ios' && 
           <Modal
              isVisible={calendarModalVisible}
              animationIn="fadeIn"
              animationInTiming={600}
              animationOut="fadeOut"
              animationOutTiming={600}
              onBackdropPress={this.hideCalendarModal}
            >
              <View style={globalStyle.modalContainer}>
                <DateTimePicker
                  mode="date"
                  value={chosenDate}
                  onChange={this.setDate}
                  minimumDate={new Date()}
                />
                <TouchableOpacity
                  onPress={() => this.addChallengeToCalendar(chosenDate)}
                  style={globalStyle.modalButton}
                >
                  {
                    addingToCalendar ? (
                      <DotIndicator
                        color={colors.white}
                        count={3}
                        size={6}
                      />
                    ) : (
                      <Text style={globalStyle.modalButtonText}>
                        ADD TO CALENDAR
                      </Text>
                    )
                  }
                </TouchableOpacity>
              </View>
            </Modal>
        }
         {
           
          Platform.OS === 'android' && calendarModalVisible && !loading &&
          <DateTimePicker
            mode="date"
            value={chosenDate}
            onChange={this.setDate}
            minimumDate={new Date()}
          />
         }
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1, 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              paddingVertical:15
            }}
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
           
            <BigHeadingWithBackButton
                    bigTitleText = "Intensity"
                    isBackButton = {false}
                    isBigTitle = {true}
                    customContainerStyle={{marginTop:0,marginBottom:0}}
                  />
                    <Text style={{fontFamily:fonts.standard,fontSize:15}}>
                        Select your intensity level below.  
                    </Text>
                    <Text style={{fontFamily:fonts.standard,fontSize:15}}>
                        Beginner: train once a week,  
                    </Text>
                    <Text style={{fontFamily:fonts.standard,fontSize:15}}>
                         Intermediate: train 2 to 3 times a week, 
                     </Text>
                     <Text style={{fontFamily:fonts.standard,fontSize:15}}>
                         Expert: train 4+ times a week
                     </Text>
                 
                  <FitnessLevelCard
                    source ={require('../../../../assets/images/OnBoardindImg/FL_1.png')}
                    onPress ={()=>this.setState({fitnessLevel:1})}  
                    title = "Beginner"
                    showTick = {fitnessLevel === 1}
                 />
                  <FitnessLevelCard
                    source ={require('../../../../assets/images/OnBoardindImg/FL_2.png')}
                    onPress ={()=>this.setState({fitnessLevel:2})}  
                    title = "Intermediate"
                    showTick = {fitnessLevel === 2}
                 />
                 <FitnessLevelCard
                    source ={require('../../../../assets/images/OnBoardindImg/FL_3.png')}
                    onPress ={()=>this.setState({fitnessLevel:3})}  
                    title = "Expert"
                    showTick = {fitnessLevel === 3}

                 />
                  <View style={[{flex:0.5,justifyContent:'flex-end',marginTop:20}]}>
                      <CustomBtn 
                        Title="Choose Start Date"
                        customBtnStyle={{borderRadius:50,padding:15,width:"100%"}}
                        onPress={()=>this.goToScreen('next')}
                        disabled={btnDisabled}
                        isRightIcon={true}
                        rightIconName="chevron-right"
                        rightIconColor={colors.white}
                        rightIconSize={13}
                        customBtnTitleStyle={{marginRight:10}}
                      />
                      <CustomBtn 
                          Title="Back"
                          customBtnStyle={{borderRadius:50,padding:15,width:"100%",marginTop:5,marginBottom:-10,backgroundColor:'transparent'}}
                          onPress={()=>this.goToScreen('previous')}
                          disabled={btnDisabled}
                          customBtnTitleStyle={{color:colors.black,marginRight:40}}
                          isLeftIcon={true}
                          leftIconName="chevron-left"
                          leftIconColor={colors.black}
                          leftIconSize={13}
                      />    
                  
                    </View>
                </ScrollView>
                <Loader
                  loading={loading}
                  color={colors.themeColor.color}
                />
          </View>
            

      </SafeAreaView> 
    );
  }
}
