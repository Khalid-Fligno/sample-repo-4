import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import CustomBtn from '../../../../components/Shared/CustomBtn';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';
import { downloadExerciseWC } from '../../../../utils/workouts';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Video } from 'expo-av';
import { FileSystem } from 'react-native-unimodules';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
export default class WarmUpCoolDownScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exerciseDownloaded:false,
      timerStart: false,
      exerciseIndex:1,
      type:'warmUp',
      totalDuration:30,
      totalExercise:0
    };
  }
  componentDidMount(){
    console.log("COmpoent call")
    this.loadExercise();
  }


  async loadExercise(){
    const{warmUp,workout} = this.props.navigation.state.params;
    const type =  warmUp?'warmUp':'coolDown'
    const exerciseIds =  warmUp?workout.warmUpExercises:workout.coolDownExercises;
    const exerciseModel =  warmUp?workout.warmUpExerciseModel:workout.coolDownExerciseModel;
    const data = await downloadExerciseWC(workout,exerciseIds,exerciseModel,type);
    console.log(exerciseIds,data)
    this.setState({
      exerciseDownloaded:data?true:false,
      timerStart:true,
      type:type,
      totalExercise:exerciseIds.length
    })
  }

  goToExercise(){
      const{
        workout,
        reps,
        resistanceCategoryId,
        currentExerciseIndex,
        workoutSubCategory,
        fitnessLevel,
        extraProps,
      } = this.props.navigation.state.params;
        this.props.navigation.replace('Exercise', {
            workout,
            reps,
            resistanceCategoryId,
            currentExerciseIndex,
            workoutSubCategory,
            fitnessLevel,
            extraProps
        });
  }
  handleFinish(){
    const {exerciseIndex,totalExercise} = this.state;
    this.setState({timerStart:false})
    if(totalExercise <= exerciseIndex){
      // this.goToExercise();
    }else{
      this.setState({
        exerciseIndex:this.state.exerciseIndex+1,
        totalDuration:30,
        timerStart:true
      })
    }

    console.log("habdle finish")
  }
  render() {
  const {exerciseDownloaded,timerStart,exerciseIndex,type,totalDuration} = this.state;
  const{warmUp,workout} = this.props.navigation.state.params;
  
  const workoutTimer = () =>{
      return (
          <WorkoutTimer
              totalDuration={Number(totalDuration)}
              start={timerStart}
              handleFinish={() =>{
                  this.handleFinish();
              } }
              customContainerStyle={{paddingBottom:20}}
            />
      )
  }
    return (
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FadeInView
        duration={1000}
        style={styles.flexContainer}
      >
        <View>

          {
            exerciseDownloaded &&
            <Video
              source={{ uri: `${FileSystem.cacheDirectory}exercise-${type}-${exerciseIndex}.mp4`}}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={true}
                isLooping
                style={{ width, height: width }}
            />
             
          }


          {/* //TODO:workout Timer */}
           {
            workoutTimer()
           } 
        </View>
      
      </FadeInView>
      <View>
        <Text> WarmUpCoolDownScreen </Text>
        <CustomBtn
            Title="Go To Exercise"
            onPress={()=>this.goToExercise()}
        />
      </View>
    </SafeAreaView>
 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },
  currentExerciseTextContainer: {
    width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: colors.white,
  },
  currentExerciseNameTextContainer: {
    // width: width - 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.themeColor.color,
  },
  currentExerciseRepsTextContainer: {
    // width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  currentExerciseRepsText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
  },
  containerEmptyBlackBox: {
    width,
    height:hp("10%"),
    backgroundColor: colors.black,
    paddingVertical: height > 800 ? 25 : 15,
    alignItems: 'center',
    justifyContent: 'center',

  },
});
