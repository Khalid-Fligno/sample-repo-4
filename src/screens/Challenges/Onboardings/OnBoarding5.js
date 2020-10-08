import React, { Component } from 'react';
import { View, Text, SafeAreaView,InputBox } from 'react-native';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import { TextInput } from 'react-native-gesture-handler';

export default class OnBoarding5 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    this.setState({challengeData:data['challengeData']})
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
      this.props.navigation.navigate('ChallengeOnBoarding6',{
        data:{
               challengeData:this.state.challengeData
             }
      })
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding4',{
        data:{
               challengeData:this.state.challengeData
             }
      })
    }
     
  }
  render() {
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
            <View style={{marginTop:20,height:180,backgroundColor:'black'}}>
              <Text>
                {/* stop watch code */}
              </Text>
            </View>
            <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between', marginTop:15}}>
              <View >
                <View><Text>Total Burpee</Text></View>
                <View style={ChallengeStyle.inputButton}>
                  <TextInput Title="Total Burpee" keyboardType="number" />
                </View>
              </View>
            </View>

          
          

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
