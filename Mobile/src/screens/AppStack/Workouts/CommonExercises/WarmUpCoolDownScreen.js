import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import CustomBtn from '../../../../components/Shared/CustomBtn';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';
import { downloadExerciseWC, getLastExercise } from '../../../../utils/workouts';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { Video } from 'expo-av';
import { FileSystem } from 'react-native-unimodules';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import ExerciseInfoButton from '../../../../components/Workouts/ExerciseInfoButton';
import ExerciseInfoModal from '../../../../components/Workouts/ExerciseInfoModal';
import Loader from '../../../../components/Shared/Loader';
import WorkoutProgressBar from '../../../../components/Workouts/WorkoutProgressBar';
import PauseButtonRow from '../../../../components/Workouts/PauseButtonRow';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
export default class WarmUpCoolDownScreen extends Component {
  constructor(props) {
    super(props);
    const{exerciseIndex} = this.props.navigation.state.params;
    this.state = {
      exerciseList:[],
      timerStart: false,
      exerciseIndex:exerciseIndex?exerciseIndex:1,
      type:null,
      totalDuration:null,
      totalExercise:0,
      videoPaused:false,
      exerciseInfoModalVisible:false,
      pauseModalVisible:false,
      restart:false
    };
  }
  componentDidMount(){
    // console.log("COmpoent call")
    this.loadExercise();
  }


  async loadExercise(){
    const{warmUp,workout} = this.props.navigation.state.params;
    const {exerciseIndex} = this.state;
    const type =  warmUp?'warmUp':'coolDown'
    // const exerciseIds =  warmUp?workout.warmUpExercises:workout.coolDownExercises;
    // const exerciseModel =  warmUp?workout.warmUpExerciseModel:workout.coolDownExerciseModel;
    // const data = await downloadExerciseWC(workout,exerciseIds,exerciseModel,type);
    const exerciseList = type === 'warmUp'?workout.warmUpExercises:workout.coolDownExercises;
    // console.log(workout);
    this.setState({
      exerciseList:exerciseList,
      timerStart:false,
      type:type,
      totalExercise:exerciseList.length,
      totalDuration:exerciseList[exerciseIndex-1] && exerciseList[exerciseIndex-1].duration?exerciseList[exerciseIndex-1].duration:30
    })
    setTimeout(()=>this.setState({timerStart: true }),100);
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
        warmUp
      } = this.props.navigation.state.params;
      if(warmUp){
        this.props.navigation.replace('Exercise', {
            workout,
            reps,
            resistanceCategoryId,
            currentExerciseIndex,
            workoutSubCategory,
            fitnessLevel,
            extraProps
        });
      }else{
        this.props.navigation.replace('WorkoutComplete', {
          workout,
          reps,
          resistanceCategoryId,
          currentExerciseIndex,
          workoutSubCategory,
          fitnessLevel,
          extraProps
        });
      }

  }
  handleFinish(){
    const {exerciseIndex,totalExercise,exerciseList} = this.state;
    this.setState({timerStart:false});
    const nextExerciseIndex = this.state.exerciseIndex+1;
    const totalDuration = exerciseList[nextExerciseIndex-1] && exerciseList[nextExerciseIndex-1].duration?exerciseList[nextExerciseIndex-1].duration:30;
    if(totalExercise <= exerciseIndex){
      this.goToExercise();
    }else{
      this.setState({
        exerciseIndex:nextExerciseIndex,
        totalDuration:totalDuration,
        timerStart:false
      });
      setTimeout(()=>this.setState({timerStart: true }),100);
    }

    // console.log("habdle finish")
  }

  showExerciseInfoModal = () => {
    this.setState({
      // videoPaused: true,
      timerStart: false,
      exerciseInfoModalVisible: true,
    });
  }
  hideExerciseInfoModal = () => {
    this.setState({
      videoPaused: false,
      timerStart: true,
      exerciseInfoModalVisible: false,
    });
  }
  quitWorkout=()=>{
    this.goToExercise();
  }
  restartWorkout=()=>{
    this.handleExerciseReplace(this.state.exerciseIndex);
  }
  skipExercise=()=>{
    const {exerciseIndex,totalExercise,exerciseList} = this.state;
    const nextExerciseIndex = this.state.exerciseIndex+1;
    const totalDuration = exerciseList[nextExerciseIndex-1] && exerciseList[nextExerciseIndex-1].duration?exerciseList[nextExerciseIndex-1].duration:30;
    if(totalExercise <= exerciseIndex){
      this.goToExercise();
    }else{
      this.handleExerciseReplace(this.state.exerciseIndex+1);
    }
  }
  handleExerciseReplace(exerciseIndex){
    const{
      workout,
      reps,
      resistanceCategoryId,
      currentExerciseIndex,
      workoutSubCategory,
      fitnessLevel,
      extraProps,
      warmUp
    } = this.props.navigation.state.params;
    this.props.navigation.replace('ExerciseWC', {
          workout,
          reps,
          resistanceCategoryId,
          currentExerciseIndex:currentExerciseIndex,
          exerciseIndex,
          workoutSubCategory,
          fitnessLevel,
          extraProps,
          warmUp:warmUp
        });
  }
  handleUnpause=()=>{
    this.setState({
      videoPaused: false,
      pauseModalVisible: false,
      timerStart: true,
    });
  }
  handlePause=()=>{
    this.setState({
      videoPaused: true,
      timerStart: false,
      pauseModalVisible: true,
    });
  }


  render() {
  const {
    exerciseList,
    timerStart,
    exerciseIndex,
    type,
    totalDuration,
    videoPaused,
    exerciseInfoModalVisible,
    pauseModalVisible
  } = this.state;
  const{warmUp,workout} = this.props.navigation.state.params;
  // console.log("???",timerStart,totalDuration)
  const showInfoBtn = exerciseList.length > 0 && 
                      exerciseList[exerciseIndex-1].coachingTip && 
                      exerciseList[exerciseIndex-1].coachingTip.length>0 ;
  const workoutTimer = () =>{
      return (
          <WorkoutTimer
              totalDuration={Number(totalDuration)}
              start={timerStart}
              handleFinish={() =>{
                  this.handleFinish();
              } }
              exerciseIndex={exerciseIndex}
              customContainerStyle={{paddingBottom:20}}
            />
      )
  }

  let lastExercise = getLastExercise(exerciseList,exerciseIndex-1,workout,1)
    return (
      <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FadeInView
        duration={1000}
        style={styles.flexContainer}
      >
        <View>

          {
            exerciseList.length > 0 &&
            <Video
              source={{ uri: `${FileSystem.cacheDirectory}exercise-${type}-${exerciseIndex}.mp4`}}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={!videoPaused}
                isLooping
                style={{ width, height: width }}
            />
             
          }
          { showInfoBtn &&
              <ExerciseInfoButton onPress={this.showExerciseInfoModal} />
          }
          {/* //TODO:workout Timer */}
           {
             totalDuration !== null &&
            workoutTimer()
           } 
          {
            exerciseList.length > 0 &&
            <View style={styles.textContainer}>
              <Text style={styles.label}>{type === 'warmUp'?'Warm Up':'Cool Down'}</Text>
              <Text style={styles.currentExerciseNameText}>{exerciseList[exerciseIndex-1].displayName}</Text>
            </View>  
          }
        </View>
        <WorkoutProgressBar
              currentExercise={exerciseIndex}
              currentSet={exerciseIndex}
              exerciseList={exerciseList}
              workoutReps={1}
              rounds={exerciseList.length}
              progressType='onlyOne'
              rest={false}
              currentRound={exerciseIndex}
              circleProps={{size:wp('12%')}}
            />
      </FadeInView>

      {
        showInfoBtn  &&
        <ExerciseInfoModal
          exercise={exerciseList[exerciseIndex-1]}
          exerciseInfoModalVisible={exerciseInfoModalVisible}
          hideExerciseInfoModal={this.hideExerciseInfoModal}
        />
      }
       <PauseButtonRow
              handlePause={this.handlePause}
              nextExerciseName={lastExercise.nextExerciseName}
              lastExercise={lastExercise.isLastExercise}
              showNextExercise = {true}
              isNextButton={false}
      />
      <WorkoutPauseModal
          isVisible={pauseModalVisible}
          handleQuit={this.quitWorkout}
          handleRestart={this.restartWorkout}
          handleSkip={this.skipExercise}
          handleUnpause={this.handleUnpause}
          exerciseList={exerciseList}
          reps={1}
          currentExerciseIndex = {exerciseIndex}
      />
      <Loader
          loading={exerciseList.length === 0}
          color={colors.coral.standard}
      />
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
    paddingBottom:wp('22s%')
  },

  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.themeColor.color,
    textTransform:'uppercase'

  },

  textContainer:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
  },
  label:{
    fontFamily:fonts.GothamMedium,
    fontSize:wp('8%'),
    marginVertical:15,
    marginTop:wp('10%'),
    textTransform:'uppercase'
  }
});
