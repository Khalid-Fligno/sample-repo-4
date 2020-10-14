import React, { Component } from 'react';
import { View, Text, SafeAreaView,ScrollView,TouchableOpacity, } from 'react-native';
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

    const onBoardingInfo = Object.assign({},challengeData.onBoardingInfo,{
      fitnessLevel
    })
    let updatedChallengedata = Object.assign({},challengeData,{
      onBoardingInfo,
      status:'Active'
    })
    if(type === 'next'){   
      data = createUserChallengeData(updatedChallengedata)
      this.saveOnBoardingInfo(data)
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding5',{
        data:{
               challengeData:updatedChallengedata,
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
  
  render() {
    let {
      fitnessLevel,
      loading,
      challengeData,
      btnDisabled
    } = this.state

    console.log(challengeData)
    return (
      <SafeAreaView style={ChallengeStyle.container}>
          <View style={globalStyle.container}>
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
            {/* <View>
              <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Fitness Level</Text>
            </View>
            <View style={{marginTop:8}}>
              <View style={{justifyContent:'center'}}> 
                <Text style={{marginVertical:10,fontFamily:fonts.standard,fontSize:15}}>What is your current level of fitness?</Text>
              </View>
            </View>*/}
            <BigHeadingWithBackButton
                    bigTitleText = "Intensity"
                    isBackButton = {false}
                    isBigTitle = {true}
                    customContainerStyle={{marginTop:0,marginBottom:0}}
                  />
                    <Text style={[ChallengeStyle.IntensityTitleText,{color:colors.grey.dark,width:'100%'}]}>
                        Select your intensity level below.  
                    </Text>
                    <Text style={[ChallengeStyle.IntensityTitleText,{color:colors.grey.dark,width:'100%'}]}>
                        Beginner: train once a week,  
                    </Text>
                    <Text style={[ChallengeStyle.IntensityTitleText,{color:colors.grey.dark,width:'100%'}]}>
                         Intermediate: train 2 to 3 times a week, 
                     </Text>
                     <Text style={[ChallengeStyle.IntensityTitleText,{color:colors.grey.dark,width:'100%'}]}>
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
                  <View style={[{flex:1,justifyContent:'flex-end',marginTop:20}]}>
                      <CustomBtn 
                        Title="Next"
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
                          customBtnTitleStyle={{color:colors.black}}
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
