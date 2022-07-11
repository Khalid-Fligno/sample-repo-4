import React, { useEffect, useState } from "react";
import {
  View,
  Linking,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import * as Haptics from "expo-haptics";
import moment from "moment";
import Loader from "../../../components/Shared/Loader";
import { db } from "../../../../config/firebase";
import colors from "../../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import HomeScreenStyle from "./HomeScreenStyleV2";
import CustomBtn from "../../../components/Shared/CustomBtn";
import fonts from "../../../styles/fonts";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import {
  isActiveChallenge,
} from "../../../utils/challenges";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
// images
import { IMAGE } from "../../../library/images";
import AsyncStorage from "@react-native-community/async-storage";

export const FeedScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(false)
  const [activeUserChallengeData, setActiveUserChallengeData] = useState([])
  const [trainerData, setTrainerData] = useState([])

  const navigateToTrainers = (item) => {
    navigation.navigate("Trainers", {
      name: item.name,
      title: item.title,
      about: item.about,
      profile: item.profile,
      id: item.id,
      coverImage: item.coverImage,
    })
  }

  const getProfileTrainers = async () => {
    const snapshot = await db.collection("trainers").get();

    if (snapshot.size > 0) {
      return snapshot.docs.map((res) => res.data())
    } else {
      return undefined
    }
  };

  const getBlogsData = async (phaseTag) => {
    const blogsRef = await db
      .collection("blogs")
      .where("tags", "array-contains", phaseTag)
      .get()

    if (blogsRef.size > 0) {
      return blogsRef.docs.map((res) => res.data());
    } else {
      return undefined;
    }
  }

  const getActiveUser = async () => {
    const uid = await AsyncStorage.getItem("uid");
    const userRef = await db
      .collection("users")
      .doc(uid)
      .get()

    if (userRef) {
      return userRef.data()
    } else {
      return undefined;
    }
  }

  const getCurrentPhase = (data, currentDate1) => {
    let phase = undefined;
    data.forEach((el) => {
      let currentDate = moment(currentDate1).format("YYYY-MM-DD");

      const isBetween = moment(currentDate).isBetween(
        el.startDate,
        el.endDate,
        undefined,
        "[]"
      );

      if (isBetween) {
        phase = el;
      } else {
        phase = el;
      }
    });

    return phase;
  };

  const getActiveUserChallengeData = async () => {
    const activeUserChallengeData = await isActiveChallenge()
    const stringDate = moment().format("YYYY-MM-DD").toString();
    const activeUserData = await getActiveUser()
    setLoading(true)

    if (!activeUserChallengeData && activeUserData) {
      setLoading(false)
      console.log('NO ACTIVE USER CHALEENGE DATA')
      const tag = activeUserData.subscriptionInfo?.blogsId

      try {
        const blogsData = await getBlogsData(tag)
        const trainerData = await getProfileTrainers()

        if (blogsData || trainerData) {
          setLoading(false)
          setActiveUserChallengeData(blogsData)
          setTrainerData(trainerData)
        } else {
          setLoading(false)
          console.log('NO DATA')
        }

      } catch {
        setLoading(false)
        console.log('Error: ', err)
      }
    }

    if (activeUserChallengeData.status === "Active") {
      console.log('ACTIVE CHALLENGE')
      const phases = activeUserChallengeData.phases
      const tag = activeUserChallengeData?.tag
      //TODO :getCurrent phase data
      const currentPhase = getCurrentPhase(
        phases,
        stringDate
      );
      let data = currentPhase.displayName;
      let phase = data.toLowerCase();
      let phaseTag = phase.concat("-", tag);

      try {
        const blogsData = await getBlogsData(phaseTag)
        const trainerData = await getProfileTrainers()

        if (blogsData || trainerData) {
          setLoading(false)
          setActiveUserChallengeData(blogsData)
          setTrainerData(trainerData)
        } else {
          setLoading(false)
          console.log('NO DATA')
        }
      } catch (err) {
        setLoading(false)
        console.log('Error: ', err)
      }
    }
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getActiveUserChallengeData()
    }
    return () => {
      isMounted = false;
    }
  }, [])

  const openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };

  const urls = {
    facebook: "https://facebook.com/groups/180007149128432/?source_id=204363259589572",
    fitazfkPages: "https://fitazfk.com/pages/clothing",
    fitazfkCollection: "https://fitazfk.com/collections/best-sellers"
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={HomeScreenStyle.scrollView}
    >
      <View style={{ marginBottom: wp("10%"), flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center", height: wp("100%") }}>
          <SwiperFlatList
            paginationStyleItem={styles.bars}
            showPagination
            autoplay={true}
            autoplayDelay={6}
            autoplayLoop={true}
            autoplayLoopKeepAnimation={true}
            data={trainerData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View style={{ flex: 1, alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => navigateToTrainers(item)}
                  >
                    <Image
                      style={{ flex: 1, height: "50%", width: wp("100%") }}
                      source={{
                        uri: item.image,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 40,
                      left: 50,
                    }}
                  >
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
                        fontWeight: "bold",
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
                onPress={() => openLink(urls.facebook)}
              >
                <View style={{ paddingRight: 10 }}>
                  <Image
                    style={{
                      overflow: "hidden",
                      width: 90,
                      height: 90,
                      borderRadius: 100,
                    }}
                    source={IMAGE.FEED_COMMUNITY}
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
                onPress={() => openLink(urls.fitazfkPages)}
              >
                <View style={{ paddingRight: 10 }}>
                  <Image
                    style={{
                      overflow: "hidden",
                      width: 90,
                      height: 90,
                      borderRadius: 50,
                    }}
                    source={IMAGE.FEED_ACTIVEWEAR}
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
                onPress={() => openLink(urls.fitazfkCollection)}
              >
                <View style={{ paddingRight: 10 }}>
                  <Image
                    style={{
                      overflow: "hidden",
                      width: 90,
                      height: 90,
                      borderRadius: 50,
                    }}
                    source={IMAGE.FEED_EQUIPMENT}
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
              <View style={{ flex: 1, marginTop: 0, alignItems: "flex-end" }}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("AllBlogs", {
                      data: activeUserChallengeData,
                    })
                  }
                >
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
                ></View>
              </View>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <View style={{}}>
                <FlatList
                  horizontal
                  data={activeUserChallengeData}
                  style={{ flex: 1 }}
                  keyExtractor={(item) => item.title}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity
                        delayPressOut={3}
                        onPress={() => openLink(item.urlLink)}
                      >
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
                          <View
                            style={{
                              alignItems: "flex-start",
                              paddingTop: 40,
                              width: 250,
                            }}
                          >
                            <Text
                              ellipsizeMode="tail"
                              numberOfLines={2}
                              style={{
                                fontSize: wp("3.5%"),
                                fontFamily: fonts.bold,
                                fontWeight: "500",
                                color: "white",
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
                Start a workout
              </Text>
            </View>
            <View>
              <CustomBtn
                titleCapitalise={true}
                Title="Explore workouts"
                customBtnStyle={styles.oblongBtnStyle}
                onPress={() => navigation.navigate("Workouts")}
              />
            </View>
          </View>
        </View>
        <Loader loading={loading} color={colors.themeColor.color} />
      </View>
    </ScrollView>
  )
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
  bars: {
    borderRadius: 0,
    width: wp("8%"),
    height: 5,
    right: wp("10%"),
    bottom: hp("1%"),
    top: wp("2%"),
  },
});