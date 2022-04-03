import React from 'react';
import { StyleSheet, View, Alert, Text, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as FileSystem from 'expo-file-system';
// import moment from 'moment';
import { db } from '../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import globalStyle from '../../../styles/globalStyles';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import CustomButtonGroup from '../../../components/Shared/CustomButtonGroup';
import WorkoutScreenStyle from './WorkoutScreenStyle';
import WorkoutListItem from '../../../components/Workouts/WorkoutListItem';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { downloadExerciseWC, loadExercise } from '../../../utils/workouts';
let fitnessLevel = 1
const customUrl = 'https://firebasestorage.googleapis.com/v0/b/quickstart-1588594831516.appspot.com/o/Photos%2Fworkout1.jpeg?alt=media&token=17a7f10f-a9bb-4bfb-a27e-4b7ac0261392'


export default class WorkoutsSelectionScreen2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
      loading: true,
      filterIndex: 0,
      location: props.navigation.getParam('workoutLocation', null),
      loadingExercises:false,
      downloaded:0,
      totalToDownload:0,
      files:undefined,
      newWorkoutParams:undefined,
      finishdownloaded:undefined
    };
  }
  componentDidMount = async () => {
    this.selectedMainCategory = this.props.navigation.getParam('selectedMainCategory', null);
    this.selectedSubCategory = this.props.navigation.getParam('selectedSubCategory', null);
    // console.log(this.selectedMainCategory,this.selectedSubCategory.name)
    await this.fetchWorkouts();
  }
  componentDidUpdate=()=>{
    if(this.state.files!==undefined){
      this.state.downloaded++
      if(this.state.totalToDownload===this.state.downloaded){
        this.setState({
          finishdownloaded:true,
          files:undefined,
        }) 
      }
    }
    if (this.state.newWorkoutParams !== undefined && this.state.finishdownloaded===true) {
      this.goToNext(this.state.newWorkoutParams)
    }
  }
  componentWillUnmount = async () => {
    this.unsubscribe();
  }
  fetchWorkouts = async () => {
    this.setState({ loading: true });
    this.unsubscribe = await db.collection('newWorkouts')
      .where("filters", "array-contains",this.selectedSubCategory.name)
     
      .onSnapshot(async (querySnapshot) => {
        const workouts = [];
        await querySnapshot.forEach(async (doc) => {
          doc.data().tags.map(async (res)=>{
            if(res.toLowerCase() === 'subscription')
              await workouts.push(await doc.data());

          })
          // if(!(doc.data().tags.includes("8WC")))
          // await workouts.push(await doc.data());
        });
        this.setState({ workouts, loading: false });
      });
  }
  //DOWNLOAD FUNCTION START
  loadExercise =  async (workoutData) => {
    const type = 'interval'
    await FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res) => {
      Promise.all(
        res.map(async (item, index) => {
          if (item.includes("exercise-")) {
            FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, {
              idempotent: true,
            }).then(() => {
             
            });
          }
        })
      );
    });
   
    if (workoutData.newWorkout) {
      let exercises = [];
      let tempExerciseData = [];
      let workoutExercises =[];
  
      const exerciseRef = (
        await db
          .collection("Exercises")
          
          .get()
      ).docs;
      
      workoutData.filters.forEach(resType => {
        if (resType === 'interval') {
          exerciseRef.forEach((exercise) => {
            workoutData.exercises.forEach(resExercise => {
              if (resExercise.id === exercise.id) {
                const exerciseDuration = Object.assign({}, exercise.data(), { duration: resExercise.duration })
                tempExerciseData.push(exerciseDuration)
              }
              workoutExercises = workoutData.exercises.map((id) =>{
                return tempExerciseData.find((res) => res.id === id);
              })
            })
          });
        } else {
          exerciseRef.forEach((exercise) => {
            workoutData.exercises.forEach(resExercise => {
              if (resExercise === exercise.id) {
                tempExerciseData.push(exercise.data())
              }
              workoutExercises = workoutData.exercises.map((id) =>{
                return tempExerciseData.find((res) => res.id === id);
              })
            })
          });
        }
      })
  
      exercises = workoutData.exercises.map((id) => {
        if(id.id){
          return tempExerciseData.find((res) => res.id === id.id);
        } else {
          return tempExerciseData.find((res) => res.id === id);
        }
      });
      
      if (exercises.length > 0) {
        workoutData = Object.assign({}, workoutData, { exercises: exercises });
        const res = await this.downloadExercise(workoutData);
        if(res) return workoutData;
        else return false
      } else {
        return false;
      }
    } else {
      const res = await this.downloadExercise(workoutData);
      return workoutData;
    }
  };

  downloadExercise = async (workout) => {
    try {
      const exercises = workout.exercises;
      let warmUpExercises = [];
      let coolDownExercises = [];
  
      if (workout.warmUpExercises) {
        let tempExerciseData = [];
        const exerciseRef = (
          await db
            .collection("WarmUpCoolDownExercises")
            .where("id", "in", workout.warmUpExercises)
            .get()
        ).docs;
  
        exerciseRef.forEach((exercise) => {
          tempExerciseData.push(exercise.data());
        });
        warmUpExercises = workout.warmUpExercises.map((id) => {
          return tempExerciseData.find((res) => res.id === id);
        });
      }
      if (workout.coolDownExercises) {
        let tempExerciseData = [];
        const exerciseRef = (
          await db
            .collection("WarmUpCoolDownExercises")
            .where("id", "in", workout.coolDownExercises)
            .get()
        ).docs;
  
        exerciseRef.forEach((exercise) => {
          tempExerciseData.push(exercise.data());
        });
        coolDownExercises = workout.coolDownExercises.map((id) => {
          return tempExerciseData.find((res) => res.id === id);
        });
      }
      return Promise.all(
        exercises.map(async (exercise, index) => {
          return new Promise(async (resolve, reject) => {
            let videoIndex = 0;
            if (workout.newWorkout)
              videoIndex = exercise.videoUrls.findIndex(
                (res) => res.model === workout.exerciseModel
              );
            if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
              const downloadResumable = FileSystem.createDownloadResumable(
                exercise.videoUrls[videoIndex !== -1 ? videoIndex : 0].url,
                `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`
              )
              await downloadResumable.downloadAsync().then(() => {
                  resolve("Downloaded");
                  this.setState(prevState => ({
                    files:!prevState.files
                  }))
                  
                })
                .catch(() => 
                    // AsyncStorage.setItem('pausedDownload', 
                    // JSON.stringify(downloadResumable.savable()))
                    resolve("Error Download")
                )
            } else {
              resolve("no video found");
            }
          });
        }),
        warmUpExercises.map(async (exercise, index) => {
          return new Promise(async (resolve, reject) => {
            let videoIndex = 0;
            if (workout.newWorkout) {
              if (exercise.videoUrls && exercise.videoUrls?.length > 0) {
                videoIndex = exercise.videoUrls.findIndex(
                  (res) => res.model === workout.exerciseModel
                );
              }
            }
            if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
             const warmUP = FileSystem.createDownloadResumable(
                exercise.videoUrls[videoIndex !== -1 ? videoIndex : 0].url,
                `${FileSystem.cacheDirectory}warmUpExercise-${index + 1}.mp4`
             )
              await warmUP.downloadAsync().then(() => {
                resolve("Downloaded");
                this.setState(prevState => ({
                  files:!prevState.files
                }))
                
              })
                .catch((err) => resolve("Download failed"));
            } else {
              resolve("no video found");
            }
          });
        }),
        coolDownExercises.map(async (exercise, index) => {
          return new Promise(async (resolve, reject) => {
            let videoIndex = 0;
            if (workout.newWorkout) {
              if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
                videoIndex = exercise.videoUrls.findIndex(
                  (res) => res.model === workout.exerciseModel
                );
              }
            }
  
            if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
              const coolDown= FileSystem.createDownloadResumable(
                exercise.videoUrls[videoIndex !== -1 ? videoIndex : 0].url,
                `${FileSystem.cacheDirectory}coolDownExercise-${index + 1}.mp4`
              )
              await coolDown.downloadAsync().then(() => {
                resolve("Downloaded");
                this.setState(prevState => ({
                  files:!prevState.files
                }))
                
              })
                .catch((err) => resolve("Download failed"));
            } else {
              resolve("no video found");
            }
          });
        })
      );
    } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong", "Workout Not Available");
      return "false";
    }
  };
  
  
  downloadExerciseWC = async (
    workout,
    exerciseIds,
    exerciseModel,
    type
  ) => {
    try {
      const tempExerciseData = [];
      let exercises = [];
      const exerciseRef = (
        await db
          .collection("WarmUpCoolDownExercises")
          .where("id", "in", exerciseIds)
          .get()
      ).docs;
      exerciseRef.forEach((exercise) => {
        tempExerciseData.push(exercise.data());
      });
      exercises = exerciseIds.map((id) => {
        return tempExerciseData.find((res) => res.id === id);
      });
     
      return Promise.all(
        exercises.map(async (exercise, index) => {
          return new Promise(async (resolve, reject) => {
            let videoIndex = 0;
            if (workout.newWorkout)
              videoIndex = exercise.videoUrls.findIndex(
                (res) => res.model === exerciseModel
              );
            if (exercise.videoUrls && exercise.videoUrls[0].url !== "") {
              const downloadResumable = FileSystem.createDownloadResumable(
                exercise.videoUrls[videoIndex].url,
                `${FileSystem.cacheDirectory}exercise-${type}-${index + 1}.mp4`,
                {},
              );
              await downloadResumable.downloadAsync()
                .then(() => {
                  resolve(exercise);
                  this.setState(prevState => ({
                    files:!prevState.files
                  }))
                })
                .catch(() => 
                  // AsyncStorage.setItem('pausedDownload', 
                  //   JSON.stringify(downloadResumable.savable())
                  resolve("Error Download")
                );
              // const downloadSnapshotJson = await AsyncStorage.getItem('pausedDownload');
              // const downloadSnapshot = JSON.parse(downloadSnapshotJson);
              // console.log(">>",downloadSnapshot);                
            }
          });
        })
      );
    } catch (err) {
      console.log(err);
      Alert.alert("Something went wrong", "Workout Not Available");
      return "false";
    }
  };
  //DOWNLOAD FUNCTION ENDS
  loadExercises = async (workoutData) => {
    this.setState({ loadingExercises: true });
    if (workoutData.newWorkout) {
      this.setState({totalToDownload:
        workoutData.exercises.length+
        workoutData.warmUpExercises.length+
        workoutData.coolDownExercises.length+
        workoutData.warmUpExercises.length+
        workoutData.coolDownExercises.length
      })
    }else{
      this.setState({totalToDownload:
        workoutData.exercises.length
      })
    }
    const workout = await this.loadExercise(workoutData);
    if(workout && workout.newWorkout){
      // console.log('Here....')
      const warmUpExercises = await this.downloadExerciseWC(workout,workout.warmUpExercises,workout.warmUpExerciseModel,'warmUp');
      if(warmUpExercises.length > 0){
        const coolDownExercises = await this.downloadExerciseWC(workout,workout.coolDownExercises,workout.coolDownExerciseModel,'coolDown');
        if(coolDownExercises.length > 0){
            const newWorkout = Object.assign({},workout,{warmUpExercises:warmUpExercises,coolDownExercises:coolDownExercises});
              this.setState({newWorkoutParams:newWorkout})
            // console.log(newWorkout)
        }else{
          this.setState({loadingExercises:false});
          Alert.alert("Alert!","Something went wrong!");
        }
      }else{
        this.setState({loadingExercises:false});
        Alert.alert("Alert!","Something went wrong!");
      }
    }
    else if(workout){
      if(this.state.totalToDownload===this.state.downloaded){
        this.goToNext(workout);
      }
    }else{
      this.setState({loadingExercises:false});
    }
  }
 async goToNext(workout){
    const fitnessLevel = await AsyncStorage.getItem('fitnessLevel', null);
    this.setState({ loadingExercises: false });
        this.props.navigation.navigate('WorkoutInfo', 
            {
              lifestyle: true,
              workout, 
              reps: workout.difficultyLevel[fitnessLevel-1].toString(),
              workoutSubCategory:workout.workoutSubCategory,
              fitnessLevel,
            }
        )
    this.setState({
      downloaded: 0,
      totalToDownload: 0,
      files: undefined,
      loadingExercises: false,
      finishdownloaded:false
    })
  }
//************************New Code*********************** */

  updateFilter = (filterIndex) => {
    // console.log(filterIndex)
    this.setState({ filterIndex });
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({ item }) => (
       <WorkoutListItem 
          url={item.thumbnail?item.thumbnail:customUrl} 
          description = {item.subTitle?item.subTitle:item.displayName}
          title = {item.displayName.toUpperCase()}
          // timeInterval = {((item.workIntervalMap[fitnessLevel-1]+item.restIntervalMap[fitnessLevel-1])*item.exercises.length*item.workoutReps)/60}
          timeInterval = {Number(item.workoutTime.toFixed(0))}
          onPress ={() => this.loadExercises(item)}
          count = {item.count}
       />
  )

  handleBack =()=>{
    this.props.navigation.navigate('WorkoutsHome')
  }

  render() {
    const {
      workouts,
      loading,
      location,
      filterIndex,
      loadingExercises
    } = this.state;
    if(!loading){
            this.filterButtons = this.selectedMainCategory.filters.map((res)=>res.displayName);
            this.filterButtons.unshift('All')
            this.filter = this.selectedMainCategory.filters.map((res)=>res.name);
            this.filter.unshift('all')
            this.workoutList = workouts.filter(res=> {
                                  return this.filter[filterIndex] === 'all' ?true:res.filters.indexOf(this.filter[filterIndex]) > -1
                                })
    }

    
    // console.log(workouts)
    return (
      <View style={globalStyle.container}>
       {!loading &&
            <>
                <BigHeadingWithBackButton isBackButton = {true} 
                      bigTitleText = {this.selectedSubCategory.displayName} 
                      onPress={this.handleBack} 
                      backButtonText="Back to workouts" 
                      isBigTitle={true}
                      isBackButton ={true}
                      customContainerStyle={{marginTop:10,marginBottom:hp('2.5%')}}
                />
                <CustomButtonGroup  
                onPress={this.updateFilter}
                selectedIndex={filterIndex}
                buttons={this.filterButtons}
                />
            </>   
          } 
         
           {
          !loading && (
            <FlatList
              // contentContainerStyle={styles.scrollView}
              ListHeaderComponent={  <Text style={WorkoutScreenStyle.description}> {this.workoutList.length ===0 ? 'No':this.workoutList.length } workouts</Text>  }
              data={this.workoutList}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={false}
              style={{height:'100%',marginStart:2}}
            />
          )
        }
        <Loader
          loading={loading}
          color={colors.red.standard}
        />
         <Loader
          progressive={true}
          loading={loadingExercises}
          downloaded={this.state.downloaded}
          totalToDownload={this.state.totalToDownload}
          color={colors.red.standard}
        />
      </View>
    );
  }
}

