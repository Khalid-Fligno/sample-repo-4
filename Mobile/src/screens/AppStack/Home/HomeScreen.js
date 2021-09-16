import React from "react";
import {
  View,
  Linking,
  ScrollView,
  Text,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { Button } from "react-native-elements";
import * as Haptics from "expo-haptics";
import * as Localization from "expo-localization";
import * as FileSystem from "expo-file-system";
import moment from "moment";
import momentTimezone from "moment-timezone";
import NewsFeedTile from "../../../components/Home/NewsFeedTile";
import DoubleNewsFeedTile from "../../../components/Home/DoubleNewsFeedTile";
import Loader from "../../../components/Shared/Loader";
import ProgressBar from "../../../components/Progress/ProgressBar";
import { db } from "../../../../config/firebase";
import Icon from "../../../components/Shared/Icon";
// import fonts from '../../../styles/fonts';
import colors from "../../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import globalStyle, { containerPadding } from "../../../styles/globalStyles";
import RoundButton from "../../../components/Home/RoundButton";
import HomeScreenStyle from "./HomeScreenStyle";
import BigHeadingWithBackButton from "../../../components/Shared/BigHeadingWithBackButton";
import WorkOutCard from "../../../components/Home/WorkoutCard";
import TimeSvg from "../../../../assets/icons/time";
import CustomBtn from "../../../components/Shared/CustomBtn";
import fonts from "../../../styles/fonts";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import StopWatch from "../../../components/Workouts/WorkoutStopwatch";
const { width } = Dimensions.get("window");
// const workoutTypeMap = {
//   1: 'Resistance',
//   2: 'HIIT',
//   3: 'Resistance',
//   4: 'HIIT',
//   5: 'Resistance',
// };

// const workoutIconMap = {
//   1: 'dumbbell',
//   2: 'workouts-hiit',
//   3: 'dumbbell',
//   4: 'workouts-hiit',
//   5: 'dumbbell',
// };

// const resistanceFocusMap = {
//   1: 'Full Body',
//   3: 'Upper Body',
//   5: 'Abs, Butt & Thighs',
// };

// const resistanceFocusIconMap = {
//   1: 'workouts-full',
//   3: 'workouts-upper',
//   5: 'workouts-lower',
// };

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profile: undefined,
      switchWelcomeHeader: true,
      dayOfWeek: undefined,
      activeChallengeUserData: undefined,
      activeChallengeData: undefined,
      totalInterval: undefined,
      totalCircuit: undefined,
      totalStrength: undefined,
      totalIntervalCompleted: undefined,
      totalCircuitCompleted: undefined,
      totalStrengthCompleted: undefined,
      totalI: 0,
      totalS: 0,
      totalC: 0,
      countI: 0,
      countS: 0,
      countC: 0,
    };
  }

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener("didFocus", () => {
      this.onFocus();
    });
  };

  onFocus = () => {
    this.fetchProfile();
    this.switchWelcomeHeader();
    this.setDayOfWeek();
    this.updateScheduleChallengeToActive();
    this.fetchActiveChallengeUserData();
  };

  componentWillUnmount = () => {
    this.unsubscribe();
    if (this.unsubscribeFACUD) this.unsubscribeFACUD();
    if (this.unsubscribeFACD) this.unsubscribeFACD();
    if (this.unsubscribeSche) this.unsubscribeSche();
  };
  setDayOfWeek = async () => {
    const timezone = await Localization.timezone;
    const dayOfWeek = momentTimezone.tz(timezone).day();
    this.setState({ dayOfWeek });
  };
  switchWelcomeHeader = async () => {
    const switchWelcomeHeader = await AsyncStorage.getItem(
      "switchWelcomeHeader"
    );
    if (switchWelcomeHeader === null) {
      this.setState({ switchWelcomeHeader: false });
      AsyncStorage.setItem("switchWelcomeHeader", "true");
    }
  };
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db.collection("users").doc(uid);
    this.unsubscribe = userRef.onSnapshot(async (doc) => {
      this.setState({
        profile: doc.data(),
      });
      console.log(
        "Start of week: ",
        moment().startOf("week").format("YYYY-MM-DD")
      );
      if (doc.data().weeklyTargets == null) {
        const data = {
          weeklyTargets: {
            resistanceWeeklyComplete: 0,
            hiitWeeklyComplete: 0,
            strength: 0,
            interval: 0,
            circuit: 0,
            currentWeekStartDate: moment().startOf("week").format("YYYY-MM-DD"),
          },
        };
        await userRef.set(data, { merge: true });
      }
      if (
        (await doc.data().weeklyTargets.currentWeekStartDate) !==
        moment().startOf("week").format("YYYY-MM-DD")
      ) {
        const data = {
          weeklyTargets: {
            // resistanceWeeklyComplete: 0,
            // hiitWeeklyComplete: 0,
            // strength: 0,
            // interval: 0,
            // circuit: 0,
            currentWeekStartDate: moment().startOf("week").format("YYYY-MM-DD"),
          },
        };
        await userRef.set(data, { merge: true });
      }
      if ((await doc.data().weeklyTargets["strength"]) == null) {
        // if Weekly targets not available
        const data = {
          weeklyTargets: {
            strength: 0,
            circuit: 0,
            interval: 0,
          },
          totalWorkoutCompleted: 0,
        };
        await userRef.set(data, { merge: true });
      }
    });
  };
  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };
  goToBurpeeTest = async () => {
    this.setState({ loading: true });
    // console.log('downloading....');
    await FileSystem.downloadAsync(
      "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE%20(2).mp4?alt=media&token=9ae1ae37-6aea-4858-a2e2-1c917007803f",
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`
    );
    // console.log(`downloading complete${FileSystem.cacheDirectory}`);
    this.setState({ loading: false });
    this.props.navigation.navigate("Burpee1");
  };
  /** check and update user challenge is schedule */
  updateScheduleChallengeToActive = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    this.unsubscribeSche = await db
      .collection("users")
      .doc(uid)
      .collection("challenges")
      .where("isSchedule", "==", true)
      .onSnapshot(async (querySnapshot) => {
        const list = [];
        await querySnapshot.forEach(async (doc) => {
          await list.push(await doc.data());
        });

        const challengeStarTime = list[0]
          ? new Date(list[0].startDate).getTime()
          : null;
        const todayDate = moment(new Date()).format("YYYY-MM-DD");
        const currentTime = new Date(todayDate).getTime();
        if (challengeStarTime <= currentTime && list[0]) {
          const challengeRef = db
            .collection("users")
            .doc(uid)
            .collection("challenges")
            .doc(list[0].id);
          challengeRef.set(
            { status: "Active", isSchedule: false },
            { merge: true }
          );
        }
      });
  };
  /** end  */
  // ToDo : for challenges
  fetchActiveChallengeUserData = async () => {
    try {
      this.setState({ loading: true });
      const uid = await AsyncStorage.getItem("uid");

      this.unsubscribeFACUD = await db
        .collection("users")
        .doc(uid)
        .collection("challenges")
        .where("status", "==", "Active")
        .onSnapshot(async (querySnapshot) => {
          const list = [];
          await querySnapshot.forEach(async (doc) => {
            await list.push(await doc.data());
          });
          //TODO:get Active challenge end tim
          if (list[0]) {
            //TODO:check challenge is active and not completed
            this.fetchActiveChallengeData(list[0]);
          } else {
            this.setState({ totalS: 5 });
            this.setState({ totalI: 5 });
            this.setState({ totalC: 5 });

            this.setState({
              countI:
                this.state.profile.weeklyTargets === undefined
                  ? 0
                  : this.state.profile.weeklyTargets.interval,
            });
            this.setState({
              countC:
                this.state.profile.weeklyTargets === undefined
                  ? 0
                  : this.state.profile.weeklyTargets.circuit,
            });
            this.setState({
              countS:
                this.state.profile.weeklyTargets === undefined
                  ? 0
                  : this.state.profile.weeklyTargets.strength,
            });
            this.setState({
              activeChallengeUserData: undefined,
              loading: false,
            });
          }
        });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
      Alert.alert("Fetch active challenge user data error!");
    }
  };

  fetchActiveChallengeData = async (activeChallengeUserData) => {
    try {
      this.unsubscribeFACD = await db
        .collection("challenges")
        .doc(activeChallengeUserData.id)
        .onSnapshot(async (doc) => {
          if (doc.exists) {
            const activeChallengeData = doc.data();
            //TODO calculate total interval circuit strength completed user during challenge
            const totalWorkouts = [];
            activeChallengeData.workouts.forEach((workout) => {
              totalWorkouts.push(workout);
            });

            let totalInterval = totalWorkouts.filter(
              (res) => res.target === "interval"
            );
            const totalCircuit = totalWorkouts.filter(
              (res) => res.target === "circuit"
            );
            const totalStrength = totalWorkouts.filter(
              (res) => res.target === "strength"
            );

            const totalIntervalCompleted =
              activeChallengeUserData.workouts.filter(
                (res) => res.target === "interval"
              );
            const totalCircuitCompleted =
              activeChallengeUserData.workouts.filter(
                (res) => res.target === "circuit"
              );
            const totalStrengthCompleted =
              activeChallengeUserData.workouts.filter(
                (res) => res.target === "strength"
              );

            console.log('asdfasdfasdf', totalIntervalCompleted.length, totalCircuitCompleted.length, totalStrengthCompleted.length)  

            this.fetchHomeScreenData(
              activeChallengeUserData,
              totalInterval,
              totalCircuit,
              totalStrength,
              totalIntervalCompleted,
              totalCircuitCompleted,
              totalStrengthCompleted
            );

            this.setState({
              activeChallengeUserData,
              activeChallengeData,
              totalInterval,
              totalCircuit,
              totalStrength,
              totalIntervalCompleted,
              totalCircuitCompleted,
              totalStrengthCompleted,
              loading: false,
            });
          }
        });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
      Alert.alert("Fetch active challenge data error!");
    }
  };

  fetchHomeScreenData = async (
    activeChallengeUserData,
    totalInterval,
    totalCircuit,
    totalStrength,
    totalIntervalCompleted,
    totalCircuitCompleted,
    totalStrengthCompleted
  ) => {
    if (activeChallengeUserData.workouts.length !== 0) {
      let tempTotalI = 0;
      let tempTotalC = 0;
      let tempTotalS = 0;
      totalInterval.forEach((res) => {
        tempTotalI += res.days.length;
        this.setState({ totalI: tempTotalI });
      });
      totalCircuit.forEach((res) => {
        tempTotalC += res.days.length;
        this.setState({ totalC: tempTotalC });
      });
      totalStrength.forEach((res) => {
        tempTotalS += res.days.length;
        this.setState({ totalS: tempTotalS });
      });

      this.setState({ countI: this.state.profile.weeklyTargets.interval });
      this.setState({ countC: this.state.profile.weeklyTargets.circuit });
      this.setState({ countS: this.state.profile.weeklyTargets.strength });
    } else {
      this.setState({ totalS: 5 });
      this.setState({ totalI: 5 });
      this.setState({ totalC: 5 });

      this.setState({ countI: this.state.profile.weeklyTargets.interval });
      this.setState({ countC: this.state.profile.weeklyTargets.circuit });
      this.setState({ countS: this.state.profile.weeklyTargets.strength });
    }
  };
  //-------**--------

  render() {
    const {
      loading,
      profile,
      switchWelcomeHeader,
      dayOfWeek,
      activeChallengeData,
      activeChallengeUserData,
      totalInterval,
      totalCircuit,
      totalStrength,
      totalIntervalCompleted,
      totalCircuitCompleted,
      totalStrengthCompleted,
      countI,
      countC,
      countS,
      totalI,
      totalC,
      totalS,
    } = this.state;
    // let totalI = 0;
    // let totalC = 0;
    // let totalS = 0;
    // let countI = 0;
    // let countC = 0;
    // let countS = 0;
    // if (activeChallengeData.workouts !== undefined) {
    //   totalI = 0;
    //   totalInterval.forEach((res) => (totalI += res.days.length));
    //   totalC = 0;
    //   totalCircuit.forEach((res) => (totalC += res.days.length));
    //   totalS = 0;
    //   totalStrength.forEach((res) => (totalS += res.days.length));

    //   countI = totalIntervalCompleted.length;
    //   countC = totalCircuitCompleted.length;
    //   countS = totalStrengthCompleted.length;
    // } else if (profile) {
    //   totalI = 5;
    //   totalC = 5;
    //   totalS = 5;

    //   countI = profile.weeklyTargets.interval;
    //   countC = profile.weeklyTargets.circuit;
    //   countS = profile.weeklyTargets.strength;
    // }

    const personalisedMessage = () => {
      const { resistanceWeeklyComplete, hiitWeeklyComplete } =
        profile.weeklyTargets;
      const totalWeeklyWorkoutsCompleted =
        resistanceWeeklyComplete + hiitWeeklyComplete;
      if (totalWeeklyWorkoutsCompleted === 0) {
        return "Time to get started!";
      } else if (resistanceWeeklyComplete > 2 && hiitWeeklyComplete > 1) {
        return "Well done!";
      }
      return "Keep working, you've got this!";
    };

    const bigHeadeingTitle =
      (switchWelcomeHeader ? "HI" : "HI").toString().toUpperCase() +
      " " +
      (profile && profile.firstName ? profile.firstName : "")
        .toString()
        .toUpperCase();

    // let recommendedWorkout =[];

    // (dayOfWeek > 0 && dayOfWeek < 6) ? recommendedWorkout.push(workoutTypeMap[dayOfWeek]): recommendedWorkout.push(' Rest Day')
    // if(dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5)
    //   recommendedWorkout.push(resistanceFocusMap[dayOfWeek])

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
            bigTitleText={bigHeadeingTitle}
            isBackButton={false}
            isBigTitle={true}
            customContainerStyle={{ marginVertical: hp("2%") }}
          />
          {/* <Text style={HomeScreenStyle.welcomeHeaderText}>
                {switchWelcomeHeader ? 'Welcome back' : 'Hi'}{profile && `, ${profile.firstName}`}
              </Text> */}
          {/* <Text style={HomeScreenStyle.welcomeBodyText}>
                Here is your progress for the week. {profile && personalisedMessage()}
              </Text> */}

          <View style={HomeScreenStyle.roundButtonContainer}>
            <RoundButton
              title="NUTRITION"
              //  customBtnStyle={{borderRightWidth:0}}
              leftIcon="fitazfk2-workout.png"
              rightIcon="chevron-right"
              onPress={() => this.props.navigation.navigate("Nutrition")}
            />
            <RoundButton
              title="WORKOUT"
              leftIcon="fitazfk2-workout.png"
              rightIcon="chevron-right"
              onPress={() => this.props.navigation.navigate("Workouts")}
            />
          </View>

          {!loading && (
            <View>
              <View style={HomeScreenStyle.sectionHeader}>
                <Text style={[HomeScreenStyle.bodyText]}>
                  {/*{activeChallengeData !== undefined*/}
                  {/*  ? "Active challenge progress"*/}
                  {/*  : "Weekly workout progress"}*/}
                  Total workout completed
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  // justifyContent: "space-between",
                  width: "100%",
                  justifyContent: "center"
                }}
              >
                {profile && (
                  <View>
                    <ProgressBar
                      // title="Circuit"
                      completed={profile.totalWorkoutCompleted}
                      total={totalC}
                      size={wp("38%")}
                    />
                  </View>
                )}

                {/*{profile && (*/}
                {/*  <View>*/}
                {/*    <ProgressBar*/}
                {/*      title="Strength"*/}
                {/*      completed={countS}*/}
                {/*      total={totalS}*/}
                {/*      size={wp("38%")}*/}
                {/*    />*/}
                {/*  </View>*/}
                {/*)}*/}
                {/*{profile && (*/}
                {/*  <View>*/}
                {/*    <ProgressBar*/}
                {/*      title="Circuit"*/}
                {/*      completed={countC}*/}
                {/*      total={totalC}*/}
                {/*      size={wp("38%")}*/}
                {/*    />*/}
                {/*  </View>*/}
                {/*)}*/}
              </View>
              {/*<View*/}
              {/*  style={{*/}
              {/*    width: "100%",*/}
              {/*    flexDirection: "row",*/}
              {/*    justifyContent: "center",*/}
              {/*    marginTop: -30,*/}
              {/*  }}*/}
              {/*>*/}
              {/*  {profile && (*/}
              {/*    <View>*/}
              {/*      <ProgressBar*/}
              {/*        title="Interval"*/}
              {/*        completed={countI}*/}
              {/*        total={totalI}*/}
              {/*        size={wp("38%")}*/}
              {/*      />*/}
              {/*    </View>*/}
              {/*  )}*/}
              {/*</View>*/}
            </View>
          )}

          {profile && profile.initialBurpeeTestCompleted === undefined && (
            <View style={HomeScreenStyle.workoutProgressContainer}>
              <View style={HomeScreenStyle.sectionHeader}>
                <Text style={HomeScreenStyle.bodyText}>REMINDER</Text>
              </View>
              <View style={HomeScreenStyle.reminderContentContainer}>
                <Icon
                  name="stopwatch"
                  size={32}
                  color={colors.charcoal.dark}
                  style={HomeScreenStyle.reminderIcon}
                />
                {/* <TimeSvg /> */}
                <View style={HomeScreenStyle.reminderTextContainer}>
                  <Text style={HomeScreenStyle.reminderText}>
                    Complete a burpee test to assess your current fitness level.
                    The results from this test will determine the intensity of
                    your workouts!
                  </Text>
                </View>
              </View>
              <View style={{ width: "100%" }}>
                <CustomBtn
                  Title="START BURPEE TEST"
                  customBtnStyle={{
                    backgroundColor: colors.black,
                  }}
                  customBtnTitleStyle={{
                    fontFamily: fonts.SimplonMonoMedium,
                    color: colors.white,
                    fontSize: 15,
                  }}
                  titleCapitalise={true}
                  onPress={this.goToBurpeeTest}
                />
              </View>
            </View>
          )}
          {/* <WorkOutCard
                image={require('../../../../assets/images/homeScreenTiles/todayWorkoutImage2.jpeg')}
                title="TODAY'S WORKOUT"
                recommendedWorkout ={recommendedWorkout}
                onPress={() => this.props.navigation.navigate('Calendar')}
                cardCustomStyle ={{marginTop:20}} 
              /> */}

          <Loader loading={loading} color={colors.charcoal.standard} />
        </View>
      </ScrollView>
    );
  }
}
