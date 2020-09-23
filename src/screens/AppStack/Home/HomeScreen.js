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
import globalStyle from '../../../styles/globalStyles';
import RoundButton from '../../../components/Home/RoundButton';
import HomeScreenStyle from './HomeScreenStyle';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import WorkOutCard from '../../../components/Home/WorkoutCard';
import TimeSvg from '../../../../assets/icons/time';

const workoutTypeMap = {
  1: 'Resistance',
  2: 'HIIT',
  3: 'Resistance',
  4: 'HIIT',
  5: 'Resistance',
};

const workoutIconMap = {
  1: 'dumbbell',
  2: 'workouts-hiit',
  3: 'dumbbell',
  4: 'workouts-hiit',
  5: 'dumbbell',
};

const resistanceFocusMap = {
  1: 'Full Body',
  3: 'Upper Body',
  5: 'Abs, Butt & Thighs',
};

const resistanceFocusIconMap = {
  1: 'workouts-full',
  3: 'workouts-upper',
  5: 'workouts-lower',
};

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profile: undefined,
      switchWelcomeHeader: true,
      dayOfWeek: undefined,
    };
  }
  componentDidMount = () => {
    this.fetchProfile();
    this.switchWelcomeHeader();
    this.setDayOfWeek();
  }
  componentWillUnmount = () => {
    this.unsubscribe();
  }
  setDayOfWeek = async () => {
    const timezone = await Localization.timezone;
    const dayOfWeek = momentTimezone.tz(timezone).day();
    this.setState({ dayOfWeek });
  }
  switchWelcomeHeader = async () => {
    const switchWelcomeHeader = await AsyncStorage.getItem('switchWelcomeHeader');
    if (switchWelcomeHeader === null) {
      this.setState({ switchWelcomeHeader: false });
      AsyncStorage.setItem('switchWelcomeHeader', 'true');
    }
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    this.unsubscribe = userRef.onSnapshot(async (doc) => {
      this.setState({
        profile: await doc.data(),
        loading: false,
      });
      if (await doc.data().weeklyTargets.currentWeekStartDate !== moment().startOf('week').format('YYYY-MM-DD')) {
        const data = {
          weeklyTargets: {
            resistanceWeeklyComplete: 0,
            hiitWeeklyComplete: 0,
            currentWeekStartDate: moment().startOf('week').format('YYYY-MM-DD'),
          },
        };
        await userRef.set(data, { merge: true });
      }
    });
  }
  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }
  goToBurpeeTest = async () => {
    this.setState({ loading: true });
    console.log('downloading....');
    await FileSystem.downloadAsync(
      'https://firebasestorage.googleapis.com/v0/b/fitazfk-app.appspot.com/o/videos%2FBURPEES.mp4?alt=media&token=688885cb-2d70-4fc6-82a9-abc4e95daf89',
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
    );
    console.log(`downloading complete${FileSystem.cacheDirectory}`);
    this.setState({ loading: false });
    this.props.navigation.navigate('Burpee1');
  }
  render() {
    const {
      loading,
      profile,
      switchWelcomeHeader,
      dayOfWeek,
    } = this.state;
    // console.log(profile)
    const personalisedMessage = () => {
      const { resistanceWeeklyComplete, hiitWeeklyComplete } = profile.weeklyTargets;
      const totalWeeklyWorkoutsCompleted = resistanceWeeklyComplete + hiitWeeklyComplete;
      if (totalWeeklyWorkoutsCompleted === 0) {
        return 'Time to get started!';
      } else if (resistanceWeeklyComplete > 2 && hiitWeeklyComplete > 1) {
        return 'Well done!';
      }
      return 'Keep working, you\'ve got this!';
    };

    const bigHeadeingTitle = (switchWelcomeHeader ? 'Hi' : 'Hi').toString()+' ' + (profile ? profile.firstName:'').toString()
   
    let recommendedWorkout =[];

    (dayOfWeek > 0 && dayOfWeek < 6) ? recommendedWorkout.push(workoutTypeMap[dayOfWeek]): recommendedWorkout.push(' Rest Day') 
    if(dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) 
      recommendedWorkout.push(resistanceFocusMap[dayOfWeek])
      
    console.log(recommendedWorkout)
    return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={HomeScreenStyle.scrollView}
          style={[globalStyle.container]}
        >
          <View>
              {/* <View style={globalStyle.bigHeadingTitleContainer}>
                <Text style={globalStyle.bigHeadingTitleText}>
                {switchWelcomeHeader ? 'Hi' : 'Hi'}{profile && ` ${profile.firstName}`}
                </Text>
               </View> */}
             <BigHeadingWithBackButton
               bigTitleText = {bigHeadeingTitle} 
               isBackButton = {false}
               isBigTitle = {true}
               />
              {/* <Text style={HomeScreenStyle.welcomeHeaderText}>
                {switchWelcomeHeader ? 'Welcome back' : 'Hi'}{profile && `, ${profile.firstName}`}
              </Text> */}
              {/* <Text style={HomeScreenStyle.welcomeBodyText}>
                Here is your progress for the week. {profile && personalisedMessage()}
              </Text> */}

              <View style={HomeScreenStyle.roundButtonContainer}>
                <RoundButton title="NUTRITION" 
                 customBtnStyle={{borderRightWidth:0}}
                 leftIcon="fitazfk2-workout.png" 
                 rightIcon="chevron-right"
                 onPress={()=>this.props.navigation.navigate('Nutrition')}
                 />
                <RoundButton title="WORKOUT"
                 leftIcon="fitazfk2-workout.png" 
                 rightIcon="chevron-right"
                 onPress={()=>this.props.navigation.navigate('Workouts')}
                 />
              </View>
              {/* <View style={HomeScreenStyle.workoutProgressContainer}>
                <View style={HomeScreenStyle.sectionHeader}>
                  <Text style={HomeScreenStyle.bodyText}>
                    Weekly workout progress
                  </Text>
                </View> */}
              <View>
                <View style={HomeScreenStyle.sectionHeader}>
                  <Text style={[HomeScreenStyle.bodyText]}>
                    Weekly workout progress
                  </Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:"space-between",width:"100%"}}>
                    {
                      profile && (
                        <View>
                          <ProgressBar
                            progressBarType="Strength"
                            completedWorkouts={profile.weeklyTargets.strength }
                          />
                        </View>
                      )
                    }
                    {
                      profile && (
                        <View>
                          <ProgressBar
                            progressBarType="Circuit"
                            completedWorkouts={profile.weeklyTargets.circuit }
                          />
                        </View>
                      )
                    }
                </View>
                <View style={{width:'100%',flexDirection:"row",justifyContent:"center",marginTop:-30}}>
                    {
                          profile && (
                            <View>
                              <ProgressBar
                                progressBarType="Interval"
                                completedWorkouts={profile.weeklyTargets.interval}
                              />
                            </View>
                          )
                        }
                </View>
              </View>
              {/* <View style={HomeScreenStyle.workoutProgressContainer}>
                <View style={HomeScreenStyle.sectionHeader}>
                  <Text style={HomeScreenStyle.bodyText}>
                    TODAYS RECOMMENDED WORKOUT
                  </Text>
                </View>
                <View style={HomeScreenStyle.recommendedWorkoutContainer}>
                  {
                    (dayOfWeek > 0 && dayOfWeek < 6) ? (
                      <View style={HomeScreenStyle.recommendedWorkoutSection}>
                        <Icon
                          name={workoutIconMap[dayOfWeek]}
                          size={28}
                          color={colors.charcoal.light}
                        />
                        <Text style={HomeScreenStyle.recommendedWorkoutText}>
                          {workoutTypeMap[dayOfWeek]}
                        </Text>
                      </View>
                    ) : (
                      <View style={HomeScreenStyle.recommendedWorkoutSection}>
                        <Icon
                          name="calendar-tick"
                          size={28}
                          color={colors.charcoal.light}
                        />
                        <Text style={HomeScreenStyle.recommendedWorkoutText}>
                          Rest Day
                        </Text>
                      </View>
                    )
                  }
                  {
                    (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) && (
                      <View style={HomeScreenStyle.recommendedWorkoutSection}>
                        <Icon
                          name={resistanceFocusIconMap[dayOfWeek]}
                          size={28}
                          color={colors.charcoal.standard}
                        />
                        <Text style={HomeScreenStyle.recommendedWorkoutText}>
                          {resistanceFocusMap[dayOfWeek]}
                        </Text>
                      </View>
                    )
                  }
                </View>
              </View> */}
              {
                profile && profile.initialBurpeeTestCompleted === undefined && (
                  <View style={HomeScreenStyle.workoutProgressContainer}>
                    <View style={HomeScreenStyle.sectionHeader}>
                      <Text style={HomeScreenStyle.bodyText}>
                        REMINDER
                      </Text>
                    </View>
                    <View style={HomeScreenStyle.reminderContentContainer}>
                      <Icon
                        name="stopwatch"
                        size={32}
                        color={colors.charcoal.dark}
                        style={HomeScreenStyle.reminderIcon}
                      />
                      <View style={HomeScreenStyle.reminderTextContainer}>
                        <Text style={HomeScreenStyle.reminderText}>
                          Complete a burpee test to assess your current fitness level.  The results from this test will determine the intensity of your workouts!
                        </Text>
                      </View>
                    </View>
                    <Button
                      title="START BURPEE TEST"
                      buttonStyle={HomeScreenStyle.button}
                      titleStyle={HomeScreenStyle.buttonText}
                      onPress={this.goToBurpeeTest}
                    />
                  </View>
                )
              }
               <WorkOutCard
                image={require('../../../../assets/images/homeScreenTiles/todayWorkoutImage2.jpeg')}
                title="TODAY'S WORKOUT"
                recommendedWorkout ={recommendedWorkout}
                onPress={() => this.props.navigation.navigate('Calendar')}
                cardCustomStyle ={{marginTop:20}} 
              />
             {/*  <NewsFeedTile
                image={require('../../../../assets/images/homeScreenTiles/home-screen-shop-apparel-jumper.jpg')}
                title="SHOP APPAREL"
                onPress={() => this.openLink('https://fitazfk.com/collections/wear-fitazfk-apparel')}
              />
              <DoubleNewsFeedTile
                imageLeft={require('../../../../assets/images/homeScreenTiles/home-screen-blog.jpg')}
                imageRight={require('../../../../assets/images/hiit-rest-placeholder.jpg')}
                titleLeft1="BLOG"
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
              /> */}
              <Loader
                loading={loading}
                color={colors.charcoal.standard}
              />

          </View>
          
        </ScrollView>

       
    );
  }
}


