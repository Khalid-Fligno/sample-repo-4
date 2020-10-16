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
import ProgressBar from '../../../components/Progress/ProgressBar';
import CustomBtn from '../../../components/Shared/CustomBtn';
import calendarStyles from './calendarStyle';
import PlusCircleSvg from '../../../../assets/icons/PlusCircleSvg';

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
  "snack1"
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
                      console.log(`${FileSystem.cacheDirectory}${item}`)
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
      });
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
    console.log("<<<<<")
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

getCurrentPhase(){
  const {activeChallengeUserData,activeChallengeData} = this.state
  if(activeChallengeUserData && activeChallengeData){
    // console.log(activeChallengeUserData.phases)
    const data  = activeChallengeUserData.phases;
    data.forEach(el => {
        let currentTime = new Date().getTime();
        let startTime = new Date(el.startDate).getTime()
        let endTime = new Date(el.endDate).getTime()
        if(currentTime >= startTime && currentTime <=endTime){
          this.phase = el
        }
    });
    //TODO :fetch the current phasr data from Challenges collection
    this.phaseData = activeChallengeData.phases.filter((res)=> res.name === this.phase.name)[0];
    const stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    console.log(stringDate)
   
   //TODO :calculate the workout completed till selected date
    this.totalChallengeWorkoutsCompleted = activeChallengeUserData.workouts.filter((res)=>{
      let resTime = new Date(res.date).getTime();
      let selectedTime = new Date(stringDate).getTime()
      return resTime <= selectedTime
    })

   //TODO calculate current challenge day
    let startDate = new Date(activeChallengeUserData.startDate).getDate();
    let currentDate = new Date().getDate();
    console.log(startDate ,currentDate)
     this.currentChallengeDay = ( currentDate - startDate) +1
 
  }else{
    Alert.alert('Something went wrong please try again')
  }
  
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
    // const findLocationIcon = () => {
    //   let location;
    //   if (workout.home) {
    //     location = 'home';
    //   } else if (workout.gym) {
    //     location = 'gym';
    //   } else if (workout.outdoors) {
    //     location = 'park';
    //   }
    //   return `workouts-${location}`;
    // };
    if(activeChallengeData && activeChallengeUserData){
      this.getCurrentPhase()
    }
    
    const mealSwipable = (name,data,index)=>{
      return (
        <Swipeable
                renderRightActions={() => this.renderRightActions(name)}
                overshootRight={false}
                onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                onSwipeableClose={() => this.setState({ isSwiping: false })}
                key={index}
              >
                <ListItem
                  title={data.title.toUpperCase()}
                  subtitle={data.subtitle}
                  onPress={() => this.props.navigation.navigate('Recipe', { recipe: data })}
                  containerStyle={calendarStyles.listItemContainer}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={calendarStyles.recipeListItemTitle}
                  subtitleStyle={calendarStyles.recipeListItemSubtitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.themeColor.color} />}
                />
        </Swipeable>
      )
    }
    const mealListItem = (name,index)=>{
      return (
        <ListItem
        key={index}
        title={name}
        subtitle="Press here to see available recipes"
        onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: name.toLowerCase() })}
        containerStyle={calendarStyles.listItemContainer}
        chevronColor={colors.charcoal.standard}
        titleStyle={calendarStyles.blankListItemTitle}
        subtitleStyle={calendarStyles.blankListItemSubtitle}
        rightIcon={<PlusCircleSvg height={30} width={30} fill={colors.themeColor.color} />}
      />
      )
    }
    
  
    const ChallengeProgressCard = () =>{
      
      return(
        <View style={calendarStyles.ChallengeProgressCardContainer }>
          <Text style={calendarStyles.challengeLabel}
          >
           {activeChallengeData.displayName}{'  '} 
           <Text style={{fontFamily:fonts.standardNarrow}}>
               {this.totalChallengeWorkoutsCompleted.length}/{this.phaseData.workouts.length}
           </Text>
         </Text>

         <View style={calendarStyles.challengeProgressContainer}>
           <View style={calendarStyles.progressCircleContainer}>
              <View style={calendarStyles.sliderContainer}> 
                  <Text style={calendarStyles.sliderSideText}>0</Text>
                    <View style={calendarStyles.slider}>
                      <Slider
                        value={this.totalChallengeWorkoutsCompleted.length}
                        minimumValue={0}
                        maximumValue={this.phaseData.workouts.length}
                        trackStyle={{height:5,borderRadius:5}}
                        minimumTrackTintColor={colors.themeColor.color}
                        maximumTrackTintColor={colors.grey.medium}
                        thumbStyle={{
                          display:'none',
                          height:20, 
                          width:20,
                          borderRadius:50,
                          backgroundColor:colors.themeColor.color,
                          borderWidth:3,
                          borderColor:colors.themeColor.color
                        }}
                      />
                    </View>
                    <Text style={calendarStyles.sliderSideText}>{this.phaseData.workouts.length}</Text>
                </View>
                  
              {/* <ProgressBar 
                  title="Workouts Complete"
                  // completed={this.totalChallengeWorkoutsCompleted.length}
                  completed={4}
                  total = {this.phaseData.workouts.length}
                  total = {10}
                  customTitleStyle={{
                    marginHorizontal:20,
                    // marginBottom:hp('-1.2%'),
                    marginTop:hp('0.7%'),
                    fontFamily:fonts.GothamMedium,
                    color:colors.charcoal.light,
                    fontSize:wp('2.4%')
                  }}
                  size={wp('34%')}
                  customProgressNumberStyle={{
                    fontSize:wp('16%'),
                    fontFamily:fonts.GothamLight,
                    color:colors.charcoal.dark
                  }}
                  customProgessTotalStyle={{
                    fontSize:wp('3.5%')
                  }}
              /> */}
           </View>
           <View style={calendarStyles.phaseContainer}>
              <CustomBtn 
                Title={this.phase.displayName}
                outline={true}
                customBtnStyle={{padding:wp('1.5%'),width:'75%',borderRadius:30,width:'35%'}}
                isRightIcon={true}
                rightIconName="chevron-right"
                rightIconColor={colors.themeColor.color}
                customBtnTitleStyle={{marginRight:wp('3%'),fontFamily:fonts.boldNarrow}}
              />
              <Text style={calendarStyles.phaseBodyText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut. 
              </Text>
          </View>
         </View>
         <View style={{borderBottomColor:colors.grey.light,borderBottomWidth:2,width:'100%',marginTop:hp('2%')}}></View>
        
        </View> 
      )
    }
    const dayDisplay = (
      <ScrollView
        contentContainerStyle={calendarStyles.dayDisplayContainer}
        scrollEnabled={!this.state.isSwiping}
      >
        {
          this.phaseData && ChallengeProgressCard()
        }
        <Text style={calendarStyles.headerText}>
          Workout
        </Text>
        <View style={calendarStyles.listContainer}>
          {
            workout ? (
              <Swipeable
                renderRightActions={() => this.renderRightActions('workout')}
                overshootRight={false}
                onSwipeableWillOpen={() => this.setState({ isSwiping: true })}
                onSwipeableClose={() => this.setState({ isSwiping: false })}
              >
                <ListItem
                  title={workout.displayName}
                  subtitle={
                    workout.filters && workout.filters.includes('strength') ? (
                      <View style={calendarStyles.workoutSubtitleContainer}>
                        {/* <Icon
                          name={findLocationIcon()}
                          size={20}
                          color={colors.charcoal.standard}
                        /> */}
                        {/* <Text style={calendarStyles.workoutSubtitleText}>
                          {findLocation(workout)}
                        </Text> */}
                        <Icon
                          name={findFocusIcon(workout)}
                          size={20}
                          color={colors.charcoal.standard}
                        />
                        <Text style={calendarStyles.workoutSubtitleText}>
                          {findFocus(workout)}
                        </Text>
                        
                      </View>
                    ) : (
                      <View style={calendarStyles.workoutSubtitleContainer}>
                        <Icon
                          name="workouts-hiit"
                          size={18}
                          color={colors.charcoal.standard}
                        />
                        <Text style={calendarStyles.workoutSubtitleText}>
                          {findWorkoutType(workout)}
                        </Text>
                      </View>
                    )
                  }
                  // onPress={workout.resistance ? () => this.loadExercises(workout.id) : () => this.loadHiitExercises(workout.id)}
                  onPress={ () => this.loadExercises(workout.id) }
                  containerStyle={calendarStyles.listItemContainer}
                  chevronColor={colors.charcoal.standard}
                  titleStyle={calendarStyles.workoutListItemTitle}
                  rightIcon={<Icon name="chevron-right" size={18} color={colors.themeColor.color} />}
                />
              </Swipeable>
            ) : (
              <ListItem
                title="WORKOUT"
                subtitle={recommendedWorkoutMap[dayOfWeek]}
                onPress={() => this.props.navigation.navigate('WorkoutsHome')}
                containerStyle={calendarStyles.listItemContainer}
                chevronColor={colors.charcoal.standard}
                titleStyle={calendarStyles.blankListItemTitle}
                subtitleStyle={calendarStyles.blankListItemSubtitle}
                rightIcon={<PlusCircleSvg height={30} width={30} fill={colors.themeColor.color} />}
              />
          )
        }
        </View>
        <Text style={calendarStyles.headerText}>
          Meals
        </Text>
        <View style={calendarStyles.listContainer}>
          {
            recipeCategories.map((res,index)=>{
              const {meals} = this.state
              if(meals && meals[res])
                  return mealSwipable(res,meals[res],index)
              else 
                  return mealListItem(res.toLocaleUpperCase(),index)
            
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
        <View style={calendarStyles.calendarStripContainer}>
          <CalendarStrip
            ref={this.calendarStrip}
            maxDayComponentSize={50}
            onDateSelected={(date) => this.handleDateSelected(date)}
            daySelectionAnimation={{
              type: 'border',
              duration: 400,
              highlightColor:'transparent',
              borderWidth:2,
              borderHighlightColor:colors.themeColor.color,
            }}
            style={calendarStyles.calendarStrip}
            calendarHeaderStyle={calendarStyles.calendarStripHeader}
            calendarColor='transparent'
            dateNumberStyle={{
              fontFamily: fonts.GothamMedium,
              color: colors.charcoal.dark,
            }}
            dateNameStyle={{
              fontFamily: fonts.GothamMedium,
              color: colors.charcoal.dark,
            }}
            highlightDateNumberStyle={{
              fontFamily: fonts.GothamMedium,
              color: colors.themeColor.color,
            }}
            highlightDateNameStyle={{
              fontFamily: fonts.GothamMedium,
              color: colors.themeColor.color,
            }}
            weekendDateNameStyle={{
              fontFamily: fonts.bold,
              color: colors.grey.standard,
            }}
            weekendDateNumberStyle={{
              fontFamily: fonts.bold,
              color: colors.grey.standard,
            }}
            iconContainer={{
              flex: 0.15,
            }}
            leftSelector={<Icon name="chevron-left" size={17} color={colors.themeColor.color} />}
            rightSelector={<Icon name="chevron-right" size={17} color={colors.themeColor.color} />}
          />
        </View>
       
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
