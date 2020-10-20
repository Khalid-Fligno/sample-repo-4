import React, { Component } from 'react';
import { View, Text } from 'react-native';
import calendarStyles from '../../screens/AppStack/Calendar/calendarStyle';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { Slider } from 'react-native-elements';
import CustomBtn from '../Shared/CustomBtn';
import { heightPercentageToDP as hp ,widthPercentageToDP as wp } from 'react-native-responsive-screen';

class ChallengeProgressCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
      const {
        phase,
        phaseData,
        activeChallengeData,
        activeChallengeUserData,
        totalChallengeWorkoutsCompleted
      } = this.props
    return(
        <View style={calendarStyles.ChallengeProgressCardContainer }>
          <Text style={calendarStyles.challengeLabel}
          >
           {activeChallengeUserData.displayName}{'  '} 
           <Text style={{fontFamily:fonts.standardNarrow}}>
               {totalChallengeWorkoutsCompleted.length}/{phaseData.workouts.length}
           </Text>
         </Text>

         <View style={calendarStyles.challengeProgressContainer}>
           <View style={calendarStyles.progressCircleContainer}>
              <View style={calendarStyles.sliderContainer}> 
                  <Text style={calendarStyles.sliderSideText}>0</Text>
                    <View style={calendarStyles.slider}>
                      <Slider
                        value={totalChallengeWorkoutsCompleted.length}
                        minimumValue={0}
                        maximumValue={phaseData.workouts.length}
                        trackStyle={{height:5,borderRadius:5}}
                        minimumTrackTintColor={colors.themeColor.color}
                        maximumTrackTintColor={colors.grey.medium}
                        thumbStyle={{
                          height:20, 
                          width:20,
                          borderRadius:50,
                          backgroundColor:"transparent",
                        }}
                        disabled={true}
                      />
                    </View>
                    <Text style={calendarStyles.sliderSideText}>{phaseData.workouts.length}</Text>
                </View>
                  
              
           </View>
           <View style={calendarStyles.phaseContainer}>
              <CustomBtn
                Title={phase.displayName}
                outline={true}
                customBtnStyle={{padding:wp('1.5%'),width:'75%',borderRadius:30,width:'35%'}}
                isRightIcon={true}
                rightIconName="chevron-right"
                rightIconColor={colors.themeColor.color}
                customBtnTitleStyle={{marginRight:wp('3%'),fontFamily:fonts.boldNarrow}}
              />
              <Text style={calendarStyles.phaseBodyText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. 
              </Text>
          </View>
         </View>
         <View style={{borderBottomColor:colors.grey.light,borderBottomWidth:2,width:'100%',marginTop:hp('2%')}}></View>
        
        </View> 
      )
  }
}

export default ChallengeProgressCard;
