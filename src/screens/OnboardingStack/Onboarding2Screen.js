import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import CustomButton from '../../components/Shared/CustomButton';
import globalStyle from '../../styles/globalStyles';
import ChallengeStyle from '../Challenges/chellengeStyle';
import colors from '../../styles/colors';
import CustomBtn from '../../components/Shared/CustomBtn';
import onboardingStyle from './OnBoardingStyle';
import Loader from '../../components/Shared/Loader';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-community/async-storage';
import { db } from '../../../config/firebase';
class Onboarding2Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fitnessLevel:2,
      loading:false
    };
  }
  handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    try {
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const data = {
        fitnessLevel:this.state.fitnessLevel,
        onboarded: true,
      };
      await userRef.set(data, { merge: true });
      this.setState({ loading: false });
      this.props.navigation.navigate('App', { isInitial: true });
    } catch (err) {
      Alert.alert('Database write error', `${err}`);
      this.setState({ loading: false });
    }
  }
  render() {
    let {fitnessLevel,loading} = this.state
    return (
            <SafeAreaView style={onboardingStyle.container}>
              <View style={[globalStyle.container,{paddingVertical:15}]}>
                <View>
                  <Text style={[onboardingStyle.onBoardingTitle,{textAlign:'center'}]}>Fitness Level</Text>
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

                <View style={{flex:1,justifyContent:'flex-end'}}>
                  <CustomBtn 
                      Title="Save"
                      outline={true}
                      customBtnStyle={{borderRadius:50,padding:15}}
                      onPress={()=>this.handleSubmit()}
                  />    
                </View>
                <Loader
                    loading={loading}
                    color={colors.coral.standard}
                  />
              </View>
          </SafeAreaView> 
    );
  }
}

export default Onboarding2Screen;
