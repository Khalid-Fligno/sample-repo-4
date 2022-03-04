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
  getCurrentPhase,
  getCurrentChallengeDay,
  getTodayRecommendedWorkout,
  isActiveChallenge,
} from "../../../utils/challenges";
import FeedCard from "../../../components/Home/FeedCard";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BlogCard from "../../../components/Home/BlogCard";
import {
  EquipmentMainCategory,
  EquipmentSubCategory,
} from "../../../utils/feedUtils";
// import ChallengeWorkoutCard from '../../../components/Calendar/ChallengeWorkoutCard';
const { width } = Dimensions.get("window");

const workoutTypeMap = {
  1: "Strength",
  2: "Circuit",
  3: "Strength",
  4: "Interval",
  5: "Strength",
};

const resistanceFocusMap = {
  1: "Full Body",
  3: "Upper Body",
  5: "Abs, Butt & Thighs",
};

const Feeds = [
  {
    bgImage: require("../../../../assets/images/Feed/activewear.jpg"),
    url: "https://fitazfk.com/collections/wear-fitazfk-apparel",
    btnTitle: "Find out more",
  },
  // {
  //   bgImage:require('../../../../assets/images/Feed/facebook.jpg'),
  //   url:'https://www.facebook.com/groups/180007149128432/?source_id=204363259589572',
  //   btnTitle:'Connect with us',
  //   btnBg:colors.offWhite,
  //   btnTitleColor:'#658dc3'
  // },
  {
    bgImage: require("../../../../assets/images/Feed/equipment.jpg"),
    url: "https://fitazfk.com/collections/equipment",
    btnTitle: "Find out more",
  },
];

export default class FeedScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dayOfWeek: undefined,
      //   profile: undefined,
      activeChallengeUserData: undefined,
      activeChallengeData: undefined,
      blogs: undefined,
      loading: false,
      todayRcWorkout: undefined,
    };
  }
  componentDidMount = () => {
    this.setDayOfWeek();
    // this.fetchProfile();
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      isActiveChallenge().then((res) => {
        if (res) {
          if (res.status === "Active") {
            this.setState({ loading: true });
            this.fetchActiveChallengeData(res);
            this.fetchBlogs(res.tag, res.startDate);
          }
        }
      });
    });
  };
  componentWillUnmount = () => {
    this.focusListener();
    if (this.unsubscribeFACD) this.unsubscribeFACD();
  };

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

  fetchBlogs = async (tag, currentDay) => {
    // console.log(tag,currentDay)
    const snapshot = await db
      .collection("blogs")
      .where("tags", "array-contains", tag)
      .get();
    let blogs = [];
    const cDay = currentDay === 1 ? 2 : currentDay;
    snapshot.forEach((doc) => {
      if (doc.data().startDay <= cDay && doc.data().endDay >= cDay)
        blogs.unshift(doc.data());
    });
    this.setState({ blogs, loading: false });
  };
  fetchActiveChallengeData = async (activeChallengeUserData) => {
    try {
      this.unsubscribeFACD = await db
        .collection("challenges")
        .doc(activeChallengeUserData.id)
        .onSnapshot(async (doc) => {
          if (doc.exists) {
            this.setState({
              activeChallengeUserData,
              activeChallengeData: doc.data(),
              // loading:false
            });
            this.getCurrentPhaseInfo();
          }
        });
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
      Alert.alert("Fetch active challenge data error!");
    }
  };

  setDayOfWeek = async () => {
    const timezone = await Localization.timezone;
    const dayOfWeek = momentTimezone.tz(timezone).day();
    this.setState({ dayOfWeek });
  };

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };
  async getCurrentPhaseInfo() {
    const { activeChallengeUserData, activeChallengeData } = this.state;
    if (activeChallengeUserData && activeChallengeData) {
      this.stringDate = moment().format("YYYY-MM-DD").toString();

      //TODO :getCurrent phase data
      this.phase = getCurrentPhase(
        activeChallengeUserData.phases,
        this.stringDate
      );

      //TODO :fetch the current phase data from Challenges collection
      this.phaseData = activeChallengeData.phases.filter(
        (res) => res.name === this.phase.name
      )[0];

      //TODO calculate current challenge day
      //  console.log(this.stringDate)
      this.currentChallengeDay = getCurrentChallengeDay(
        activeChallengeUserData.startDate,
        this.stringDate
      );
      this.fetchBlogs(activeChallengeUserData.tag, this.currentChallengeDay);
      //TODO get recommended workout here
      // this.todayRcWorkout = getTodayRecommendedWorkout(activeChallengeData.workouts,activeChallengeUserData,this.stringDate )
      const todayRcWorkout = (
        await getTodayRecommendedWorkout(
          activeChallengeData.workouts,
          activeChallengeUserData,
          this.stringDate
        )
      )[0];
      this.setState({ todayRcWorkout: todayRcWorkout });
    } else {
      Alert.alert("Something went wrong please try again");
    }
  }

  goToFitazfkEquipmentWorkouts() {
    this.props.navigation.navigate("WorkoutsSelection", {
      selectedMainCategory: EquipmentMainCategory(),
      selectedSubCategory: EquipmentSubCategory(),
    });
  }

  render() {
    const {
      loading,
      dayOfWeek,
      activeChallengeData,
      activeChallengeUserData,
      blogs,
      todayRcWorkout,
    } = this.state;
    let recommendedWorkout = [];

    dayOfWeek > 0 && dayOfWeek < 6
      ? recommendedWorkout.push(workoutTypeMap[dayOfWeek])
      : recommendedWorkout.push(" Rest Day");
    if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5)
      recommendedWorkout.push(resistanceFocusMap[dayOfWeek]);

    if (activeChallengeData && activeChallengeUserData) {
      if (todayRcWorkout) {
        recommendedWorkout = [];
        recommendedWorkout.push(todayRcWorkout.displayName);
        recommendedWorkout.push(`Day ${this.currentChallengeDay}`);
      }
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={HomeScreenStyle.scrollView}
        // style={[globalStyle.container,{paddingHorizontal:0}]}
      >
        <View style={{ paddingHorizontal: containerPadding }}>
          <BigHeadingWithBackButton
            bigTitleText="FEED"
            isBackButton={false}
            isBigTitle={true}
          />
        </View>

        <View style={{ marginBottom: wp("30%") }}>
          <WorkOutCard
            image={require("../../../../assets/images/placeholder.png")}
            title="TODAY'S WORKOUT"
            recommendedWorkout={recommendedWorkout}
            onPress={() => this.props.navigation.navigate("Calendar")}
            // cardCustomStyle ={{marginTop:20}}
          />

          <FeedCard
            cardCustomStyle={{
              marginHorizontal: containerPadding,
              marginTop: wp("7%"),
            }}
            cardImageStyle={{
              borderRadius: 3,
              backgroundColor: "#658dc3",
            }}
            customTitleStyle={{
              fontSize: wp("4.5%"),
              color: colors.offWhite,
            }}
            btnTitle="Connect with us"
            customBtnStyle={{ backgroundColor: colors.themeColor.color }}
            customBtnTitleStyle={{ color: colors.black }}
            onPress={() =>
              this.openLink(
                "https://www.facebook.com/groups/180007149128432/?source_id=204363259589572"
              )
            }
            image={require("../../../../assets/images/Feed/facebook.jpg")}
          />
          {blogs && blogs.length > 0 && (
            <BlogCard
              title="BLOG"
              cardCustomStyle={{
                marginHorizontal: 0,
                marginTop: wp("7%"),
              }}
              cardImageStyle={{
                borderRadius: 0,
              }}
              data={blogs}
            />
          )}
          <FeedCard
            // title ="Workouts"
            cardCustomStyle={{
              marginHorizontal: containerPadding,
              marginTop: wp("7%"),
            }}
            cardImageStyle={{
              borderRadius: 3,
            }}
            customTitleStyle={{
              fontSize: wp("4.5%"),
            }}
            btnTitle="Find out more"
            onPress={() => this.goToFitazfkEquipmentWorkouts()}
            image={require("../../../../assets/images/Feed/workout.jpg")}
          />
          {Feeds.map((res, i) => (
            <FeedCard
              // title ="Workouts"
              key={i}
              cardCustomStyle={{
                marginHorizontal: i % 2 === 0 ? containerPadding : 0,
                marginTop: wp("7%"),
              }}
              cardImageStyle={{
                borderRadius: i % 2 === 0 ? 3 : 0,
              }}
              customTitleStyle={{
                fontSize: wp("4.5%"),
              }}
              btnTitle={res.btnTitle}
              customBtnStyle={res.btnBg ? { backgroundColor: res.btnBg } : {}}
              customBtnTitleStyle={
                res.btnTitleColor ? { color: res.btnTitleColor } : {}
              }
              onPress={() => this.openLink(res.url)}
              image={res.bgImage}
            />
          ))}

          <Loader loading={loading} color={colors.themeColor.color} />
        </View>
      </ScrollView>
    );
  }
}
