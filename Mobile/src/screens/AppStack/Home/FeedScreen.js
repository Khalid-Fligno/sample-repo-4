import React from "react";
import {
  View,
  Linking,
  ScrollView,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
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
import Carousel from "react-native-carousel-view";
import { SwiperFlatList } from 'react-native-swiper-flatlist';


import {
  getCurrentPhase,
  getCurrentChallengeDay,
  getTodayRecommendedWorkout,
  isActiveChallenge,
} from "../../../utils/challenges";
import ChallengeBlogCard from "../../../components/Home/ChallengeBlogCard";
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
const {height} = Dimensions.get("window")


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
    this.fetchProfile();
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      isActiveChallenge().then((res) => {
        if (res) {
          if (res.status === "Active") {
            this.setState({ loading: true });
            this.fetchActiveChallengeData(res);
            this.fetchBlogs();
            this.fetchProfile();
          }
        }
      });
    });
  };
  componentWillUnmount = () => {
    // this.focusListener();
    // if (this.unsubscribeFACD) this.unsubscribeFACD();
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



  fetchProfile = async () =>{
    let trainers = []
    const snapshot = await db
      .collection('trainers')
      .get();
      snapshot.forEach((doc)=>{
        trainers.unshift(doc.data())
      })
      this.setState({trainers, loading: false})
  }

  fetchBlogs = async (tag, currentDay, phaseData) => {
    // console.log(tag,currentDay)
    let data = phaseData.displayName;
    let phase = data.toLowerCase();
    const snapshot = await db
      .collection("blogs")
      .where("tags", "array-contains", phase)
      .get();
    let blogs = [];
    const cDay = currentDay === 1 ? 2 : currentDay;
    snapshot.forEach((doc) => {
      // if (doc.data().startDay <= cDay && doc.data().endDay >= cDay)
      blogs.unshift(doc.data());
    });
    this.setState({ blogs, loading: false });
    console.log(blogs);
    console.log("test")
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
      this.fetchBlogs(
        activeChallengeUserData.tag,
        this.currentChallengeDay,
        this.phaseData
      );
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
    // console.log(this.phaseData.displayName);
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
      trainers
    } = this.state;

    let array = trainers;
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
        <View style={{ marginBottom: wp("10%"), flex: 1 }}>
          <View style={{ flex: 1, alignItems: "center" ,height:wp('100%')}}>
           
                  <SwiperFlatList
                    showPagination
                    autoplay
                    autoplayLoop
                    data={trainers}
                    renderItem={({item}) => {
                      return (
                     <View style={{ flex: 1, alignItems: "center" }}>
                       <TouchableOpacity onPress={()=>
                          this.props.navigation.navigate('Trainers',{
                            name: item.name,
                            title: item.title,
                            about: item.about,
                            profile: item.profile,
                            id: item.id,
                          })
                        }>
                          <Image
                            style={{ flex: 1, height: '50%', width: wp('100%') }}
                            source={{
                              uri: item.image,
                            }}
                            resizeMode="cover"
                          />
                          </TouchableOpacity>
                          <View style={{
                            position :'absolute',
                            bottom: 40,
                            left: 50
                            }}>
                                <Text
                                style={{
                                  fontSize: wp("3.5%"),
                                  fontFamily: fonts.bold,
                                  fontWeight: "800",
                                  color: "white",
                                }}
                              >
                              {item.name}
                              </Text>
                              <Text
                            style={{
                              fontSize: wp("5.5%"),
                              fontFamily: fonts.bold,
                              fontWeight: 'bold',
                              color: "white",
                            }}
                          >
                            {item.title}
                            
                            </Text>
                          </View>
                        </View> 

                      );
                    }}
                  />
              
              {/* <View style={{ flex: 1, alignItems: "center" }}>
                <Image
                  style={{ flex: 1, height: "90%", width: "90%" }}
                  source={{
                    uri: "https://images.pexels.com/photos/6456303/pexels-photo-6456303.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260",
                  }}
                  resizeMode="cover"
                />
              </View> */}
              {/* <View style={{ flex: 1, alignItems: "center" }}>
                <Image
                  style={{ flex: 1, height: "90%", width: "90%" }}
                  source={{
                    uri: "https://images.pexels.com/photos/3912953/pexels-photo-3912953.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  }}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Image
                  style={{ flex: 1, height: "90%", width: "90%" }}
                  source={{
                    uri: "https://images.pexels.com/photos/136405/pexels-photo-136405.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                  }}
                  resizeMode="cover"
                />
              </View> */}
          </View>

          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: wp("4.5%"),
                  fontFamily: fonts.bold,
                  fontWeight: "500",
                }}
              >
                Explore
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() =>
                    this.openLink(
                      "https://facebook.com/groups/180007149128432/?source_id=204363259589572"
                    )
                  }
                >
                  <View style={{ paddingRight: 10 }}>
                    <Image
                      style={{
                        overflow: "hidden",
                        width: 90,
                        height: 90,
                        borderRadius: 100,
                      }}
                      source={
                        require("../../../../assets/images/media/community.jpeg")
                       }
                          resizeMode="cover"
                    />
                    <View style={{ marginTop: 10, paddingLeft: 10 }}>
                      <Text
                        style={{
                          fontSize: wp("3.5%"),
                          fontFamily: fonts.bold,
                          fontWeight: "100",
                        }}
                      >
                        Community
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.openLink("https://fitazfk.com/pages/clothing")
                  }
                >
                  <View style={{ paddingRight: 10 }}>
                    <Image
                      style={{
                        overflow: "hidden",
                        width: 90,
                        height: 90,
                        borderRadius: 50,
                      }}
                      source={
                        require("../../../../assets/images/media/activewear.jpeg")
                       }
                      resizeMode="cover"
                    />
                    <View style={{ marginTop: 10, paddingLeft: 10 }}>
                      <Text
                        style={{
                          fontSize: wp("3.5%"),
                          fontFamily: fonts.bold,
                          fontWeight: "100",
                        }}
                      >
                        Activewear
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    this.openLink(
                      "https://fitazfk.com/collections/best-sellers"
                    )
                  }
                >
                  <View style={{ paddingRight: 10 }}>
                    <Image
                      style={{
                        overflow: "hidden",
                        width: 90,
                        height: 90,
                        borderRadius: 50,
                      }}
                      source={
                        require("../../../../assets/images/media/equipment.jpeg")
                       }
                      resizeMode="cover"
                    />
                    <View style={{ marginTop: 10, paddingLeft: 10 }}>
                      <Text
                        style={{
                          fontSize: wp("3.5%"),
                          fontFamily: fonts.bold,
                          fontWeight: "100",
                        }}
                      >
                        Equipment
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                backgroundColor: "#333333",
                height: 550,
                marginTop: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingLeft: 15,
                  paddingTop: 15,
                  paddingRight: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: wp("4.5%"),
                    fontFamily: fonts.bold,
                    fontWeight: "800",
                    color: "white",
                  }}
                >
                  Members Blog
                </Text>
                <View style={{ flex: 1, marginTop: 0, alignItems: "flex-end",}}>
                  <TouchableOpacity onPress={()=> 
                  this.props.navigation.navigate('AllBlogs',
                  {
                    data : blogs
                  })
                  }>
                  <Text
                    style={{
                      fontSize: wp("3.5%"),
                      fontFamily: fonts.bold,
                      fontWeight: "300",
                      color: "white",
                    }}
                  >
                    View all
                  </Text>
                  </TouchableOpacity>
                  
                  <View
                    style={{
                      borderBottomColor: "#cccccc",
                      borderBottomWidth: 1,
                      width: "23%",
                      alignSelf: "flex-end",
                    }}
                  >

                  </View>
                </View>
              </View>
              <View style={{ flex: 1, alignItems: "center", }}>
                <View style={{}}>
                  <FlatList
                    horizontal
                    data={blogs}
                    style={{ flex: 1 }}
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity delayPressOut={3} onPress={()=>this.openLink(item.urlLink)}>
                        <View
                          style={{
                            marginTop: 20,
                           
                            paddingLeft: 20,
                          }}
                        >
                          <Image
                            style={{
                              overflow: "hidden",
                              width: 250,
                              height: 350,
                              borderRadius: 10,
                            }}
                            source={{
                              uri: item.coverImage,
                            }}
                            resizeMode="cover"
                          />
                          <View style={{alignItems:'flex-start',paddingTop: 40}}>
                          <Text
                              style={{
                                fontSize: wp("3.5%"),
                                fontFamily: fonts.bold,
                                fontWeight: "500",
                                color:'white'
                              }}
                            >
                              {item.title}
                            </Text>
                          </View>
                        </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.lookContainer}>
                <Text style={styles.title1}>Looking for more?</Text>
                <Text style={{ fontFamily: fonts.StyreneAWebRegular }}>
                  Start a challenge
                </Text>
              </View>

              <View>
                <CustomBtn
                  titleCapitalise={true}
                  Title="Explore workouts"
                  customBtnStyle={styles.oblongBtnStyle}
                  onPress={() => this.props.navigation.navigate("Lifestyle")}
                  // style={styles.oblongBtnStyle}
                  // isRightIcon={true}
                  // customBtnTitleStyle={{ marginHorizontal: hp('1%'), fontSize: wp("3%"), marginVertical: hp('20%') }}
                />
              </View>
            </View>
          </View>

          <Loader loading={loading} color={colors.themeColor.color} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  oblongBtnStyle: {
    alignItems: "center",
    marginTop: hp("2%"),
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: colors.white,
    color: colors.black,
    height: hp("8%"),
    marginHorizontal: hp("10%"),
  },
  lookContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("2%"),
  },
  title1: {
    fontFamily: fonts.StyreneAWebRegular,
    fontWeight: "800",
    fontSize: wp("5%"),
    color: colors.black,
  },
});
