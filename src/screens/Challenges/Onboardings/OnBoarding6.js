import React, { Component } from 'react';
import { View, Text, SafeAreaView,ScrollView,TouchableOpacity, } from 'react-native';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import fonts from '../../../styles/fonts';

const levelOfFiness=["Begineer","Intermediate","Advanced"];
export default class OnBoarding6 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitnessLevel:2,
      loading:false
    };
  }
  
  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    this.setState({challengeData:data['challengeData']});
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
    if(type === 'next'){   
      // next challenges button
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding5',{
        data:{
               challengeData:this.state.challengeData
             }
      })
    }     
  }
  
  render() {
    let {fitnessLevel,loading} = this.state
    return (
      <SafeAreaView style={ChallengeStyle.container}>
          <View style={[globalStyle.container,{paddingVertical:15}]}>
          <ScrollView>
            <View>
              <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Fitness Level</Text>
            </View>
            <View style={{marginTop:8}}>
              <View style={{justifyContent:'center'}}> 
                <Text style={{marginVertical:10,fontFamily:fonts.standard,fontSize:15}}>What is your current level of fitness?</Text>
              </View>
            </View>               
                  <TouchableOpacity 
                        activeOpacity={0.8}
                        style={[globalStyle.selectBox,fitnessLevel === 1 ?globalStyle.selectedBox:{},{width:'100%'}]}
                        onPress={()=>this.setState({fitnessLevel:1})}      
                  >
                    <Text style={globalStyle.selectBoxText}> Beginner </Text>
                  </TouchableOpacity>   
                  <TouchableOpacity 
                        activeOpacity={0.8}
                        style={[globalStyle.selectBox,fitnessLevel === 2 ?globalStyle.selectedBox:{},{width:'100%'}]}
                        onPress={()=>this.setState({fitnessLevel:2})}      
     
                  >
                    <Text style={globalStyle.selectBoxText}> Intermediate </Text>
                  </TouchableOpacity>   
                  <TouchableOpacity 
                        activeOpacity={0.8}
                        style={[globalStyle.selectBox,fitnessLevel === 3 ?globalStyle.selectedBox:{},{width:'100%'}]}
                        onPress={()=>this.setState({fitnessLevel:3})}      
     
                  >
                    <Text style={globalStyle.selectBoxText}> Advanced </Text>
                  </TouchableOpacity>   
            </ScrollView>
            <View style={ChallengeStyle.btnContainer}>
                  <CustomBtn 
                      Title="Previous"
                      outline={true}
                      customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                      onPress={()=>this.goToScreen('previous')}
                  />    
                  <CustomBtn 
                    Title="Next"
                    outline={true}
                    customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                    onPress={()=>this.goToScreen('next')}
                  />
                </View>
          </View>
      </SafeAreaView> 
    );
  }
}
