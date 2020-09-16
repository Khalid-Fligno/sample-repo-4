import React from 'react';
import { StyleSheet, View, Alert, Text, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as FileSystem from 'expo-file-system';
// import moment from 'moment';
import sortBy from 'lodash.sortby';
import { db } from '../../../../config/firebase';
import { findReps } from '../../../utils/index';
import Loader from '../../../components/Shared/Loader';
import WorkoutTile from '../../../components/Workouts/WorkoutTile';
import colors from '../../../styles/colors';
import globalStyle from '../../../styles/globalStyles';
import { any } from 'prop-types';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import CustomButtonGroup from '../../../components/Shared/CustomButtonGroup';
import { ListItem, Avatar } from 'react-native-elements';
import fonts from '../../../styles/fonts';
import Icon from '../../../components/Shared/Icon';
import WorkoutListItem from '../../../components/Workouts/WorkoutListItem';
// const homeSplitImages = [
//   require('../../../../assets/images/splitImages/NINA-1.jpg'),
//   require('../../../../assets/images/splitImages/NINA-2.jpg'),
//   require('../../../../assets/images/splitImages/NINA-3.jpg'),
//   require('../../../../assets/images/splitImages/NINA-4.jpg'),
// ];

// const gymSplitImages = [
//   require('../../../../assets/images/splitImages/SHARNIE-1.jpg'),
//   require('../../../../assets/images/splitImages/SHARNIE-2.jpg'),
//   require('../../../../assets/images/splitImages/SHARNIE-3.jpg'),
//   require('../../../../assets/images/splitImages/SHARNIE-4.jpg'),
// ];

// const outdoorsSplitImages = [
//   require('../../../../assets/images/splitImages/ELLE-1.jpg'),
//   require('../../../../assets/images/splitImages/ELLE-2.jpg'),
//   require('../../../../assets/images/splitImages/ELLE-3.jpg'),
//   require('../../../../assets/images/splitImages/ELLE-4.jpg'),
// ];

// const images = {
//   gym: gymSplitImages,
//   home: homeSplitImages,
//   outdoors: outdoorsSplitImages,
// };
const workoutTypeMap = [
  'Strength',
  'Circuit',
  'Interval',
];

const equipmentMap = [
   'Full EquipmentMap',
   'Fitazfk EquipmentMap',
   'Minimum EquipmentMap',
   'No EquipmentMap'
];

const muscleGroupMap = [
  'Full Body',
  'Upper Body',
  'Lower Body',
  'Core' 
];
const workoutMainCategory=[
  {displayName:'Workout Focus',subCategory:workoutTypeMap,image: require('../../../../assets/images/workouts-resistance.jpg')},
  {displayName:'Equipment',subCategory:equipmentMap,image: require('../../../../assets/images/workouts-resistance.jpg')},
  {displayName:'Mascle Group',subCategory:muscleGroupMap,image: require('../../../../assets/images/workouts-resistance.jpg')}
]


export default class WorkoutsSelectionScreen2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workouts: [],
      loading: true,
      filterIndex: 0,
      location: props.navigation.getParam('workoutLocation', null),
    };
  }
  componentDidMount = async () => {
    this.selectedMainCategory = this.props.navigation.getParam('selectedMainCategory', null);
    this.selectedSubCategory = this.props.navigation.getParam('selectedSubCategory', null);
    console.log(this.selectedMainCategory)
    await this.fetchWorkouts();
  }
  componentWillUnmount = async () => {
    await this.unsubscribe();
  }
  fetchWorkouts = async () => {
    this.setState({ loading: true });
    this.unsubscribe = await db.collection('newWorkouts')
      .where("filters", "array-contains",this.selectedSubCategory.name)
     
      .onSnapshot(async (querySnapshot) => {
        const workouts = [];
        await querySnapshot.forEach(async (doc) => {
          await workouts.push(await doc.data());
        });
        this.setState({ workouts, loading: false });
      });
  }
  loadExercises = async (workout) => {
    this.setState({ loading: true });
    const fitnessLevel = await AsyncStorage.getItem('fitnessLevel');
    const { exercises } = workout;
    console.log(exercises)
    try {
      const exerciseVideos = [
        // `${FileSystem.cacheDirectory}exercise-hiit-1.mp4`,
        `${FileSystem.cacheDirectory}exercise-1.mp4`,
        `${FileSystem.cacheDirectory}exercise-2.mp4`,
        `${FileSystem.cacheDirectory}exercise-3.mp4`,
        `${FileSystem.cacheDirectory}exercise-4.mp4`,
        `${FileSystem.cacheDirectory}exercise-5.mp4`,
        `${FileSystem.cacheDirectory}exercise-6.mp4`,
      ];
      Promise.all(exerciseVideos.map(async (exerciseVideoURL) => {
        FileSystem.deleteAsync(exerciseVideoURL, { idempotent: true });
      }))
      await Promise.all(exercises.map(async (exercise, index) => {
        // const videoUrl = exercise.videoUrls.filter(res=>res.model === 'sharnia')
        if(exercise.videoUrls[0].url)
        await FileSystem.downloadAsync(
          // videoUrl[0].url,
          exercise.videoUrls[0].url,
          `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
        );
      }))
      this.setState({ loading: false });
      // this.props.navigation.navigate('WorkoutInfo', { workout, reps: findReps(fitnessLevel) }); //for new workout its difficulty level
      this.props.navigation.navigate('WorkoutInfo', { workout, reps: workout.difficultyLevel[fitnessLevel-1] }); //for new workout its difficulty level
    } catch (err) {
      this.setState({ loading: false });
      Alert.alert('Could not download exercise videos', 'Please check your internet connection');
    }
  }


//************************New Code*********************** */

  updateFilter = (filterIndex) => {
    console.log(filterIndex)
    this.setState({ filterIndex });
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({ item }) => (
       <WorkoutListItem 
          url={ require('../../../../assets/images/workouts-resistance.jpg')} 
          description = {item.displayName}
          title = {item.displayName}
          timeInterval = {25}
          onPress ={() => this.loadExercises(item)}
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
      filterIndex
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

    
    console.log(workouts)
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
              data={this.workoutList}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={false}
            />
          )
        }
        <Loader
          loading={loading}
          color={colors.coral.standard}
        />
      </View>
    );
  }
}


 // .where(focus, '==', true)
      // .where(location, '==', true)
      // .where(this.selectedSubCategory !== 'Strength'?this.selectedSubCategory.toLowerCase():'resistance','==',true)
      // .where('workoutRotation', '==', 2)

   // const locationImages = images[location];
    // const workoutList = sortBy(workouts, 'sortOrder').map((workout, index) => (
    //   <WorkoutTile
    //     key={workout.id}
    //     title1={workout.displayName}
    //     image={locationImages[index]}
    //     onPress={() => this.loadExercises(workout)}
    //     disabled={workout.disabled}
    //   />
    // ));