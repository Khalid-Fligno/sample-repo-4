import React, { Component } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import SliderComponent from '../../../components/Challenges/slider';
import CustomBtn from '../../../components/Shared/CustomBtn';

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
    const data = this.props.navigation.getParam('data', {});
    const toAchieve = data['challengeData']['onBoardingInfo']['toAchieve'];
    console.log(data['challengeData'])
    this.setState({
        challengeData:data['challengeData'],
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
          <View style={[globalStyle.container,{paddingVertical:15}]}>
            <ScrollView>
                <View>
                  <Text style={ChallengeStyle.onBoardingTitle}>What do you want to achieve?</Text>
                  <Text style={ChallengeStyle.onBoardingTitle}>{challengeData.name}</Text>
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

              
            </ScrollView>
            <View style={{flex:1,justifyContent:'flex-end'}}>
                  <CustomBtn 
                    Title="Next"
                    outline={true}
                    customBtnStyle={{borderRadius:50,padding:15}}
                    onPress={()=>this.goToNextScreen()}
                    disabled={btnDisabled}
                  />
                </View>
          </View>
        </SafeAreaView> 
      
    );
  }
}
