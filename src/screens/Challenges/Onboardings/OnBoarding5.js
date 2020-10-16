import React, { Component } from 'react';
import { View, Text, SafeAreaView,InputBox, Dimensions, Platform,Picker } from 'react-native';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import fonts from '../../../styles/fonts';
import { Video } from 'expo-av';
import WorkoutTimer from '../../../components/Workouts/WorkoutTimer';
import colors from '../../../styles/colors';
import { timerSound } from '../../../../config/audio';
import InputBox2 from '../../../components/Challenges/InputBox2';
import Modal from 'react-native-modal';
import { burpeeOptions, findFitnessLevel } from '../../../utils';
import PickerModal from '../../../components/Challenges/PickerModal';
import { db } from '../../../../config/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import createUserChallengeData from '../../../components/Challenges/UserChallengeData';
import Loader from '../../../components/Shared/Loader';

const { width } = Dimensions.get('window');


export default class OnBoarding5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      burpeeCount:0,
      burpeeModalVisible:false,
      showInputBox:false,
      timerStart:false,
      totalDuration:60,
      challengeData:{},
      btnDisabled:true,
      counterButtonDisable:false,
      error:'',
      loading:false
    };
  }

  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    const burpeeCount = data['challengeData']['onBoardingInfo']['burpeeCount'];
    if(burpeeCount > 0){
      this.setState({
        challengeData:data['challengeData'],
        btnDisabled:false,
        showInputBox:true,
        counterButtonDisable:false,
        burpeeCount
      })
    }else{
      this.setState({
        challengeData:data['challengeData'],
        btnDisabled:false
      })
    }
  
    console.log(data['challengeData'],"<><><><><")
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
    let {challengeData,burpeeCount,timerStart,totalDuration} = this.state
    if(timerStart && totalDuration ==60)
    {
      this.setState({ error: 'your timer is in progress! please do burpee test ' });
      return;
    }
    //TODO: find fitness level if cmplt burpee test otherwise it will one
    let fitnessLevel=2;
      if(burpeeCount >0 && burpeeCount<=10 )
          fitnessLevel=1;
      else if(burpeeCount >10 && burpeeCount<=15 )
          fitnessLevel=2;
      else if(burpeeCount > 15)
        fitnessLevel=3;

      //TODO: add burpee count and fitness level in on Boarding info  
      const onBoardingInfo = Object.assign({},challengeData.onBoardingInfo,{
        burpeeCount,
        fitnessLevel,
      })
      let updatedChallengedata = Object.assign({},challengeData,{
        onBoardingInfo,
        status:'Active'
      })    

    if(type === 'next'){
      this.props.navigation.navigate('ChallengeOnBoarding6',{
        data:{
               challengeData:updatedChallengedata
             }
      })
    }else if(type === 'submit'){

      const data = createUserChallengeData(updatedChallengedata);
      console.log("updatedChallengedataWithFitLevel",data);
      this.saveOnBoardingInfo(data)
    }
    else{
      this.props.navigation.navigate('ChallengeOnBoarding4',{
        data:{
               challengeData:updatedChallengedata
             }
      })
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
    console.log( data)
  }

  resetTimer = () => {
    this.props.navigation.replace('ChallengeOnBoarding5',{
      data:{
             challengeData:this.state.challengeData
           }
    })

  }



 startTimer = async ()=>{
    if (Platform.OS === 'ios') {
      await timerSound.setPositionAsync(0);
      await timerSound.playAsync();
    }
    else {
      try {
        await timerSound.playFromPositionAsync(0);
      }
      catch (ex) {

      }
    }
    this.setState({
      // videoPaused: true,
      timerStart:true ,
      counterButtonDisable:true,
    });
  }


  handleFinish(){
    this.setState((prevState) => ({ 
      burpeeModalVisible: !prevState.burpeeModalVisible ,
      showInputBox:true,
      timerStart:false,
      error:''
    }));
  }
  toggleBurpeeModal = () => {
    this.setState((prevState) => ({ burpeeModalVisible: !prevState.burpeeModalVisible }));
  }
  render() {
    let {
      timerStart,
      totalDuration,
      challengeData,
      burpeeCount,
      burpeeModalVisible,
      showInputBox,
      btnDisabled,
      error,
      counterButtonDisable,
      loading
    } = this.state;
    
    if(!challengeData.onBoardingInfo){
      this.onFocusFunction()
    }
    let fitnessLevel='';
    if(burpeeCount >0 &&  burpeeCount <= 10 )
      fitnessLevel="Beginner";
    else if(burpeeCount >10 && burpeeCount <= 15)
      fitnessLevel="Intermediate";
    else if(burpeeCount >15)
      fitnessLevel="Expert";

    return (
      <SafeAreaView style={ChallengeStyle.container}>
          <View style={[globalStyle.container,{paddingVertical:15}]}>
            <View>
              <Text style={[ChallengeStyle.onBoardingTitle]}>Burpee Test</Text>
            </View>
            <View style={{marginTop:8}}>
              <View style={{justifyContent:'center'}}> 
                <Text style={{marginVertical:10,fontFamily:fonts.standard,fontSize:15}}>How many burpee can you do in 60 seconds?</Text>
              </View>
            </View>            
            <View style={{backgroundColor:colors.black}}>
              {/* <Video
                source={{ uri: `${FileSystem.cacheDirectory}exercise-burpees.mp4` }}
                resizeMode="contain"
                repeat
                muted
                paused={videoPaused}
                style={{ width, height: width }}
              /> */}
              <WorkoutTimer
                totalDuration={totalDuration}
                start={timerStart}
                handleFinish={() => this.handleFinish()}
                customContainerStyle={{
                  width:width-containerPadding*2
                }}
              />
              <View style={[ChallengeStyle.btnContainer,{paddingHorizontal:10,marginVertical:30,flexDirection:'row'}]}>
                  <CustomBtn 
                      Title="Reset"
                      customBtnStyle={{borderRadius:7,padding:15,width:"49%",backgroundColor:colors.charcoal.dark}}
                      onPress={()=>this.resetTimer()}
                  />    
                  <CustomBtn 
                    Title="Start"
                    customBtnStyle={{borderRadius:7,padding:15,width:"49%",backgroundColor:colors.charcoal.dark}}
                    onPress={()=>this.startTimer()}
                    disabled={counterButtonDisable}
                  />
            </View>
            </View>
            {   showInputBox &&

            <InputBox2
             onPress={this.toggleBurpeeModal}
                  title="Total Burpee"
                  extension={''}
                  value={burpeeCount>0? `${burpeeCount} (${fitnessLevel})`:''}
                  customContainerStyle={{marginTop:20}}
              />
            }
                        
            <PickerModal 
                dataMapList = {burpeeOptions}
                onValueChange={(value) => {this.setState({ burpeeCount: value})}}
                isVisible = {burpeeModalVisible}
                onBackdropPress = {() => this.hideModal()}
                selectedValue={burpeeCount}
                onPress={this.toggleBurpeeModal}
                inputType = 'number'
              />
          
              <View style={[{flex:1,justifyContent:'flex-end'}]}>
                {
                  <Text style={ChallengeStyle.errorText}>{error}</Text>
                }
                { burpeeCount <= 0 ? <CustomBtn 
                  Title="Skip"
                  customBtnStyle={{borderRadius:50,padding:15,width:"100%"}}
                  onPress={()=>this.goToScreen('next')}
                  disabled={btnDisabled}
                  isRightIcon={true}
                  rightIconName="chevron-right"
                  rightIconColor={colors.white}
                  rightIconSize={13}
                  customBtnTitleStyle={{marginRight:10}}
                />:
                <CustomBtn 
                  Title="Continue"
                  customBtnStyle={{borderRadius:50,padding:15,width:"100%"}}
                  onPress={()=>this.goToScreen('submit')}
                  disabled={btnDisabled}
                  isRightIcon={true}
                  rightIconName="chevron-right"
                  rightIconColor={colors.white}
                  rightIconSize={13}
                  customBtnTitleStyle={{marginRight:10}}
                />
                
                }
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
              <Loader
                  loading={loading}
                  color={colors.themeColor.color}
                />
          </View>
      </SafeAreaView> 
    );
  }
}
