import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';

export default class OnBoarding4 extends Component {
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
      this.props.navigation.navigate('ChallengeOnBoarding5',{
        data:{
               challengeData:this.state.challengeData
             }
      })
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding3',{
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
              <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Dietry Preferences</Text>
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
