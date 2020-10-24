import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  Alert,
  TouchableOpacity,
  ColorPropType,
  Image,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { ListItem, Slider } from 'react-native-elements';
import * as FileSystem from 'expo-file-system';
import CalendarStrip from 'react-native-calendar-strip';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import firebase from 'firebase';
import ReactTimeout from 'react-timeout';
import { db } from '../../../../config/firebase';
import HelperModal from '../../../components/Shared/HelperModal';
import Loader from '../../../components/Shared/Loader';
import Icon from '../../../components/Shared/Icon';
import { findReps } from '../../../utils';
import { findFocus, findLocation, findFocusIcon, findWorkoutType } from '../../../utils/workouts';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
const { width } = Dimensions.get('window');
import { heightPercentageToDP as hp ,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import calendarStyles from './calendarStyle';
import * as Haptics from 'expo-haptics';
import { 
  getCurrentPhase, 
  getTotalChallengeWorkoutsCompleted, 
  getCurrentChallengeDay, 
  getTodayRecommendedMeal, 
  getTodayRecommendedWorkout,
  isActiveChallenge
} from '../../../utils/challenges';
import ChallengeProgressCard from '../../../components/Calendar/ChallengeProgressCard';
import {
     CustomListItem,
     MealSwipable, 
     RcMealListItem,
     WorkoutSwipable,
     RcWorkoutListItem
  } from '../../../components/Calendar/ListItem';
import CustomCalendarStrip from '../../../components/Calendar/CustomCalendarStrip';

const recommendedWorkoutMap = {
  undefined: '',
  0: 'Press here to see available workouts',
  1: 'Recommended - Strength / Full Body',
  2: 'Recommended - Circuit',
  3: 'Recommended - Strength / Upper Body',
  4: 'Recommended - Interval',
  5: 'Recommended - Strength / ABT',
  6: 'Press here to see available workouts',
};

const recipeCategories = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "snack2"
]

class CalendarHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workout: undefined,
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snack: undefined,
      snack2: undefined,
      loading: false,
      isSwiping: false,
      helperModalVisible: false,
      dayOfWeek: undefined,
      activeChallengeUserData:undefined,
      meals:undefined,
      activeChallengeData:undefined
    };
    this.calendarStrip = React.createRef();
  }

  componentDidMount = async () => {
    this.props.navigation.setParams({ toggleHelperModal: this.showHelperModal });
    await this.fetchCalendarEntries();
    await this.fetchActiveChallengeUserData();
    this.showHelperOnFirstOpen();
  }

  componentWillUnmount() {
    if (this.unsubscribeFromEntries2) {
      this.unsubscribeFromEntries2();
    }
    if(this.unsubscribeFACUD)
      this.unsubscribeFACUD()
    if(this.unsubscribeFACD)
      this.unsubscribeFACD()  
  }

  fetchCalendarEntries = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const selectedDate = this.calendarStrip.current.getSelectedDate();
    const stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    //Todo :call the function to get the data of current date
    this.handleDateSelected(selectedDate)
    
  }



  showHelperOnFirstOpen = async () => {
    const helperShownOnFirstOpen = await AsyncStorage.getItem('calendarHelperShownOnFirstOpen');
    if (helperShownOnFirstOpen === null) {
      this.props.setTimeout(() => this.setState({ helperModalVisible: true }), 1200);
      AsyncStorage.setItem('calendarHelperShownOnFirstOpen', 'true');
    }
  }

  showHelperModal = () => {
    this.setState({ helperModalVisible: true });
  }

  hideHelperModal = () => {
    this.setState({ helperModalVisible: false });
  }

  handleDateSelected = async (date) => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = date.format('YYYY-MM-DD').toString();
    this.unsubscribeFromEntries2 = await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            workout: await doc.data().workout,
            breakfast: await doc.data().breakfast,
            lunch: await doc.data().lunch,
            dinner: await doc.data().dinner,
            snack: await doc.data().snack,
            snack2: await doc.data().snack2,
            loading: false,
            dayOfWeek: date.format('d'),
            meals:await doc.data()
          });
        } else {
          this.setState({
            workout: undefined,
            breakfast: undefined,
            lunch: undefined,
            dinner: undefined,
            snack: undefined,
            snack2: undefined,
            loading: false,
            dayOfWeek: date.format('d'),
            meals:undefined
          });
        }
      });
  }

  loadExercises = async (workoutId) => {
    this.setState({ loading: true });
    db.collection('newWorkouts').doc(workoutId)
      .get()
      .then(async (doc) => {
        try{
            FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res)=>{
                Promise.all(res.map(async (item,index) => {
                    if (item.includes("exercise-")) {
                      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true }).then(()=>{
                      })
                    }
                }))
            })

            const workout = await doc.data();
            const { exercises } = workout;
            await Promise.all(exercises.map(async (exercise, index) => {
              // const videoUrl = exercise.videoUrls.filter(res=>res.model === 'sharnia')
              // console.log(exercise.videoUrls[0].url)
              if(exercise.videoUrls[0].url !== ""){
                  await FileSystem.downloadAsync(
                    exercise.videoUrls[0].url,
                    `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
                  ).then(()=>{
                    // console.log(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4` +"downloaded")
                  })
                  .catch(err=>console.log(err))
              }
            }))

            const fitnessLevel = await AsyncStorage.getItem('fitnessLevel', null);
            this.setState({ loading: false });
            this.props.navigation.navigate('WorkoutInfo', 
            {
              workout, 
              reps: workout.difficultyLevel[fitnessLevel-1].toString(),
              workoutSubCategory:workout.workoutSubCategory,
              fitnessLevel,
              extraProps:{fromCalender:true}
            }
            );
        }
        catch(err){
          console.log(err)
          this.setState({ loading: false });
          Alert.alert('Something went wrong','Workout Not Available')
        }
        
      })
     
  }
  
  deleteCalendarEntry = async (fieldToDelete) => {
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    this.unsubscribe = await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .update({
        [fieldToDelete]: firebase.firestore.FieldValue.delete(),
      })
      this.setState({ isSwiping: false })
  }

  renderRightActions = (fieldToDelete) => {
    return (
      <TouchableOpacity
        onPress={() => this.deleteCalendarEntry(fieldToDelete)}
        style={calendarStyles.deleteButton}
      >
        <Text style={calendarStyles.deleteButtonText}>
          Delete
        </Text>
      </TouchableOpacity>
    );
  }
  renderRightActionForRC = (type) => {
    const onClick =() =>{
      if(type === 'workout')
        this.props.navigation.navigate('WorkoutsHome')
      else  
      this.props.navigation.navigate('RecipeSelection', { 
        meal:type ,
        challengeMealsFilterList:this.challengeMealsFilterList
      })
    }
    return (
      <TouchableOpacity
        onPress={() => onClick()}
        style={[calendarStyles.deleteButton]}
      >
        <Text style={calendarStyles.deleteButtonText}>
          View all
        </Text>
      </TouchableOpacity>
    );
  }

 
// ToDo : for challenges
fetchActiveChallengeUserData = async () =>{
      
  try{  
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribeFACUD = await db.collection('users').doc(uid).collection('challenges')
    .where("status", "==" , "Active")
    .onSnapshot(async (querySnapshot) => {
      const list = [];
      await querySnapshot.forEach(async (doc) => {
          await list.push(await doc.data());
      });
      if(list[0]){
        this.fetchActiveChallengeData(list[0])
      }else{
        this.setState({ 
          activeChallengeUserData:undefined,
          loading:false
        });
      }
    });
  }
  catch(err){
    this.setState({ loading: false });
    console.log(err)
    Alert.alert('Fetch active challenge user data error!')
  }  

}

fetchActiveChallengeData = async (activeChallengeUserData) =>{
  try{
    this.unsubscribeFACD = await db.collection('challenges').doc(activeChallengeUserData.id)
    .onSnapshot(async (doc) => {
        if(doc.exists){
          this.setState({ 
            activeChallengeUserData,
            activeChallengeData:doc.data() ,
            loading:false
          });
        }
     
    });
  }catch(err){
    this.setState({ loading: false });
    console.log(err);
    Alert.alert('Fetch active challenge data error!')
  }

}

getCurrentPhaseInfo(){
  const {activeChallengeUserData,activeChallengeData} = this.state
  if(activeChallengeUserData && activeChallengeData){
    const data  = activeChallengeUserData.phases;
    
    //TODO :getCurrent phase data
    this.phase = getCurrentPhase(activeChallengeUserData.phases)
    //TODO :fetch the current phase data from Challenges collection
    this.phaseData = activeChallengeData.phases.filter((res)=> res.name === this.phase.name)[0];
    this.stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
   
   //TODO :calculate the workout completed till selected date
    this.totalChallengeWorkoutsCompleted = getTotalChallengeWorkoutsCompleted(activeChallengeUserData,this.stringDate)

   //TODO calculate current challenge day
    this.currentChallengeDay = getCurrentChallengeDay(activeChallengeUserData.startDate)
   //TODO getToday one recommended meal randomly  
   this.todayRecommendedMeal = getTodayRecommendedMeal(this.phaseData,activeChallengeUserData).recommendedMeal
   console.log("???",this.todayRecommendedMeal) 
   //TODO getToday one recommended meal randomly  
     this.challengeMealsFilterList = getTodayRecommendedMeal(this.phaseData,activeChallengeUserData).challengeMealsFilterList
    //TODO get recommended workout here
    this.todayRcWorkout = getTodayRecommendedWorkout(activeChallengeData.workouts,activeChallengeUserData,this.stringDate ) 
    }else{
    Alert.alert('Something went wrong please try again')
  }
}

async fetchRecipe(id,mealType){
  this.setState({loading:true})
  let recipeData =  await (await db.collection('recipes').doc(id).get()).data();
  if(recipeData){
    this.setState({loading:false})
    this.props.navigation.navigate('Recipe', { recipe: recipeData ,backTitle:'Nutrition' })
  }
}

openLink = (url) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  Linking.openURL(url);
}
 //-------**--------  



  render() {
    const {
      loading,
      workout,
      breakfast,
      lunch,
      dinner,
      snack,
      snack2,
      meals,
      helperModalVisible,
      dayOfWeek,
      activeChallengeUserData,
      activeChallengeData
    } = this.state;

    if(activeChallengeData && activeChallengeUserData){
      this.getCurrentPhaseInfo()
    }

    let showRC = false
    if(this.calendarStrip.current){
      let currentCalendarDate = new Date(this.calendarStrip.current.getSelectedDate()).getDate();
      let currentDate = new Date().getDate()
      if(currentCalendarDate === currentDate && this.todayRecommendedMeal && this.todayRecommendedMeal.length >0)
        showRC = true
    }

    if(this.todayRecommendedMeal){
      
    }

    const dayDisplay = (
      <ScrollView
        contentContainerStyle={calendarStyles.dayDisplayContainer}
        scrollEnabled={!this.state.isSwiping}
      >
        {
          this.phaseData && activeChallengeUserData && activeChallengeData &&
          <ChallengeProgressCard
            phase={this.phase}
            phaseData={this.phaseData}
            activeChallengeData={activeChallengeData}
            activeChallengeUserData = {activeChallengeUserData}
            totalChallengeWorkoutsCompleted ={this.totalChallengeWorkoutsCompleted}
            openLink={()=>this.openLink(this.phase.pdfUrl)}
          />
        }
        <Text style={calendarStyles.headerText}>
           Todays Workout
        </Text>
        <View style={calendarStyles.listContainer}>
          {
            this.todayRcWorkout  &&
            <RcWorkoutListItem 
                res={this.todayRcWorkout} 
                onPress={ () => this.todayRcWorkout.name !== 'rest'? this.loadExercises(this.todayRcWorkout.id):'' }
                onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                onSwipeableClose={() => this.setState({ isSwiping: false })}
                renderRightActions={() => this.renderRightActionForRC('workout')} 
            />
          }
          {
            workout ? ( <WorkoutSwipable 
                            workout={workout}
                            onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                            onSwipeableClose={() => this.setState({ isSwiping: false })}
                            onPress={ () => this.loadExercises(workout.id) }
                            renderRightActions={() => this.renderRightActions('workout')}
                            stringDate = {this.stringDate}
                       />
            ) : (
              !this.todayRcWorkout &&   <CustomListItem 
                key={1}
                name="WORKOUT"
                index={1} 
                onPress={() => this.props.navigation.navigate('WorkoutsHome')}
                subTitle={recommendedWorkoutMap[dayOfWeek]}
              />
          )
        }
        </View>
        <Text style={calendarStyles.headerText}>
        Todays Meals
        </Text>
        <View style={calendarStyles.listContainer}>
          {
            this.todayRecommendedMeal && this.todayRecommendedMeal.length >0 && showRC &&
            this.todayRecommendedMeal.map((res,index)=>{
              if(res){
                console.log("check karto",res.meal)
                if(meals && meals[res.meal]){
                  return(
                  <MealSwipable 
                                key={index}
                                name ={res.mealTitle} 
                                data = {meals[res.meal]} 
                                index={index} 
                                renderRightActions={() => this.renderRightActionForRC(res.meal)}
                                onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                                onSwipeableClose={() => this.setState({ isSwiping: false })}
                                onPress={() => this.props.navigation.navigate('Recipe', { recipe: meals[res.meal] ,meal:res.meal })}
                                stringDate = {this.stringDate}
                        />
                  )     
                }else if(res.id){
                  return( 
                  <RcMealListItem 
                    key={index}
                    res={res} 
                    index={index} 
                    onPress={() => this.fetchRecipe(res.id,res.mealType)} 
                    renderRightActions={() => this.renderRightActionForRC(res.meal)} 
                    onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                    onSwipeableClose={() => this.setState({ isSwiping: false })}
                  />
                  )
                }else{
                  return(
                    <CustomListItem 
                      key={index}
                      name={res.mealTitle} 
                      index={index} 
                      onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: res.meal })}
                      subTitle ="Press here to see available recipes"
                      />
                    )
                }
              }
             
            })
              
          }
          {
           !showRC &&
            recipeCategories.map((res,index)=>{
              if(meals && meals[res])
                  return <MealSwipable 
                                key={index}
                                name ={res} 
                                data = {meals[res]} 
                                index={index} 
                                renderRightActions={() => this.renderRightActions(res)}
                                onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                                onSwipeableClose={() => this.setState({ isSwiping: false })}
                                onPress={() => this.props.navigation.navigate('Recipe', { recipe: meals[res] ,meal:res })}
                                stringDate = {this.stringDate}
                        />
              else if(!this.todayRecommendedMeal || !showRC)
                  return <CustomListItem 
                            key={index}
                            name={res.toLocaleUpperCase()} 
                            index={index} 
                            onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: res.toLowerCase() })}
                            subTitle ="Press here to see available recipes"
                            />
          })
          }
      
        </View>
        {/* <View style={calendarStyles.listContainerBottom}>
          {
           meals && meals['snack2'] ?  mealSwipable('snack',snack2) :  mealListItem('snack')
          } 
        </View> */}
      </ScrollView>
    );


    return (
      <View style={[globalStyle.container,{paddingHorizontal:0}]}>
        <CustomCalendarStrip 
            ref1={this.calendarStrip}
            onDateSelected={(date) => this.handleDateSelected(date)}
        />
        {dayDisplay}
        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={this.hideHelperModal}
          headingText="Calendar"
          bodyText="Are you the type of person who likes to stay organised?  This is the perfect tool for you."
          bodyText2="
            Schedule workouts and recipes weeks in advance, so you know exactly what you’re training and what you are eating each day.
            Once you have scheduled these, you can go directly to your workout or recipe from this screen.
          "
          bodyText3={'How to add a workout or recipe:\n- Select a recipe/workout\n- On the recipe/workout screen, press ‘Add to Calendar’\n- Select the day you would like to schedule this for'}
          color="red"
        />
        <Loader
          loading={loading}
          color={colors.red.standard}
        />
      </View>
    );
  }
}

CalendarHomeScreen.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};

export default ReactTimeout(CalendarHomeScreen);
