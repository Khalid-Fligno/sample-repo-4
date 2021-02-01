import React from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as FileSystem from 'expo-file-system';
import firebase from 'firebase';
import ReactTimeout from 'react-timeout';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
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
import CustomCalendarStrip from '../../../components/Calendar/CustomCalendarStrip';
import ChallengeProgressCard2 from '../../../components/Calendar/ChallengeProgressCard2';
import ChallengeWorkoutCard from '../../../components/Calendar/ChallengeWorkoutCard';
import TodayMealsList from '../../../components/Calendar/TodayMealsList';
import Modal from "react-native-modal";
import ChallengeSetting from '../../../components/Calendar/ChallengeSetting';
import moment from 'moment';
import createUserChallengeData from '../../../components/Challenges/UserChallengeData';

// import { ListItem, Slider } from 'react-native-elements';

// import CalendarStrip from 'react-native-calendar-strip';
// import Swipeable from 'react-native-gesture-handler/Swipeable';

// import HelperModal from '../../../components/Shared/HelperModal';

// import Icon from '../../../components/Shared/Icon';
// import { findReps } from '../../../utils';
// import { findFocus, findLocation, findFocusIcon, findWorkoutType } from '../../../utils/workouts';

// import fonts from '../../../styles/fonts';

// const { width } = Dimensions.get('window');
// import { heightPercentageToDP as hp ,widthPercentageToDP as wp } from 'react-native-responsive-screen';

// import ChallengeProgressCard from '../../../components/Calendar/ChallengeProgressCard';
// import {
//      CustomListItem,
//      MealSwipable, 
//      RcMealListItem,
//      WorkoutSwipable,
//      RcWorkoutListItem
//   } from '../../../components/Calendar/ListItem';

class CalendarHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workout: undefined,
      loading: false,
      isSwiping: false,
      dayOfWeek: undefined,
      activeChallengeUserData:undefined,
      meals:undefined,
      activeChallengeData:undefined,
      todayRecommendedMeal:undefined,
      challengeMealsFilterList:undefined,
      isSettingVisible: false
    };
    this.calendarStrip = React.createRef();
  }

  toggleSetting = () => {
    this.setState({ isSettingVisible: !this.state.isSettingVisible });
  };

  componentDidMount = async () => {
    this.props.navigation.setParams({ toggleHelperModal: this.showHelperModal });
    // await this.fetchCalendarEntries();
    await this.fetchActiveChallengeUserData();
    await this.props.navigation.setParams({
      activeChallengeSetting: () => this.handleActiveChallengeSetting()
    });

  }

  handleActiveChallengeSetting(){
    this.toggleSetting()
  }

  componentWillUnmount() {
    if (this.unsubscribeFromEntries2) {
      this.unsubscribeFromEntries2();
    }
    if(this.unsubscribeFACUD)
      this.unsubscribeFACUD();
    if(this.unsubscribeFACD)
      this.unsubscribeFACD(); 
    if(this.unsubscribeSchedule)
      this.unsubscribeSchedule()   
  }

  fetchCalendarEntries = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const selectedDate = this.calendarStrip.current.getSelectedDate();
    const stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    //Todo :call the function to get the data of current date
    this.handleDateSelected(selectedDate)
    
  }

  handleDateSelected = async (date) => {
    const { activeChallengeData,activeChallengeUserData} = this.state
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = date.format('YYYY-MM-DD').toString();

    //TODO:check the active challenge cndtns
    if(activeChallengeData && activeChallengeUserData && 
      new Date(activeChallengeUserData.startDate).getTime()<= new Date(stringDate).getTime() &&
      new Date(activeChallengeUserData.endDate).getTime()>= new Date(stringDate).getTime()
       ){
      this.getCurrentPhaseInfo();
    }

    this.unsubscribeFromEntries2 = await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            workout: await doc.data().workout,
            loading: false,
            dayOfWeek: date.format('d'),
            meals:await doc.data()
          });
        } else {
          this.setState({
            workout: undefined,
            loading: false,
            dayOfWeek: date.format('d'),
            meals:undefined
          });
        }
      });
  }

  loadExercises = async (workoutId,challengeCurrentDay = 0) => {
    this.setState({ loading: true });

    FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then((res)=>{
        Promise.all(res.map(async (item,index) => {
            if (item.includes("exercise-")) {
              FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, { idempotent: true }).then(()=>{
                console.log(item,"deleted...")
              })
            }
        }))
    })
    db.collection('newWorkouts').doc(workoutId)
      .get()
      .then(async (doc) => {
        try{
            let workout = await doc.data();
            const { exercises } = workout;
            await Promise.all(exercises.map(async (exercise, index) => {
              // const videoUrl = exercise.videoUrls.filter(res=>res.model === 'sharnia')
              // console.log("???",exercise.videoUrls[0].url)
              if(exercise.videoUrls && exercise.videoUrls[0].url !== ""){
                  await FileSystem.downloadAsync(
                    exercise.videoUrls[0].url,
                    `${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`,
                  ).then(()=>{
                    console.log(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4` +"downloaded")
                  })
                  .catch(err=>console.log(err))
              }
            }))

            const fitnessLevel = await AsyncStorage.getItem('fitnessLevel', null);
            this.setState({ loading: false });
            if(challengeCurrentDay > 0){
               Object.assign(workout,{displayName:`${workout.displayName} - Day ${challengeCurrentDay}`}) 
            }
                this.props.navigation.navigate('WorkoutInfo', 
                    {
                      workout, 
                      reps: workout.difficultyLevel[fitnessLevel-1].toString(),
                      workoutSubCategory:workout.workoutSubCategory,
                      fitnessLevel,
                      extraProps:{fromCalender:true}
                    }
                )
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
        challengeMealsFilterList:this.state.challengeMealsFilterList
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
        const activeChallengeEndDate = list[0]?list[0].endDate:null;
        const currentDate = moment().format('YYYY-MM-DD');
        const isCompleted =  moment(activeChallengeEndDate).isSame(currentDate);

        if(list[0] && !isCompleted){
          this.fetchActiveChallengeData(list[0])
        }else{
          if(activeChallengeEndDate && isCompleted){  //TODO check challenge is Completed or not
            const newData = createUserChallengeData({...list[0],status:"InActive"},new Date())
            const challengeRef =db.collection('users').doc(uid).collection('challenges').doc(list[0].id)
            challengeRef.set(newData,{merge:true})
            Alert.alert('Congratulation!','You have completed your challenge')
           }

          this.setState({ 
            activeChallengeUserData:undefined,
            loading:false
          });
          this.props.navigation.navigate('ChallengeSubscription')
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
              // loading:false
            });
            setTimeout(()=>{
              // this.setState({ loading: false });
              this.getCurrentPhaseInfo();
            },500)
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
      this.setState({loading:true})
      const data  = activeChallengeUserData.phases;
      this.stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    
    //TODO :getCurrent phase data
    this.phase = getCurrentPhase(activeChallengeUserData.phases,this.stringDate)

    if(this.phase){
          //TODO :fetch the current phase data from Challenges collection
        this.phaseData = activeChallengeData.phases.filter((res)=> res.name === this.phase.name)[0];

        //TODO :calculate the workout completed till selected date
        // console.log(this.stringDate)
        this.totalChallengeWorkoutsCompleted = getTotalChallengeWorkoutsCompleted(activeChallengeUserData,this.stringDate)

        //TODO calculate current challenge day
        this.currentChallengeDay = getCurrentChallengeDay(activeChallengeUserData.startDate,this.stringDate )

        //TODO getToday one recommended meal randomly  
        getTodayRecommendedMeal(this.phaseData,activeChallengeUserData).then((res)=>{
          console.log("now display")
          this.setState({
            todayRecommendedMeal: res.recommendedMeal,
            challengeMealsFilterList: res.challengeMealsFilterList,
            loading:false
          })
        })

        // this.todayRecommendedMeal = getTodayRecommendedMeal(this.phaseData,activeChallengeUserData).recommendedMeal
        // //TODO getToday one recommended meal randomly  
        //   this.challengeMealsFilterList = getTodayRecommendedMeal(this.phaseData,activeChallengeUserData).challengeMealsFilterList
       
        //TODO get recommended workout here
        this.todayRcWorkout = getTodayRecommendedWorkout(activeChallengeData.workouts,activeChallengeUserData,this.stringDate ) 
    }
  
      }else{
      
      Alert.alert('Something went wrong please try again')
    }
  }

  async goToRecipe(recipeData){
    this.props.navigation.navigate('Recipe', { recipe: recipeData ,backTitle:'challenge dashboard',extraProps:{fromCalender:true} })
  }

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }
  //-------**--------  



  render() {
    const {
      loading,
      activeChallengeUserData,
      activeChallengeData,
      todayRecommendedMeal
    } = this.state;
    let showRC = false
    if(activeChallengeData && activeChallengeUserData){
      // if(!this.phase)
      // this.getCurrentPhaseInfo()

      if(this.calendarStrip.current){
        let currentCalendarTime = new Date(this.calendarStrip.current.getSelectedDate()).getTime()
        let challengeStartTime = new Date(activeChallengeUserData.startDate).getTime()
        let challengeEndTime = new Date(activeChallengeUserData.endDate).getTime()
        if(currentCalendarTime >= challengeStartTime && 
            currentCalendarTime <= challengeEndTime && 
            todayRecommendedMeal && todayRecommendedMeal.length >0)
          showRC = true
        else
          showRC = false  
      }
    }
    const mealsList =(
      showRC &&
      <>
        <Text style={calendarStyles.headerText}>Today's Meals</Text>
        <TodayMealsList 
          data ={todayRecommendedMeal[0]}
          onPress={(res)=>this.goToRecipe(res)}
        />
      </>  
    )

    const workoutCard =(
        this.todayRcWorkout  && showRC &&
        <>
          <Text style={calendarStyles.headerText}>Today's Workout</Text>
          <View style={calendarStyles.listContainer}>
            <ChallengeWorkoutCard 
              onPress={ () => this.todayRcWorkout.name !== 'rest'? this.loadExercises(this.todayRcWorkout.id,this.currentChallengeDay):'' }
              res={this.todayRcWorkout} 
              currentDay={this.currentChallengeDay}
              title={activeChallengeData.displayName}
            />
          </View>
        </>  
    )

    const dayDisplay = (
      <ScrollView
        contentContainerStyle={calendarStyles.dayDisplayContainer}
        scrollEnabled={!this.state.isSwiping}
        showsVerticalScrollIndicator={false}
      >
        {
          this.phaseData && showRC &&
            <ChallengeProgressCard2
              phase={this.phase}
              phaseData={this.phaseData}
              activeChallengeData={activeChallengeData}
              activeChallengeUserData = {activeChallengeUserData}
              totalChallengeWorkoutsCompleted ={this.totalChallengeWorkoutsCompleted}
              openLink={()=>this.openLink(this.phaseData.pdfUrl)}
              currentDay={this.currentChallengeDay}
            />
        }
        {
          workoutCard
        }
        {
          mealsList
        }
      </ScrollView>
    );
    
    const setting =(
      <Modal 
            isVisible={this.state.isSettingVisible}
            coverScreen={true}
            style={{ margin: 0 }}
            animationIn="fadeInLeft"
            animationOut="fadeOutLeft"
            onBackdropPress={() => this.toggleSetting()}
            // useNativeDriver={true}
      >
        <ChallengeSetting 
          onToggle={()=>this.toggleSetting()}
          activeChallengeUserData={activeChallengeUserData}
          activeChallengeData={activeChallengeData}
          navigation={this.props.navigation}
        />
      </Modal>
    )

    return (
      <View style={[globalStyle.container,{paddingHorizontal:0}]}>
        <CustomCalendarStrip 
            ref1={this.calendarStrip}
            onDateSelected={(date) => this.handleDateSelected(date)}
        />


        {
          dayDisplay
        }
      
       
         {
           setting
         }
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
