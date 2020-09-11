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

const workouts = [
  {
    title:'Better butt 2.0',
    description:'Intermediate - basic equipment - endurence',
    url:require('../../../../assets/images/workouts-home-abt.jpg'),
    time:25,
    type:'full body'
  },
  {
    title:'Better butt 3.0',
    description:'Intermediate - basic equipment - endurence',
    url:require('../../../../assets/images/workouts-hiit-skipping.jpg'),
    time:24,
    type:'upper body'
  },
  {
    title:'Better butt 4.0',
    description:'Intermediate - basic equipment - endurence',
    url:require('../../../../assets/images/workouts-gym-upper.jpg'),
    time:25,
    type:'core'
  },
  {
    title:'Better butt 5.0',
    description:'Intermediate - basic equipment - endurence',
    url:require('../../../../assets/images/workouts-outdoors-upper.jpg'),
    time:25,
    type:'full body '
  },
  {
    title:'Better butt 2.0',
    description:'Intermediate - basic equipment - endurence',
    url:require('../../../../assets/images/workouts-home-abt.jpg'),
    time:25,
    type:'full body'
  },
  {
    title:'Better butt 3.0',
    description:'Intermediate - basic equipment - endurence',
    url:require('../../../../assets/images/workouts-hiit-skipping.jpg'),
    time:24,
    type:'upper body'
  },
  {
    title:'Better butt 4.0',
    description:'Intermediate - basic equipment - endurence',
    url:require('../../../../assets/images/workouts-gym-upper.jpg'),
    time:25,
    type:'core'
  },
  {
    title:'Better butt 5.0',
    description:'Intermediate - basic equipment - endurence',
    url:require('../../../../assets/images/workouts-outdoors-upper.jpg'),
    time:25,
    type:'full body '
  }
  
]

export default class WorkoutsSelectionScreen2 extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workouts: workouts,
      loading: true,
      filterIndex: 0,
      location: props.navigation.getParam('workoutLocation', null),
    };
  }
  // componentDidMount = async () => {
  //   await this.fetchWorkouts();
  // }
  // componentWillUnmount = async () => {
  //   // await this.unsubscribe();
  // }
  // fetchWorkouts = async () => {
  //   this.setState({ loading: true });
  //   const focus = this.props.navigation.getParam('workoutFocus', null);
  //   const location = this.props.navigation.getParam('workoutLocation', null);
  //   this.unsubscribe = await db.collection('workouts')
  //     .where(focus, '==', true)
  //     .where(location, '==', true)
  //     .where('workoutRotation', '==', 2)
  //     .onSnapshot(async (querySnapshot) => {
  //       const workouts = [];
  //       await querySnapshot.forEach(async (doc) => {
  //         await workouts.push(await doc.data());
  //       });
  //       this.setState({ workouts, loading: false });
  //     });
  // }
  // loadExercises = async (workout) => {
  //   this.setState({ loading: true });
  //   const fitnessLevel = await AsyncStorage.getItem('fitnessLevel');
  //   const { exercises } = workout;
  //   try {
  //     const exerciseVideos = [
  //       `${FileSystem.cacheDirectory}exercise-hiit-1.mp4`,
  //       `${FileSystem.cacheDirectory}exercise-hiit-circuit-1.mp4`,
  //       `${FileSystem.cacheDirectory}exercise-hiit-circuit-2.mp4`,
  //       `${FileSystem.cacheDirectory}exercise-hiit-circuit-3.mp4`,
  //       `${FileSystem.cacheDirectory}exercise-hiit-circuit-4.mp4`,
  //       `${FileSystem.cacheDirectory}exercise-hiit-circuit-5.mp4`,
  //       `${FileSystem.cacheDirectory}exercise-hiit-circuit-6.mp4`,
  //     ];
  //     Promise.all(exerciseVideos.map(async (exerciseVideoURL) => {
  //       FileSystem.deleteAsync(exerciseVideoURL, { idempotent: true });
  //     }));
  //     await Promise.all(exercises.map(async (exercise, index) => {
  //       await FileSystem.downloadAsync(
  //         exercise.videoURL,
  //         `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
  //       );
  //     }));
  //     this.setState({ loading: false });
  //     this.props.navigation.navigate('WorkoutInfo', { workout, reps: findReps(fitnessLevel) });
  //   } catch (err) {
  //     this.setState({ loading: false });
  //     Alert.alert('Could not download exercise videos', 'Please check your internet connection');
  //   }
  // }


//************************New Code*********************** */
componentDidMount = async () => {
  this.selectedMainCategoryIndex = this.props.navigation.getParam('selectedMainCategoryIndex', null);
  this.selectedSubCategoryIndex = this.props.navigation.getParam('selectedSubCategoryIndex', null);
  console.log(this.workoutIndex,this.subTitleIndex)
  this.setState({ loading: false });
}


  updateFilter = (filterIndex) => {
    console.log(filterIndex)
    this.setState({ filterIndex });
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({ item }) => (
       <WorkoutListItem item={item}  />
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
    const filterButtons = ['All', 'Full Body', 'Upper Body', 'Core'];
     
    const workoutList = workouts.filter(res=> {
                              console.log(res.type)
                              if(res.type  === filterButtons[filterIndex].toLowerCase()){
                                  return res
                              }
                              return res
                            })

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
    
    console.log(filterButtons[filterIndex].toLowerCase(),workoutList)
    return (
      <View style={globalStyle.container}>
       {!loading && <BigHeadingWithBackButton isBackButton = {true} 
            bigTitleText = {workoutMainCategory[this.selectedMainCategoryIndex]['subCategory'][this.selectedSubCategoryIndex]} 
            onPress={this.handleBack} 
            backButtonText="Back to workouts" 
            isBigTitle={true}
            isBackButton ={true}
          />} 
          <CustomButtonGroup  
            onPress={this.updateFilter}
            selectedIndex={filterIndex}
            buttons={filterButtons}
          />
           {
          !loading && (
            <FlatList
              // contentContainerStyle={styles.scrollView}
              data={workoutList}
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


