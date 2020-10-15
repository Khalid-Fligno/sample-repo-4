import React, { Component } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import SliderComponent from '../../../components/Challenges/slider';
import CustomBtn from '../../../components/Shared/CustomBtn';
import fonts from '../../../styles/fonts';

export default class OnBoarding1 extends Component {
  constructor(props) {
    super(props);
    console.log('constructr call')
    this.state = {
        challengeData:[],
        weightLoss:1,
        increaseEnergy:1,
        toneUp:1,
        mentalHealth:1,
        increaseFitness:1,
        btnDisabled:true
    };
  }

  onFocusFunction = () => {
    const challengeData = this.props.navigation.getParam('data', {})['challengeData'];
    const toAchieve = challengeData['onBoardingInfo']?challengeData['onBoardingInfo']['toAchieve']:[];
    console.log(challengeData)
    this.setState({
        challengeData:challengeData,
        weightLoss:toAchieve?toAchieve.weightLoss:1,
        increaseEnergy:toAchieve?toAchieve.increaseEnergy:1,
        toneUp:toAchieve?toAchieve.toneUp:1,
        mentalHealth:toAchieve?toAchieve.mentalHealth:1,
        increaseFitness:toAchieve?toAchieve.increaseFitness:1,
        btnDisabled:false
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
 goToNextScreen(){
   let {
    challengeData, 
    weightLoss,
    increaseEnergy,
    toneUp,
    mentalHealth,
    increaseFitness} = this.state;
   const onBoardingInfo = Object.assign({},challengeData.onBoardingInfo,{
                             toAchieve:{  weightLoss,
                                          increaseEnergy,
                                          toneUp,
                                          mentalHealth,
                                          increaseFitness
                                       }
                            })

   console.log(challengeData)
   let updatedChallengedata = Object.assign({},challengeData,{
     onBoardingInfo
   })
  this.props.navigation.navigate('ChallengeOnBoarding2',{
    data:{
      challengeData:updatedChallengedata
    }
  })
 }

  render() {
    let {
      challengeData ,
      weightLoss,
      increaseEnergy,
      increaseFitness,
      toneUp,
      mentalHealth,
      btnDisabled
    } = this.state
    // console.log(challengeData)
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
                <View>
                  <Text style={ChallengeStyle.onBoardingTitle}>What do you want to achieve?</Text>
                  <Text style={[ChallengeStyle.onBoardingTitle,
                    {fontSize:15,
                    fontFamily:fonts.GothamMedium,
                    marginTop:20,
                    marginBottom:20,
                    textTransform:'lowercase'
                    }]}>
                      {challengeData.displayName}
                  </Text>
                </View>
              
                <SliderComponent
                  title="Weight Loss" 
                  value={weightLoss}
                  minimumValue={1}
                  maximumValue={10}
                  onValueChange={(value) => this.setState({ weightLoss:Math.round(value) })}
                />
                <SliderComponent
                  title="Increase Energy" 
                  value={increaseEnergy}
                  minimumValue={1}
                  maximumValue={10}
                  onValueChange={(value) => this.setState({ increaseEnergy:Math.round(value) })}
                />
                <SliderComponent
                  title="Tone Up" 
                  value={toneUp}
                  minimumValue={1}
                  maximumValue={10}
                  onValueChange={(value) => this.setState({ toneUp:Math.round(value) })}
                />
                <SliderComponent
                  title="Mental Health" 
                  value={mentalHealth}
                  minimumValue={1}
                  maximumValue={10}
                  onValueChange={(value) => this.setState({ mentalHealth:Math.round(value) })}
                />
                <SliderComponent
                  title="Increase Fitness" 
                  value={increaseFitness}
                  minimumValue={1}
                  maximumValue={10}
                  onValueChange={(value) => this.setState({ increaseFitness:Math.round(value) })}
                />

                <View style={{flex:1,justifyContent:'flex-end',marginTop:20}}>
                      <CustomBtn 
                        Title="Continue"
                        customBtnStyle={{borderRadius:50,padding:15,width:'100%'}}
                        onPress={()=>this.goToNextScreen()}
                        disabled={btnDisabled}
                      />
                </View>
            </ScrollView>
  
          </View>
        </SafeAreaView> 
      
    );
  }
}
