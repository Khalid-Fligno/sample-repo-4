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
// import fonts from '../../../styles/fonts';
// import Icon from '../../../components/Shared/Icon';
import WorkoutScreenStyle from './WorkoutScreenStyle';
import WorkoutListItem from '../../../components/Workouts/WorkoutListItem';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
let fitnessLevel = 1;
const customUrl = 'https://firebasestorage.googleapis.com/v0/b/quickstart-1588594831516.appspot.com/o/Photos%2Fworkout1.jpeg?alt=media&token=17a7f10f-a9bb-4bfb-a27e-4b7ac0261392';
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
    // console.log(this.selectedMainCategory,this.selectedSubCategory.name)
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
          if(!(doc.data().tags.includes("8WC")))
          await workouts.push(await doc.data());
        });
        this.setState({ workouts, loading: false });
      });
  }
  loadExercises = async (workout) => {
    this.setState({ loading: true });
     fitnessLevel = await AsyncStorage.getItem('fitnessLevel');
    const { exercises } = workout;
    try {
      FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res)=>{
        // console.log(res)
          Promise.all(res.map(async (item,index) => {
              if (item.includes("exercise-")) {
                console.log(`${FileSystem.cacheDirectory}${item}`)
                FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true }).then(()=>{
                  // console.log("deleted...",item)
                })
              }
          }))
      })
  
      await Promise.all(exercises.map(async (exercise, index) => {
        // const videoUrl = exercise.videoUrls.filter(res=>res.model === 'sharnia')
        // console.log(exercise.videoUrls[0].url)
        if(exercise.videoUrls && exercise.videoUrls[0].url !== ""){
            await FileSystem.downloadAsync(
              exercise.videoUrls[0].url,
              `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
            ).then(()=>{
              // console.log(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4` +"downloaded")
            })
            .catch(err=>console.log(err))
        }
      }))
      this.setState({ loading: false });
      // this.props.navigation.navigate('WorkoutInfo', { workout, reps: findReps(fitnessLevel) }); //for new workout its difficulty level
      this.props.navigation.navigate('WorkoutInfo', {
         workout, 
         reps: workout.difficultyLevel[fitnessLevel-1].toString(),
         workoutSubCategory:this.selectedSubCategory,
         fitnessLevel
        }); //for new workout its difficulty level
    } catch (err) {
      this.setState({ loading: false });
      console.log(err)
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
          url={item.thumbnail?item.thumbnail:customUrl} 
          description = {item.subTitle?item.subTitle:item.displayName}
          title = {item.displayName.toUpperCase()}
          timeInterval = {((item.workIntervalMap[fitnessLevel-1]+item.restIntervalMap[fitnessLevel-1])*item.exercises.length*item.workoutReps)/60}
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
          color={colors.coral.standard}
        />
      </View>
    );
  }
}

