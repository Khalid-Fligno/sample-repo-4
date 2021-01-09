import React, { Component } from 'react';
import { View, Text ,StyleSheet } from 'react-native';
import calendarStyles from '../../screens/AppStack/Calendar/calendarStyle';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { Slider } from 'react-native-elements';
import CustomBtn from '../Shared/CustomBtn';
import { heightPercentageToDP as hp ,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { containerPadding } from '../../styles/globalStyles';
import ChallengeProgressBar from './ChallengeProgressBar';
import { ImageBackground } from 'react-native';
import PhaseCard from './PhaseCard';

const styles = StyleSheet.create({
    ChallengeProgressCardContainer:{
        flexDirection:'row',
        alignItems:'center',
        width:wp('100')-containerPadding*2,
        paddingVertical:wp('2%'),
      },
      challengeLabel:{
        fontSize:wp('4.7%'),
        fontFamily:fonts.bold,
        color:colors.charcoal.dark,
        marginBottom:wp('2%'),
      },
});

class ChallengeProgressCard2 extends Component {
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
        totalChallengeWorkoutsCompleted,
        openLink,
        currentDay
      } = this.props
      let total = 0
      activeChallengeData.workouts.forEach((res)=>{if(res.name.toLowerCase() != 'rest')total += res.days.length })
      console.log(activeChallengeData.numberOfDays)
      return(
        <View>
            <View style={styles.ChallengeProgressCardContainer }>
                <View>
                    <Text style={styles.challengeLabel}
                    >
                    {activeChallengeUserData.displayName}{'  '} 
                    </Text>
                    <Text style={{
                                    fontFamily:fonts.GothamMedium,
                                    color:colors.grey.dark,
                                    fontSize:wp('3%')
                                }}
                    >
                        {/* Day {totalChallengeWorkoutsCompleted.length} of {total} - keep it going! */}
                        Day {currentDay} of {activeChallengeData.numberOfDays} - keep it going!
                    </Text>
                </View>
            
                <View
                    style={{marginStart:wp('8%')}}
                >
                    <ChallengeProgressBar
                        // completed={totalChallengeWorkoutsCompleted.length}
                        completed={currentDay}
                        total = {activeChallengeData.numberOfDays}
                        size ={wp('26%')}
                    />
                </View>
            </View> 
            <PhaseCard 
                onPress={()=>console.log(">>>>")}
                image={require('../../../assets/images/Calendar/phaseCardBg.png')}
                phase={phase}
                phaseData={phaseData}
                openLink={openLink}
            />

        </View>
      )
  }
}

export default ChallengeProgressCard2;


         {/* <View style={calendarStyles.challengeProgressContainer}>
           <View style={calendarStyles.progressCircleContainer}>
              <View style={calendarStyles.sliderContainer}> 
                  <Text style={calendarStyles.sliderSideText}>0</Text>
                    <View style={calendarStyles.slider}>
                      <Slider
                        value={totalChallengeWorkoutsCompleted.length}
                        minimumValue={0}
                        maximumValue={total}
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
                    <Text style={calendarStyles.sliderSideText}>{total}</Text>
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
                onPress={openLink}
             />
          </View>
         </View> */}