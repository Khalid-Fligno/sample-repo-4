import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  StatusBar,
  Alert,
  AppState,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import Video from 'react-native-video';
import FadeInView from 'react-native-fade-in-view';
import WorkoutTimer from '../../../../components/Workouts/WorkoutTimer';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
import ExerciseInfoModal from '../../../../components/Workouts/ExerciseInfoModal';
import ExerciseInfoButton from '../../../../components/Workouts/ExerciseInfoButton';
import PauseButtonRow from '../../../../components/Workouts/PauseButtonRow';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';
import appsFlyer from 'react-native-appsflyer';
import { db } from '../../../../../config/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import iconSet from '@expo/vector-icons/build/Fontisto';
import { set } from 'react-native-reanimated';
import { consumeAllItemsAndroid } from 'react-native-iap';
import WorkoutProgressBar from '../../../../components/Workouts/WorkoutProgressBar';
import { findWorkoutType, getLastExercise, showNextExerciseFlag } from '../../../../utils/workouts';
import { isActiveChallenge } from '../../../../utils/challenges';
import firebase from 'firebase';
import moment from 'moment';
import { Stop } from 'react-native-svg';
import StopWatch from '../../../../components/Workouts/WorkoutStopwatch';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { object } from 'prop-types';
const { width, height } = Dimensions.get('window');

const updateWeeklyTargets = (obj, field, newTally) => {
  return Object.assign({}, obj, { [field]: newTally });
};



export default class ExercisesScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const workout = props.navigation.getParam('workout', null)
    const currentExerciseIndex =  props.navigation.getParam('currentExerciseIndex', 0);
    const currentExercise = workout['exercises'][currentExerciseIndex];
    const workoutSubCategory = props.navigation.getParam('workoutSubCategory', null);
    const fitnessLevel =props.navigation.getParam('fitnessLevel', null);
    let rest = props.navigation.getParam('rest', false);
    const setCount = this.props.navigation.getParam('setCount', 1);

    let totalDuration = 0;

    if(rest){
      totalDuration = workout.restIntervalMap[fitnessLevel-1] 
    }else{
       totalDuration = workout.workIntervalMap[fitnessLevel-1] 
    }
    //For count true workout Rest
    if(workout.count && currentExercise && currentExercise.name === 'rest' && currentExercise['restIntervalMap']){
      totalDuration = currentExercise['restIntervalMap'][String(setCount)][String(fitnessLevel-1)]
      rest = true
    }  

    //for count false and rest varible false in workoutProcessType === 'circular workout
    if(workout.count === false && currentExercise && currentExercise.name === 'rest'&& workout['restIntervalMap']) {
      totalDuration = workout['restIntervalMap'][String(fitnessLevel-1)]
      rest = true
    }

      this.state = {
          workout: workout,
          exerciseList: workout['exercises'],
          currentExercise:currentExercise ,
          reps: props.navigation.getParam('reps', null),
          resistanceCategoryId: props.navigation.getParam('resistanceCategoryId', null),
          extraProps: props.navigation.getParam('extraProps', {}),
          fitnessLevel:fitnessLevel,
          workoutSubCategory : workoutSubCategory,
          currentExerciseIndex:currentExerciseIndex,  // Start from 0
          timerStart: false,
          totalDuration:totalDuration,
          pauseModalVisible: false,
          videoPaused: false,
          exerciseInfoModalVisible: false,
          appState: AppState.currentState,
          rest:rest,
          // isRunning:false
    };
  }
  componentDidMount() {
      this.startTimer();
    // else if (this.state.workout && this.state.workout.count){
    //   this.setState({isRunning:true})
    // }
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  async updateWeekly(){
    const {workout} = this.state
    let workoutName = 'none'
    if(this.state.workout.filters.includes('circuit')){
        workoutName = 'circuit'
    }else if(this.state.workout.filters.includes('interval')){
      workoutName = 'interval'
    }else if(this.state.workout.filters.includes('strength')){
      workoutName = 'strength'
    }
    if(workoutName === 'none'){
      return null
    }
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);

    isActiveChallenge().then((res)=>{
      if(res){
        var challengeRef = db.collection('users').doc(uid).collection('challenges').doc(res.id);
        // Atomically add a new region to the "regions" array field.
        var workouts = challengeRef.update({
          workouts: firebase.firestore.FieldValue.arrayUnion({
            date:moment(new Date()).format('YYYY-MM-DD'),
            id:workout.id,
            name:workout.name,
            displayName:workout.displayName,
            target:workoutName,
            time:new Date().getTime()
          })
        }).then((res)=>console.log("Adeed to challenge",res))
        
      }
    })

    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newWeeklyComplete = userDoc.data().weeklyTargets[workoutName] + 1;
        const workoutCount = userDoc.data().totalWorkoutCompleted + 1;
        const oldWeeklyTargets = userDoc.data().weeklyTargets;
        const newWeeklyTargets = updateWeeklyTargets(oldWeeklyTargets, workoutName, newWeeklyComplete);
        transaction.update(userRef, { 
          weeklyTargets: newWeeklyTargets,
          totalWorkoutCompleted:workoutCount
         })
      });
    });
  }
  
  handleAppStateChange = (nextAppState) => {
    const { appState } = this.state;
    if (appState === 'active' && nextAppState.match(/inactive|background/)) {
      this.handlePause();
    }
    this.setState({ appState: nextAppState });
  }

  startTimer = () => {
    this.setState({ timerStart: true });
  }

  checkFinished(currentExerciseIndex,setCount){
    const {workout} = this.state
    if(workout.workoutProcessType === 'onlyOne'){
      return setCount === this.state.workout.workoutReps
    }
    return  (currentExerciseIndex === this.state.exerciseList.length - 1) && setCount === this.state.workout.workoutReps
  }

  handleFinish = async (reps, resistanceCategoryId,currentExerciseIndex) => {
    this.setState({ timerStart: false });
    let setCount = this.props.navigation.getParam('setCount', 1); //start from 1
    const {workout} = this.state
    if(workout.workoutProcessType === 'oneByOne'){
      if (this.checkFinished(currentExerciseIndex,setCount)) {
        console.log("update weekly targets")
        this.updateWeekly();
        appsFlyer.trackEvent('resistance_workout_complete');
        this.workoutComplete(reps, resistanceCategoryId);
      }
   
      else if (setCount === this.state.workout.workoutReps) {
        console.log("Go to next  exercise")
        this.goToExercise(1,reps,resistanceCategoryId,currentExerciseIndex + 1,)
      } 
      else {
        console.log("Incresase count")
        if (workout.rest && !this.state.rest) //for workout.rest === true
        {
          this.goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex ,true);
        }          
        else{
          this.goToExercise(setCount + 1,reps,resistanceCategoryId,currentExerciseIndex);
        }
      }
    }else if(workout.workoutProcessType === 'circular'){
      if(this.checkFinished(currentExerciseIndex,setCount)){
        // console.log("finished");
        this.updateWeekly();
        appsFlyer.trackEvent('complete_hiit_circuit_workout');
        
        this.workoutComplete(reps, resistanceCategoryId);
      }
      else if(currentExerciseIndex === this.state.exerciseList.length - 1 ){
        // console.log("Increase Count")
        setCount += 1;  //increase count when 1st,2nd... round finished
        this.goToExercise(setCount,reps,resistanceCategoryId,0)
      }else{
        // console.log("Go to next Exercise") //go to next exercise if round not finished
        this.goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex +1 )
      }
    
    }else if(workout.workoutProcessType === 'onlyOne'){
       
      if(this.checkFinished(currentExerciseIndex,setCount)){
        // console.log("Finished") //finished when all rounds are finished
        this.updateWeekly();
        appsFlyer.trackEvent('complete_hiit_workout');
        this.workoutComplete(reps, resistanceCategoryId);
      }else{
        // console.log("Go to next round")
        this.goToExercise(setCount + 1,reps,resistanceCategoryId,currentExerciseIndex)
      }
    }
    
  }

  workoutComplete(reps, resistanceCategoryId){
    this.props.navigation.replace('WorkoutComplete', {
      workout:this.state.workout,
      reps,
      resistanceCategoryId,
      workoutSubCategory:this.state.workoutSubCategory,
      fitnessLevel:this.state.fitnessLevel,
      extraProps:this.state.extraProps
    });
  }   

  goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex,rest=false){
   let {workoutSubCategory,fitnessLevel,fromCalender,extraProps} = this.state
    this.props.navigation.replace('Exercise', {
      workout:this.state.workout,
      setCount,
      reps,
      resistanceCategoryId,
      currentExerciseIndex,
      workoutSubCategory,
      fitnessLevel,
      rest,
      fromCalender,
      extraProps
    });
  }

  restControl =(reps, resistanceCategoryId,currentExerciseIndex) =>{
    const {workout} = this.state
    const setCount = this.props.navigation.getParam('setCount', 1)
    console.log("rest call")
    if(workout.workoutProcessType === 'oneByOne'){
      // if (setCount === workout.workoutReps && workout.rest) 
      //   this.goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex ,true);
      // else
        this.handleFinish( reps, resistanceCategoryId,currentExerciseIndex);
    }else if(workout.workoutProcessType === 'circular'){

      if(workout.rest === undefined)
        this.goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex,true);
      else
        this.handleFinish( reps, resistanceCategoryId,currentExerciseIndex);

    }else if(workout.workoutProcessType === 'onlyOne'){

      this.goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex,true);
      
    }
  }

  handlePause = () => {
    this.setState({
      videoPaused: true,
      timerStart: false,
      pauseModalVisible: true,
      // isRunning:false
    });
  }

  handleUnpause = () => {
    if(this.state.workout && this.state.workout.count){
      this.setState({
        videoPaused: false,
        pauseModalVisible: false,
        // isRunning:true,
        timerStart: true,
      });
    }else{
      this.setState({
        videoPaused: false,
        timerStart: true,
        pauseModalVisible: false,
      });
    }
  
  }

  handleQuitWorkout = async () => {
    this.setState({ pauseModalVisible: false });
    
    FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res)=>{
        Promise.all(res.map(async (item,index) => {
            if (item.includes("exercise-")) {
              console.log(`${FileSystem.cacheDirectory}${item}`)
              FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true }).then(()=>{
                // console.log("deleted...",item)
              })
            }
        }))
    })
      if(this.state.extraProps['fromCalender']){
        this.props.navigation.navigate('CalendarHome');
      }else{
        this.props.navigation.navigate('WorkoutsSelection');
      }
      
  }

  quitWorkout = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to quit this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: this.handleQuitWorkout,
        },
      ],
      { cancelable: false },
    );
  }

  restartWorkout = (exerciseList, reps,currentExerciseIndex) => {
    Alert.alert(
      'Warning',
      'Are you sure you want to restart this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            const setCount = this.props.navigation.getParam('setCount', 1)
            this.goToExercise(setCount,reps,null,currentExerciseIndex,false)
          },
        },
      ],
      { cancelable: false },
    );
  }

  skipExercise = (exerciseList, reps,currentExerciseIndex) => {
    // console.log(exerciseList, reps,currentExerciseIndex)
    Alert.alert(
      'Warning',
      'Are you sure you want to skip this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            let setCount = this.props.navigation.getParam('setCount', 1);
            
            if(this.checkFinished(currentExerciseIndex,setCount)){
              console.log("update weekly target")
              this.updateWeekly();
                appsFlyer.trackEvent('resistance_workout_complete');
                this.workoutComplete(reps,null)
               
            }else{
              let {workout} = this.state
              console.log(currentExerciseIndex,setCount)
              if(workout.workoutProcessType === 'oneByOne'){
                if(currentExerciseIndex < workout.exercises.length-1)
                    this.goToExercise(1,reps,null,currentExerciseIndex + 1,false)
                else{
                  this.goToExercise(workout.workoutReps,reps,null,currentExerciseIndex,false)
                }

              }else if(workout.workoutProcessType === 'circular'){
                    if(currentExerciseIndex < workout.exercises.length-1 ){
                      this.goToExercise(setCount,reps,null,currentExerciseIndex + 1,false)
                    }else if(currentExerciseIndex === workout.exercises.length-1){
                      this.goToExercise(setCount + 1,reps,null,0,false)
                    }
              }
       
            }
           
          },
        },
      ],
      { cancelable: false },
    );
  }

  showExerciseInfoModal = () => {
    this.setState({
      videoPaused: true,
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

 
  render() {
    const {
      currentExercise,
      currentExerciseIndex,
      exerciseList,
      timerStart,
      totalDuration,
      reps,
      pauseModalVisible,
      resistanceCategoryId,
      videoPaused,
      exerciseInfoModalVisible,
      workoutSubCategory,
      fitnessLevel,
      rest,
      workout,
      // isRunning
    } = this.state;

  const setCount = this.props.navigation.getParam('setCount', 1)

  // let getProgressType = findWorkoutType(workout);
    let handleSkip = false;
    if(workout.workoutProcessType !== 'onlyOne' && !workout.count){
      handleSkip = true
    }

  //TODO : calculate next exercise show flag  
    let showNextExercise = showNextExerciseFlag(workout,setCount,rest) 

  //TODO : calculate when count true  
    if(workout.count && currentExercise && currentExercise['workIntervalMap']){
      this.repsInterval = currentExercise['workIntervalMap'][String(setCount)][String(fitnessLevel-1)]
    }  
    if(workout.count && currentExercise && currentExercise.name === 'rest' && currentExercise['restIntervalMap']){
      this.repsInterval = currentExercise['restIntervalMap'][String(setCount)][String(fitnessLevel-1)]
      console.log(this.repsInterval,String(setCount),currentExercise['restIntervalMap'][String(setCount)][String(fitnessLevel-1)])
    }  
    

  //TODO : calculate flag to show last exercise  
    let lastExercise = getLastExercise(exerciseList,currentExerciseIndex,workout,setCount)

    let showCT =  currentExercise.coachingTip && currentExercise.coachingTip.length > 0 && !currentExercise.coachingTip.includes("none")?true:false
    

    const workoutTimer = () =>{
      if((!workout.count) && !rest )
        return (
            <WorkoutTimer
                totalDuration={Number(totalDuration)}
                start={timerStart}
                handleFinish={() =>{
                  if(!rest)
                    this.restControl( reps, resistanceCategoryId,currentExerciseIndex)
                  else  
                    this.handleFinish( reps, resistanceCategoryId,currentExerciseIndex)
                } }
                customContainerStyle={{paddingBottom:20}}
              />
        )
     else if(rest)
        return (
          <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              handleFinish={() =>{
                if(!rest)
                  this.restControl( reps, resistanceCategoryId,currentExerciseIndex)
                else  
                  this.handleFinish( reps, resistanceCategoryId,currentExerciseIndex)
              } }
            customContainerStyle={{paddingBottom:20}}
            />
        )
      else if((workout.count) && !rest)  
        return (
          <View style={styles.containerEmptyBlackBox} ></View>
        )
    }

    console.log("videoPaused",videoPaused)
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FadeInView
          duration={1000}
          style={styles.flexContainer}
        >
          <View>
            {
              !rest && (<Video
                  //ref={(ref) => this.videoRef = ref}
                  source={{ uri: `${FileSystem.cacheDirectory}exercise-${currentExerciseIndex+1}.mp4`}}
                  resizeMode="contain"
                  repeat={true}
                  muted={true}
                  paused={videoPaused}
                  playWhenInactive
                  style={{ width, height: width }}
                  onError={()=>Alert.alert('video play error')}
              />)
               
            }
           
            {
             rest && <FastImage
                source={require('../../../../../assets/images/hiit-rest-placeholder.jpg')}
                style={{ width, height: width }}
              />
            }
             
             {
               showCT && <ExerciseInfoButton onPress={this.showExerciseInfoModal} />
             }
            

            {/* //TODO:workout Timer */}
             {
              workoutTimer()
             } 
          </View>

          <View style={styles.currentExerciseTextContainer}>
            <View style={styles.currentExerciseNameTextContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.currentExerciseNameText}
              >
                {rest?'Rest': currentExercise.name.toUpperCase()}
              </Text>
            </View>
            <View style={styles.currentExerciseRepsTextContainer}>
              { (workout.workoutProcessType === 'oneByOne' && !workout.count && !workout.rest) &&(
                 <Text style={styles.currentExerciseRepsText}>
                   {workout.workoutReps} x {reps}
                 </Text> 
                )
              }
              { (workout.workoutProcessType === 'oneByOne' && !workout.count && workout.rest) &&(
                 <Text style={styles.currentExerciseRepsText}>
                   {totalDuration < 60 &&  `${totalDuration} sec`} 
                   {totalDuration > 60 &&  `${totalDuration/60} m`} 
                 </Text> 
                )
              }
               {(workout.workoutProcessType != 'oneByOne' && !workout.count)  &&(
                 <Text style={styles.currentExerciseRepsText}>
                    {totalDuration < 60 &&  `${totalDuration} sec`} 
                    {totalDuration > 60 &&  `${totalDuration/60} m`} 
                 </Text> 
                )
              }
              {
               (workout.count) && this.repsInterval &&(
                 <Text style={styles.currentExerciseRepsText}>
                    {this.repsInterval} {rest && 'sec'}
                 </Text> 
               )
              }
            </View>
          </View>
          
          <WorkoutProgressBar
              currentExercise={currentExerciseIndex + 1}
              currentSet={setCount}
              exerciseList={exerciseList}
              workoutReps={workout.workoutReps}
              rounds={workout.workoutReps}
              progressType={workout.workoutProcessType}
              rest={rest}
              currentRound={setCount}
            />
      
          {/* //TODO pause buttons bottom */}
          {
            (workout.workoutProcessType === 'onlyOne') &&
            (
              <PauseButtonRow
                handlePause={this.handlePause}
                nextExerciseName={exerciseList[currentExerciseIndex].name}
                showNextExercise = {showNextExercise}
              />
            )
          }
          {
            (workout.workoutProcessType !== 'onlyOne') && 
            <PauseButtonRow
              handlePause={this.handlePause}
              nextExerciseName={lastExercise.nextExerciseName}
              lastExercise={lastExercise.isLastExercise}
              showNextExercise = {showNextExercise}
              isNextButton={rest?false:workout.count}
              handleNextButton={()=>this.handleFinish( reps, resistanceCategoryId,currentExerciseIndex)}
            />
          }
          
            
          <WorkoutPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleRestart={this.restartWorkout}
            handleSkip={handleSkip?this.skipExercise:null}
            handleUnpause={this.handleUnpause}
            exerciseList={exerciseList}
            reps={reps}
            currentExerciseIndex = {currentExerciseIndex}
          />
          <ExerciseInfoModal
            exercise={currentExercise}
            exerciseInfoModalVisible={exerciseInfoModalVisible}
            hideExerciseInfoModal={this.hideExerciseInfoModal}
          />
        </FadeInView>
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
