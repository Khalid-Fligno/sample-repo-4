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
import WorkoutProgress from '../../../../components/Workouts/WorkoutProgress';
import WorkoutPauseModal from '../../../../components/Workouts/WorkoutPauseModal';
import ExerciseInfoModal from '../../../../components/Workouts/ExerciseInfoModal';
import ExerciseInfoButton from '../../../../components/Workouts/ExerciseInfoButton';
import PauseButtonRow from '../../../../components/Workouts/PauseButtonRow';
import colors from '../../../../styles/colors';
import fonts from '../../../../styles/fonts';
import appsFlyer from 'react-native-appsflyer';
import { db } from '../../../../../config/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import HiitCircuitWorkoutProgress from '../../../../components/Workouts/HiitCircuitWorkoutProgress';
import HiitWorkoutProgress from '../../../../components/Workouts/HiitWorkoutProgress';
import FastImage from 'react-native-fast-image';
import iconSet from '@expo/vector-icons/build/Fontisto';

const { width } = Dimensions.get('window');

const updateWeeklyTargets = (obj, field, newTally) => {
  return Object.assign({}, obj, { [field]: newTally });
};



export default class ExercisesScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const workout = props.navigation.getParam('workout', null)
    const currentExerciseIndex =  props.navigation.getParam('currentExerciseIndex', null);
    const currentExercise = workout['exercises'][currentExerciseIndex];
    const workoutSubCategory = props.navigation.getParam('workoutSubCategory', null);
    const fitnessLevel =props.navigation.getParam('fitnessLevel', null);
    const rest = props.navigation.getParam('rest', false);
    let totalDuration = 0
    if(rest){
      totalDuration = workout.restIntervalMap[fitnessLevel-1] 
    }else{
       totalDuration = workout.workIntervalMap[fitnessLevel-1] 
    }
    

      this.state = {
          workout: workout,
          exerciseList: workout['exercises'],
          currentExercise:currentExercise ,
          reps: props.navigation.getParam('reps', null),
          resistanceCategoryId: props.navigation.getParam('resistanceCategoryId', null),
          fitnessLevel:fitnessLevel,
          workoutSubCategory : workoutSubCategory,
          currentExerciseIndex:currentExerciseIndex,  // Start from 0
          timerStart: false,
          totalDuration:10 ,
          pauseModalVisible: false,
          videoPaused: false,
          exerciseInfoModalVisible: false,
          appState: AppState.currentState,
          rest:rest 
    };
  }
  componentDidMount() {
    this.startTimer();
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  async updateWeekly(){
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
    return db.runTransaction((transaction) => {
      return transaction.get(userRef).then((userDoc) => {
        const newWeeklyComplete = userDoc.data().weeklyTargets[workoutName] + 1;
        const oldWeeklyTargets = userDoc.data().weeklyTargets;
        const newWeeklyTargets = updateWeeklyTargets(oldWeeklyTargets, workoutName, newWeeklyComplete);
        transaction.update(userRef, { weeklyTargets: newWeeklyTargets })
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
  return  (currentExerciseIndex === this.state.exerciseList.length - 1) && setCount === this.state.workout.workoutReps
}

  handleFinish = async (reps, resistanceCategoryId,currentExerciseIndex) => {
    this.setState({ timerStart: false });

    if(this.state.workout.filters.includes('strength')){
      let setCount = this.props.navigation.getParam('setCount', 1); //Start from 0
      if (this.checkFinished(currentExerciseIndex,setCount)) {
        console.log("update weekly targets")
        // this.updateWeekly();
        // appsFlyer.trackEvent('resistance_workout_complete');
        this.workoutComplete(reps, resistanceCategoryId);
      }
      else if (setCount === this.state.workout.workoutReps) {
        console.log("Go to next  exercise")
        this.goToExercise(1,reps,resistanceCategoryId,currentExerciseIndex + 1,)
      } 
      else {
        console.log("Incresase count")
        this.goToExercise(setCount + 1,reps,resistanceCategoryId,currentExerciseIndex)
      }
    }else if(this.state.workout.filters.includes('circuit')){
      let setCount = this.props.navigation.getParam('setCount', 1); // start from 1
      if(this.checkFinished(currentExerciseIndex,setCount)){
        console.log("finished");
        // this.updateWeekly();
        // appsFlyer.trackEvent('complete_hiit_circuit_workout');
        
        this.workoutComplete(reps, resistanceCategoryId);
      }
      else if(currentExerciseIndex === this.state.exerciseList.length - 1 ){
        console.log("Increase Count")
        setCount += 1;  //increase count when 1st,2nd... round finished
        this.goToExercise(setCount,reps,resistanceCategoryId,0)
      }else{
        console.log("Go to next Exercise") //go to next exercise if round not finished
        this.goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex +1 )
      }
    
    }else if(this.state.workout.filters.includes('interval')){
      let setCount = this.props.navigation.getParam('setCount', 1); //start from 1
      if(setCount === this.state.workout.workoutReps){
        console.log("Finished") //finished when all rounds are finished
        // this.updateWeekly();
        // appsFlyer.trackEvent('complete_hiit_workout');
        this.workoutComplete(reps, resistanceCategoryId);
      }else{
        console.log("Go to next round")
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
    fitnessLevel:this.state.fitnessLevel
  });
}   

goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex,rest=false){
  this.props.navigation.replace('Exercise', {
    workout:this.state.workout,
    setCount,
    reps,
    resistanceCategoryId,
    currentExerciseIndex,
    workoutSubCategory:this.state.workoutSubCategory,
    fitnessLevel:this.state.fitnessLevel,
    rest
  });
}




  restControl =(reps, resistanceCategoryId,currentExerciseIndex) =>{
    const setCount = this.props.navigation.getParam('setCount', 1)
    console.log("rest call")
    if(this.state.workout.filters.includes('strength')){
      this.handleFinish( reps, resistanceCategoryId,currentExerciseIndex)
    }else if(this.state.workout.filters.includes('circuit')){
      this.goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex,true);

      // this.props.navigation.replace('Exercise', {
      //   workout:this.state.workout,
      //   reps,
      //   setCount: this.props.navigation.getParam('setCount', 1),
      //   resistanceCategoryId,
      //   currentExerciseIndex:currentExerciseIndex,
      //   workoutSubCategory:this.state.workoutSubCategory,
      //   fitnessLevel:this.state.fitnessLevel,
      //   rest:true
      // });
    }else if(this.state.workout.filters.includes('interval')){
      this.goToExercise(setCount,reps,resistanceCategoryId,currentExerciseIndex,true);
      // this.props.navigation.replace('Exercise', {
      //   workout:this.state.workout,
      //   reps,
      //   setCount: this.props.navigation.getParam('setCount', 1),
      //   resistanceCategoryId,
      //   currentExerciseIndex:currentExerciseIndex,
      //   workoutSubCategory:this.state.workoutSubCategory,
      //   fitnessLevel:this.state.fitnessLevel,
      //   rest:true
      // });
    }
  }

  handlePause = () => {
    this.setState({
      videoPaused: true,
      timerStart: false,
      pauseModalVisible: true,
    });
  }

  handleUnpause = () => {
    this.setState({
      videoPaused: false,
      timerStart: true,
      pauseModalVisible: false,
    });
  }

  handleQuitWorkout = async () => {
    this.setState({ pauseModalVisible: false });
    // const exerciseVideos = [
    //   `${FileSystem.cacheDirectory}exercise-1.mp4`,
    //   `${FileSystem.cacheDirectory}exercise-2.mp4`,
    //   `${FileSystem.cacheDirectory}exercise-3.mp4`,
    //   `${FileSystem.cacheDirectory}exercise-4.mp4`,
    //   `${FileSystem.cacheDirectory}exercise-5.mp4`,
    //   `${FileSystem.cacheDirectory}exercise-6.mp4`,
    // ];
    // Promise.all(exerciseVideos.map(async (exerciseVideoURL) => {
    //   FileSystem.deleteAsync(exerciseVideoURL, { idempotent: true });
    // }));
    FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res)=>{
      console.log(res)
        Promise.all(res.map(async (item,index) => {
            if (item.includes("exercise-")) {
              console.log(`${FileSystem.cacheDirectory}${item}`)
              FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true }).then(()=>{
                // console.log("deleted...",item)
              })
            }
        }))
    })
      this.props.navigation.navigate('WorkoutsSelection');
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
            this.props.navigation.replace('Exercise', {
              workout:this.state.workout,
              reps,
              setCount: this.props.navigation.getParam('setCount', 0),
              resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
              currentExerciseIndex:currentExerciseIndex,
              workoutSubCategory:this.state.workoutSubCategory,
              fitnessLevel:this.state.fitnessLevel
            });
          },
        },
      ],
      { cancelable: false },
    );
  }

  skipExercise = (exerciseList, reps,currentExerciseIndex) => {
    console.log(exerciseList, reps,currentExerciseIndex)
    Alert.alert(
      'Warning',
      'Are you sure you want to skip this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            let setCount = this.props.navigation.getParam('setCount', 0);
            if(currentExerciseIndex === this.state.exerciseList.length - 1){
              console.log("update weekly target")
              this.updateWeekly();
                appsFlyer.trackEvent('resistance_workout_complete');
                this.props.navigation.replace('WorkoutComplete', {
                  workout:this.state.workout,
                  reps,
                  resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
                  workoutSubCategory:this.state.workoutSubCategory,
                  fitnessLevel:this.state.fitnessLevel
                });
            }else{
              this.props.navigation.replace('Exercise', {
                workout:this.state.workout,
                reps,
                resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
                currentExerciseIndex: currentExerciseIndex + 1,
                workoutSubCategory:this.state.workoutSubCategory,
                fitnessLevel:this.state.fitnessLevel
              });
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
      workout
    } = this.state;
    console.log(rest,workoutSubCategory)
    console.log(fitnessLevel,totalDuration,this.props.navigation.getParam('setCount', 1))
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
                  ref={(ref) => this.videoRef = ref}
                  source={{ uri: `${FileSystem.cacheDirectory}exercise-${currentExerciseIndex+1}.mp4` || exerciseList[0].videoURL }}
                  resizeMode="contain"
                  repeat
                  muted
                  paused={videoPaused}
                  style={{ width, height: width }}
              />)
               
            }
           
            {
             rest && <FastImage
                source={require('../../../../../assets/images/hiit-rest-placeholder.jpg')}
                style={{ width, height: width }}
              />
            }
             
            <ExerciseInfoButton onPress={this.showExerciseInfoModal} />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              handleFinish={() =>{
                if(!rest)
                  this.restControl( reps, resistanceCategoryId,currentExerciseIndex)
                else  
                  this.handleFinish( reps, resistanceCategoryId,currentExerciseIndex)
              } }
            />
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
              {workout.filters.includes('strength') &&(
                 <Text style={styles.currentExerciseRepsText}>
                    x{reps}
                 </Text> 
              )
              }
               {!workout.filters.includes('strength') &&(
                 <Text style={styles.currentExerciseRepsText}>
                    {totalDuration} sec
                 </Text> 
              )
              }
            </View>
          </View>
          {
              workout.filters.includes('strength') && ( <WorkoutProgress
                  currentExercise={currentExerciseIndex + 1}
                  currentSet={this.props.navigation.getParam('setCount', 1)}
                  exerciseList={exerciseList}
                />)
          }
         
          {
            workout.filters.includes('circuit')&& (<HiitCircuitWorkoutProgress
                currentExercise={currentExerciseIndex + 1}
                currentSet={this.props.navigation.getParam('setCount', 1)}
                exerciseList={exerciseList}
              />)  
          }
          
          {
            workout.filters.includes('interval') &&  (<HiitWorkoutProgress
                currentRound={this.props.navigation.getParam('setCount', 1)}
                // currentSet={1}
                rest
              />)
          }
          {/* {
            (this.props.navigation.getParam('setCount', 1) === workout.workoutReps &&
            currentExerciseIndex + 1 === exerciseList.length -1) &&
            (
              <PauseButtonRow
                handlePause={this.handlePause}
                nextExerciseName="NEARLY DONE!"
                lastExercise
              />
            )
            
            (this.props.navigation.getParam('setCount', 1) < workout.workoutReps &&
            currentExerciseIndex + 1 < exerciseList.length -1) &&
            (
              <PauseButtonRow
                handlePause={this.handlePause}
                nextExerciseName={exerciseList[currentExerciseIndex + 1].name}
              />
            )
          } */}
             
          <PauseButtonRow
            handlePause={this.handlePause}
            nextExerciseName={exerciseList[currentExerciseIndex].name}
          />
          <WorkoutPauseModal
            isVisible={pauseModalVisible}
            handleQuit={this.quitWorkout}
            handleRestart={this.restartWorkout}
            handleSkip={this.skipExercise}
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
    fontSize: 12,
  },
});
