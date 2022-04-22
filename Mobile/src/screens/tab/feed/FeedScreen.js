import React, { useEffect } from "react";
import {
  View,
  Linking,
  ScrollView,
  Text,
  Image,
  FlatList,
} from "react-native";
import * as Haptics from "expo-haptics";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomBtn from "../../../components/Shared/CustomBtn";
import fonts from "../../../styles/fonts";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useCounter } from "../../../library/useCustomHook/tab/feed/feedHook";
import { feedStyle } from "../../../styles/tab/feed/feedStyle";
import { FEEDIMG } from "../../../library/images/feed/feed";

export const FeedScreen = ({ navigation }) => {

  const {
    loading,
    activeUserChallengeData,
    trainerData,
    navigateToTrainers,
    getActiveUserChallengeData
  } = useCounter();

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
      contentContainerStyle={feedStyle.scrollView}
    >
      <View style={{ marginBottom: wp("10%"), flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center", height: wp("100%") }}>
          <SwiperFlatList
            paginationStyleItem={feedStyle.bars}
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
                    source={FEEDIMG.COMMUNITY}
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
                    source={FEEDIMG.ACTIVEWEAR}
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
                    source={FEEDIMG.EQUIPMENT}
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
            <View style={feedStyle.lookContainer}>
              <Text style={feedStyle.title1}>Looking for more?</Text>
              <Text style={{ fontFamily: fonts.StyreneAWebRegular }}>
                Start a workout
              </Text>
            </View>
            <View>
              <CustomBtn
                titleCapitalise={true}
                Title="Explore workouts"
                customBtnStyle={feedStyle.oblongBtnStyle}
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