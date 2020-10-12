import React, { Component } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import ChallengeStyle from '../chellengeStyle';
import globalStyle from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import { TouchableOpacity } from 'react-native';
import colors from '../../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';

export default class OnBoarding2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeData:{},
      dietryPreferences:[],
      btnDisabled:true
    };
  }

  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    let dietryPreferences=[
      {
        name:'Vegitarian',
        tag:'V',
        selected:false
      },
      {
        name:'Vegan',
        tag:'V+',
        selected:false
      },
      {
        name:'Gluten Free',
        tag:'GF',
        selected:false
      }
    ]
    if(data['challengeData']['onBoardingInfo']){
      console.log(data['challengeData'])
      const storedPreferences = data['challengeData']['onBoardingInfo']['dietryPreferences'];
      if(storedPreferences){
        dietryPreferences = dietryPreferences.map((res)=>{
          const index = storedPreferences.includes(res.tag)
          if(index){
            return Object.assign(res,{selected:true})
          }
          return res
        })
      }
      this.setState({
        challengeData:data['challengeData'],
        dietryPreferences,
        btnDisabled:false
      });
    }  
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
    let {
          dietryPreferences,
          challengeData,
        } = this.state

    const selectedPreferences = dietryPreferences.filter((item)=> item.selected);
    const tags = selectedPreferences.map((item)=> item.tag);
    const onBoardingInfo = Object.assign({},challengeData.onBoardingInfo,{
      dietryPreferences:tags
    });
    let updatedChallengedata = Object.assign({},challengeData,{onBoardingInfo});
    console.log(updatedChallengedata,"<><><screen2"); 
    if(type === 'next'){
      this.props.navigation.navigate('ChallengeOnBoarding3',{
        data:{
               challengeData:updatedChallengedata
             }
      })
    }else{
      this.props.navigation.navigate('ChallengeOnBoarding1',{
        data:{
               challengeData:updatedChallengedata
             }
      })
    }     
  } 
  push_pop_preferences(i){
    let data = this.state.dietryPreferences;
    data[i].selected = !data[i].selected
    this.setState({dietryPreferences:data})
  }

  render() {
    let {
          btnDisabled,
          dietryPreferences
        } = this.state
    // console.log(challengeData)
    return (
      <SafeAreaView style={ChallengeStyle.container}>        
          <View style={[globalStyle.container,{paddingVertical:15}]}>
            <ScrollView>
            <View>
              <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Dietry Preferences</Text>
            </View>            
            <View style={globalStyle.selectBoxContainer}>
                { 
                    dietryPreferences.map((item,i)=>{
                      return (
                                <TouchableOpacity 
                                      key={i}
                                      activeOpacity={0.8}
                                      style={[globalStyle.selectBox,item.selected?globalStyle.selectedBox:{}]}
                                      onPress={()=>this.push_pop_preferences(i)}      
                                >
                                  <Text style={globalStyle.selectBoxText}> {item.name} </Text>
                                </TouchableOpacity>
                              )
                  })
                }
            </View>
            </ScrollView>
            <View style={ChallengeStyle.btnContainer}>
              <CustomBtn 
                  Title="Previous"
                  outline={true}
                  customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                  onPress={()=>this.goToScreen('previous')}
                  disabled={btnDisabled}
              />    
              <CustomBtn 
                Title="Next"
                outline={true}
                customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                onPress={()=>this.goToScreen('next')}
                disabled={btnDisabled}
              />
            </View>
          </View>
      </SafeAreaView> 
    )  
  }
}
