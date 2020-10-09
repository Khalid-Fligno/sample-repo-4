import React, { Component } from 'react';
import { View, Text, SafeAreaView,InputBox, Dimensions, Platform,Picker } from 'react-native';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import { TextInput } from 'react-native-gesture-handler';
import fonts from '../../../styles/fonts';
import { Video } from 'expo-av';
import WorkoutTimer from '../../../components/Workouts/WorkoutTimer';
import colors from '../../../styles/colors';
import { timerSound } from '../../../../config/audio';
import InputBox2 from '../../../components/Challenges/InputBox2';
import Modal from 'react-native-modal';
import { burpeeOptions, findFitnessLevel } from '../../../utils';
import PickerModal from '../../../components/Challenges/PickerModal';
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
      btnDisabled:true
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
    let {challengeData,burpeeCount} = this.state

    const onBoardingInfo = Object.assign({},challengeData.onBoardingInfo,{
      burpeeCount
    })
    let updatedChallengedata = Object.assign({},challengeData,{
      onBoardingInfo
    })
    if(type === 'next'){
      this.props.navigation.navigate('ChallengeOnBoarding6',{
        data:{
               challengeData:updatedChallengedata
             }
      })
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding4',{
        data:{
               challengeData:updatedChallengedata
             }
      })
    }
     
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
    });
  }


  handleFinish(){
    this.setState((prevState) => ({ burpeeModalVisible: !prevState.burpeeModalVisible ,showInputBox:true}));
    console.log("<><><>Finished")
  }
  toggleBurpeeModal = () => {
    this.setState((prevState) => ({ burpeeModalVisible: !prevState.burpeeModalVisible }));
  }
  render() {
    let {timerStart,totalDuration,challengeData,burpeeCount,burpeeModalVisible,showInputBox,btnDisabled} = this.state
    if(!challengeData.onBoardingInfo){
      this.onFocusFunction()
    }
    return (
      <SafeAreaView style={ChallengeStyle.container}>
          <View style={[globalStyle.container,{paddingVertical:15}]}>
            <View>
              <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Burpee Test</Text>
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
              <View style={[ChallengeStyle.btnContainer,{paddingHorizontal:10,marginVertical:30}]}>
                  <CustomBtn 
                      Title="Reset"
                      customBtnStyle={{borderRadius:7,padding:15,width:"49%",backgroundColor:colors.charcoal.dark}}
                      onPress={()=>this.resetTimer()}
                  />    
                  <CustomBtn 
                    Title="Start"
                    customBtnStyle={{borderRadius:7,padding:15,width:"49%",backgroundColor:colors.charcoal.dark}}
                    onPress={()=>this.startTimer()}
                  />
            </View>
            </View>
            {   showInputBox &&

            <InputBox2
             onPress={this.toggleBurpeeModal}
                  title="Total Burpee"
                  extension={''}
                  value={burpeeCount}
                  customContainerStyle={{marginTop:20}}
              />
            }
            {/* model to select a count */}
            <PickerModal 
                dataMapList = {burpeeOptions}
                onValueChange={(value) => this.setState({ burpeeCount: value })}
                isVisible = {burpeeModalVisible}
                onBackdropPress = {() => this.hideModal()}
                selectedValue={burpeeCount}
                onPress={this.toggleBurpeeModal}
                inputType = 'number'
              />
          
            <View style={[ChallengeStyle.btnContainer,{flex:1}]}>
                  <CustomBtn 
                      Title="Previous"
                      outline={true}
                      customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                      onPress={()=>this.goToScreen('previous')}
                      disabled={btnDisabled}
                  />    
                  <CustomBtn 
                    Title="Skip"
                    outline={true}
                    customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                    onPress={()=>this.goToScreen('next')}
                    disabled={btnDisabled}
                  />
            </View>
          </View>
      </SafeAreaView> 
    );
  }
}
