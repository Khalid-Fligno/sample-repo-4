import React from 'react';
import { StyleSheet, View, Alert, Text, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as FileSystem from 'expo-file-system';
// import moment from 'moment';
import { db } from '../../../../config/firebase';
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
      loadingExercises:false
    };
  }
  componentDidMount = async () => {
    this.selectedMainCategory = this.props.navigation.getParam('selectedMainCategory', null);
    this.selectedSubCategory = this.props.navigation.getParam('selectedSubCategory', null);
    // console.log(this.selectedMainCategory,this.selectedSubCategory.name)
    await this.fetchWorkouts();
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
  loadExercises = async (workoutData) => {
    this.setState({ loadingExercises: true });
    const workout = await loadExercise(workoutData);
    // console.log(workout)
    if(workout && workout.newWorkout){
      // console.log('Here....')
      const warmUpExercises = await downloadExerciseWC(workout,workout.warmUpExercises,workout.warmUpExerciseModel,'warmUp');
      if(warmUpExercises.length > 0){
        const coolDownExercises = await downloadExerciseWC(workout,workout.coolDownExercises,workout.coolDownExerciseModel,'coolDown');
        if(coolDownExercises.length > 0){
            const newWorkout = Object.assign({},workout,{warmUpExercises:warmUpExercises,coolDownExercises:coolDownExercises});
            this.goToNext(newWorkout);
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
      this.goToNext(workout);
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
          loading={loading || loadingExercises}
          text={loadingExercises?'Please wait we are loading workout':null}
          color={colors.coral.standard}
        />
      </View>
    );
  }
}

