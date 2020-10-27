import React from 'react';
import {
  View,
  Linking,
  ScrollView,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import * as Localization from 'expo-localization';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import DoubleNewsFeedTile from '../../../components/Home/DoubleNewsFeedTile';
import Loader from '../../../components/Shared/Loader';
import ProgressBar from '../../../components/Progress/ProgressBar';
import { db } from '../../../../config/firebase';
import Icon from '../../../components/Shared/Icon';
// import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
import RoundButton from '../../../components/Home/RoundButton';
import HomeScreenStyle from './HomeScreenStyle';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import WorkOutCard from '../../../components/Home/WorkoutCard';
import TimeSvg from '../../../../assets/icons/time';
import CustomBtn from '../../../components/Shared/CustomBtn';
import fonts from '../../../styles/fonts';
import { 
  getCurrentPhase, 
  getTotalChallengeWorkoutsCompleted, 
  getCurrentChallengeDay, 
  getTodayRecommendedMeal, 
  getTodayRecommendedWorkout,
  isActiveChallenge
} from '../../../utils/challenges';
import ChallengeBlogCard from '../../../components/Home/ChallengeBlogCard';
const { width } = Dimensions.get('window');


const workoutTypeMap = {
  1: 'Strength',
  2: 'Circuit',
  3: 'Strength',
  4: 'Interval',
  5: 'Strength',
};

const resistanceFocusMap = {
  1: 'Full Body',
  3: 'Upper Body',
  5: 'Abs, Butt & Thighs',
};

export default class FeedScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dayOfWeek: undefined,
    //   profile: undefined,
      activeChallengeUserData:undefined,
      activeChallengeData:undefined,
      blogs:undefined,
      loading:false
    };
  }
  componentDidMount = () => {
    this.setDayOfWeek();
    // this.fetchProfile();
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      isActiveChallenge().then((res)=>{
        if(res){
          if(this.state.blogs === undefined){
            this.setState({loading:true})
            this.fetchActiveChallengeData(res);
          }
        
        }
      })
    })

  }
  componentWillUnmount = () => {
    // this.unsubscribe();
    if(this.unsubscribeFACD)
      this.unsubscribeFACD()  
    this.focusListener.remove()  
  }


//   fetchProfile = async () => {
//     this.setState({ loading: true });
//     const uid = await AsyncStorage.getItem('uid');
//     const userRef = db.collection('users').doc(uid);
//     this.unsubscribe = userRef.onSnapshot(async (doc) => {
//       this.setState({
//         profile: await doc.data(),
//         loading: false,
//       });
//     });
//   }

fetchBlogs = async (tag,currentDay) => {
  console.log(tag,currentDay)
  const snapshot = await db.collection('blogs')
  .where("tags","array-contains",tag)
  .get()
    let blogs = []
    const cDay = currentDay === 1?2:currentDay
    snapshot.forEach(doc => {
      console.log(doc.data())
      if(doc.data().startDay <= cDay && doc.data().endDay >= cDay)
      blogs.unshift(doc.data())
    });
    this.setState({blogs,loading:false})
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
          this.getCurrentPhaseInfo()
        }
     
    });
  }catch(err){
    this.setState({ loading: false });
    console.log(err);
    Alert.alert('Fetch active challenge data error!')
  }

}

  setDayOfWeek = async () => {
    const timezone = await Localization.timezone;
    const dayOfWeek = momentTimezone.tz(timezone).day();
    this.setState({ dayOfWeek });
  }

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }
  getCurrentPhaseInfo(){
    const {activeChallengeUserData,activeChallengeData} = this.state
    if(activeChallengeUserData && activeChallengeData){
       this.stringDate = new Date().toISOString()
     
      //TODO :getCurrent phase data
      this.phase = getCurrentPhase(activeChallengeUserData.phases,this.stringDate)
     
      //TODO :fetch the current phase data from Challenges collection
      this.phaseData = activeChallengeData.phases.filter((res)=> res.name === this.phase.name)[0];
       
     //TODO calculate current challenge day
      this.currentChallengeDay = getCurrentChallengeDay(activeChallengeUserData.startDate,this.stringDate )
      this.fetchBlogs(activeChallengeUserData.tag,this.currentChallengeDay)
      //TODO get recommended workout here
      this.todayRcWorkout = getTodayRecommendedWorkout(activeChallengeData.workouts,activeChallengeUserData,this.stringDate ) 
      
    }else{
      Alert.alert('Something went wrong please try again')
    }
  }

  render() {
    const {
      loading,
      dayOfWeek,
      activeChallengeData,
      activeChallengeUserData,
      blogs
    } = this.state;
    let recommendedWorkout =[];

    (dayOfWeek > 0 && dayOfWeek < 6) ? recommendedWorkout.push(workoutTypeMap[dayOfWeek]): recommendedWorkout.push(' Rest Day') 
    if(dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) 
      recommendedWorkout.push(resistanceFocusMap[dayOfWeek])

      if(activeChallengeData && activeChallengeUserData){
      
        if(this.todayRcWorkout){
          recommendedWorkout = []
          recommendedWorkout.push(`${this.todayRcWorkout.displayName} - Day ${this.currentChallengeDay}`)
        }
      }
 
    return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={HomeScreenStyle.scrollView}
          style={[globalStyle.container]}
        >
          <View style={{marginBottom:20}}>
              <WorkOutCard
                image={require('../../../../assets/images/homeScreenTiles/todayWorkoutImage2.jpeg')}
                title="TODAY'S WORKOUT"
                recommendedWorkout ={recommendedWorkout}
                onPress={() => this.props.navigation.navigate('Calendar')}
                cardCustomStyle ={{marginTop:20}} 
              />
              {/* {
                blogs && blogs.length > 0&&
                blogs.map((res,index)=>
                    <ChallengeBlogCard
                    key={index}
                    data={res}
                    onPress={() => this.openLink(res.urlLink)}
                    index = {index}
                  />
                )
               
              } */}
             
              <NewsFeedTile
                image={require('../../../../assets/images/homeScreenTiles/home-screen-shop-apparel-jumper.jpg')}
                title="SHOP APPAREL"
                onPress={() => this.openLink('https://fitazfk.com/collections/wear-fitazfk-apparel')}
              />
              <DoubleNewsFeedTile
                imageLeft={require('../../../../assets/images/homeScreenTiles/home-screen-blog.jpg')}
                imageRight={require('../../../../assets/images/hiit-rest-placeholder.jpg')}
                titleLeft1="HOW TO USE THIS APP"
                titleRight1="FAQ"
                onPressLeft={() => this.props.navigation.navigate('HomeBlog')}
                onPressRight={() => this.openLink('https://fitazfk.zendesk.com/hc/en-us')}
              />
              <NewsFeedTile
                image={require('../../../../assets/images/shop-bundles.jpg')}
                title="SHOP EQUIPMENT"
                onPress={() => this.openLink('https://fitazfk.com/collections/equipment')}
              />
              <NewsFeedTile
                image={require('../../../../assets/images/fitazfk-army.jpg')}
                title="JOIN THE FITAZFK ARMY"
                onPress={() => this.openLink('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
              />
              {/* <Loader
                loading={loading}
                color={colors.charcoal.standard}
              /> */}
               <Loader
                  loading={loading}
                  color={colors.themeColor.color}
                />
          </View>
          
        </ScrollView>

       
    );
  }
}


