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

const { width } = Dimensions.get('window');

const updateWeeklyTargets = (obj, field, newTally) => {
  return Object.assign({}, obj, { [field]: newTally });
};

export default class ExercisesScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const currentExerciseIndex =  props.navigation.getParam('currentExerciseIndex', null);
    const currentExercise = props.navigation.getParam('exerciseList', null)[currentExerciseIndex];
    this.state = {
      exerciseList: props.navigation.getParam('exerciseList', null),
      currentExercise:currentExercise ,
      reps: props.navigation.getParam('reps', null),
      resistanceCategoryId: props.navigation.getParam('resistanceCategoryId', null),
      workoutSubCategory : this.props.navigation.getParam('workoutSubCategory', null),
      currentExerciseIndex:currentExerciseIndex,
      timerStart: false,
      totalDuration: 60,
      pauseModalVisible: false,
      videoPaused: false,
      exerciseInfoModalVisible: false,
      appState: AppState.currentState,
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

    // const uid = await AsyncStorage.getItem('uid');
    // const userRef = db.collection('users').doc(uid);
    // return db.runTransaction((transaction) => {
    //   return transaction.get(userRef).then((userDoc) => {
    //     const newWeeklyComplete = userDoc.data().weeklyTargets[this.state.workoutSubCategory.name] + 1;
    //     const oldWeeklyTargets = userDoc.data().weeklyTargets;
    //     const newWeeklyTargets = updateWeeklyTargets(oldWeeklyTargets, this.state.workoutSubCategory.name, newWeeklyComplete);
    //     transaction.update(userRef, { weeklyTargets: newWeeklyTargets })
    //   });
    // });
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

  handleFinish = async (exerciseList, reps, resistanceCategoryId,currentExerciseIndex) => {
    this.setState({ timerStart: false });
    let setCount = this.props.navigation.getParam('setCount', 0);
    setCount += 1;


    if (setCount === 3 && currentExerciseIndex === this.state.exerciseList.length - 1) {
      console.log("update weekly targets")
      this.updateWeekly();
      appsFlyer.trackEvent('resistance_workout_complete');
      this.props.navigation.replace('WorkoutComplete', {
        exerciseList,
        reps,
        resistanceCategoryId,
        workoutSubCategory:this.state.workoutSubCategory
      });
    }
    else if (setCount === 3) {
      console.log("Go to next  exercise")
      this.props.navigation.replace('Exercise', {
        exerciseList,
        setCount:0,
        reps,
        resistanceCategoryId,
        currentExerciseIndex:currentExerciseIndex + 1,
        workoutSubCategory:this.state.workoutSubCategory
      });
    } 
    else {
      console.log("Incresase count")
      this.props.navigation.replace('Exercise', {
        exerciseList,
        reps,
        setCount,
        resistanceCategoryId,
        currentExerciseIndex:currentExerciseIndex ,
        workoutSubCategory:this.state.workoutSubCategory
      });
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
              exerciseList,
              reps,
              setCount: this.props.navigation.getParam('setCount', 0),
              resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
              currentExerciseIndex:currentExerciseIndex,
              workoutSubCategory:this.state.workoutSubCategory
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
                  exerciseList,
                  reps,
                  resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
                  workoutSubCategory:this.state.workoutSubCategory
                });
            }else{
              this.props.navigation.replace('Exercise', {
                exerciseList,
                reps,
                resistanceCategoryId: this.props.navigation.getParam('resistanceCategoryId', null),
                currentExerciseIndex: currentExerciseIndex + 1,
                workoutSubCategory:this.state.workoutSubCategory
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
    } = this.state;
    console.log(this.state.workoutSubCategory)
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <FadeInView
          duration={1000}
          style={styles.flexContainer}
        >
          <View>
            <Video
              ref={(ref) => this.videoRef = ref}
              source={{ uri: `${FileSystem.cacheDirectory}exercise-${currentExerciseIndex+1}.mp4` || exerciseList[0].videoURL }}
              resizeMode="contain"
              repeat
              muted
              paused={videoPaused}
              style={{ width, height: width }}
            />
            <ExerciseInfoButton onPress={this.showExerciseInfoModal} />
            <WorkoutTimer
              totalDuration={totalDuration}
              start={timerStart}
              handleFinish={() => this.handleFinish(exerciseList, reps, resistanceCategoryId,currentExerciseIndex)}
            />
          </View>
          <View style={styles.currentExerciseTextContainer}>
            <View style={styles.currentExerciseNameTextContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.currentExerciseNameText}
              >
                {currentExercise.name.toUpperCase()}
              </Text>
            </View>
            <View style={styles.currentExerciseRepsTextContainer}>
              <Text style={styles.currentExerciseRepsText}>
                x{reps}
              </Text>
            </View>
          </View>
          <WorkoutProgress
            currentExercise={currentExerciseIndex + 1}
            currentSet={this.props.navigation.getParam('setCount', 0) + 1}
            exerciseList={exerciseList}
          />
           {/* <HiitCircuitWorkoutProgress
            currentExercise={1}
            currentSet={this.props.navigation.getParam('setCount', 1)}
          /> */}
            {/* <HiitWorkoutProgress
            currentRound={this.props.navigation.getParam('roundCount', 0) + 1}
            currentSet={1}
          /> */}
          <PauseButtonRow
            handlePause={this.handlePause}
            nextExerciseName={exerciseList[1].name}
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
    width: width - 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  currentExerciseNameText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 18,
    color: colors.themeColor.color,
  },
  currentExerciseRepsTextContainer: {
    width: 30,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  currentExerciseRepsText: {
    fontFamily: fonts.boldNarrow,
    fontSize: 12,
  },
});
