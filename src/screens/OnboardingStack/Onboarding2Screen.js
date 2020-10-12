import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ImageBackground, Dimensions } from 'react-native';
import CustomButton from '../../components/Shared/CustomButton';
import globalStyle, { containerPadding } from '../../styles/globalStyles';
import ChallengeStyle from '../Challenges/chellengeStyle';
import colors from '../../styles/colors';
import CustomBtn from '../../components/Shared/CustomBtn';
import onboardingStyle from './OnBoardingStyle';
import Loader from '../../components/Shared/Loader';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-community/async-storage';
import { db } from '../../../config/firebase';
import RoundTick from '../../../assets/icons/RoundTick';
import FitnessLevelCard from '../../components/Onboarding/FitnessLevelCard';
import BigHeadingWithBackButton from '../../components/Shared/BigHeadingWithBackButton';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

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
              <View style={[globalStyle.container]}>
                  <BigHeadingWithBackButton
                    bigTitleText = "Intensity"
                    isBackButton = {false}
                    isBigTitle = {true}
                    customContainerStyle={{marginTop:15,marginBottom:0}}

                  />
                    <Text style={[onboardingStyle.IntensityTitleText,{color:colors.grey.dark,width:'100%'}]}>
                        Select your intensity level below.  
                    </Text>
                    <Text style={[onboardingStyle.IntensityTitleText,{color:colors.grey.dark,width:'100%'}]}>
                        Beginner: train once a week,  
                    </Text>
                    <Text style={[onboardingStyle.IntensityTitleText,{color:colors.grey.dark,width:'100%'}]}>
                         Intermediate: train 2 to 3 times a week, 
                     </Text>
                     <Text style={[onboardingStyle.IntensityTitleText,{color:colors.grey.dark,width:'100%'}]}>
                         Expert: train 4+ times a week
                     </Text>
                 
                  <FitnessLevelCard
                    source ={require('../../../assets/images/OnBoardindImg/FL_1.png')}
                    onPress ={()=>this.setState({fitnessLevel:1})}  
                    title = "Beginner"
                    showTick = {fitnessLevel === 1}
                 />
                  <FitnessLevelCard
                    source ={require('../../../assets/images/OnBoardindImg/FL_2.png')}
                    onPress ={()=>this.setState({fitnessLevel:2})}  
                    title = "Intermediate"
                    showTick = {fitnessLevel === 2}
                 />
                 <FitnessLevelCard
                    source ={require('../../../assets/images/OnBoardindImg/FL_3.png')}
                    onPress ={()=>this.setState({fitnessLevel:3})}  
                    title = "Expert"
                    showTick = {fitnessLevel === 3}
                 />


                <View style={{flex:0.5,justifyContent:'flex-end'}}>
                  <CustomBtn 
                      Title="Save"
                      customBtnStyle={{borderRadius:50,padding:15}}
                      onPress={()=>this.handleSubmit()}
                      customBtnTitleStyle={{letterSpacing:fonts.letterSpacing}}
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
