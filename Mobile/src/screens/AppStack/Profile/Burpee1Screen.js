import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import Video from "react-native-video";
import Carousel from "react-native-carousel";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import WorkoutScreenStyle from "../Workouts/WorkoutScreenStyle";
import NutritionStyles from "../Nutrition/NutritionStyles";
import CustomBtn from "../../../components/Shared/CustomBtn";
import { containerPadding } from "../../../styles/globalStyles";
import { db } from "../../../../config/firebase";


import {
  isActiveChallenge,
} from "../../../utils/challenges";


const { width } = Dimensions.get("window");
export default class Burpee1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleCancel: this.handleCancel });

    this.fetchStrengthAssessment()
  }

  fetchStrengthAssessment = async () => {

    // Hack to trigger next layout for Loader to appear
    await new Promise(resolve => setTimeout(resolve, 0))

    this.setState({ loading: true })

    const exit = () => {
      this.setState({ loading: false })
    }

    
    const fetchStrengthAssessmentId = async () => {
      // Get active challenge, if any
      const activeChallenge = await isActiveChallenge()

      if (activeChallenge) {
        const challengeRef = await db
          .collection("challenges")
          .doc(activeChallenge.id)
          .get()
        
        const strengthAssessmentId = challengeRef.data()?.strengthAssessmentId?.trim()
        if(strengthAssessmentId?.length > 0) return strengthAssessmentId
        else return "default"

      } else {
        return "default"
      }
    }
    
    // Get Strength assessment information
    const strengthAssessmentRef = await db
      .collection("strengthAssessments")
      .doc(await fetchStrengthAssessmentId())
      .get()

    if(!strengthAssessmentRef.exists) {
      exit()
      return
    }

    const strengthAssessmentInfo = strengthAssessmentRef.data()
    const {
      video: {url, title, version}
    } = strengthAssessmentInfo

    const videoUri =`${FileSystem.cacheDirectory}${encodeURIComponent(title+version)}.mp4`
    if(await !FileSystem.getInfoAsync(videoUri).exists)  
      await FileSystem.downloadAsync(url, videoUri)
   
    // Successfully loaded assessment information
    this.setState({
      loading: false,
      strengthAssessmentInfo
    })
  }

  handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const {
      isInitial,
      navigateTo,
      updateBurpees,
      photoExist2,
    } = this.props.navigation.state.params;

    if (this.props.navigation.getParam("fromScreen")) {
      const screen = this.props.navigation.getParam("fromScreen");
      const params = this.props.navigation.getParam("screenReturnParams");
      this.props.navigation.navigate("Burpee2", {
        fromScreen: screen,
        screenReturnParams: params,
        strengthAssessmentInfo: this.state.strengthAssessmentInfo
      });
    } else if (this.props.navigation.getParam("calendarScreen")) {
      console.log("CalenderHomeScreen: ", this.props.navigation.getParam("calendarScreen"))
      const screen = this.props.navigation.getParam("calendarScreen");
      this.props.navigation.navigate("Burpee2", {
        calendarScreen: screen
      });
    } else {
      this.props.navigation.navigate("Burpee2", {
        isInitial: isInitial,
        navigateTo: navigateTo,
        updateBurpees: updateBurpees,
        photoExist2: photoExist2,
        strengthAssessmentInfo: this.state.strengthAssessmentInfo
      });
    }
  };

  handleCancel = () => {
    const {
      isInitial,
      updateBurpees,
      photoExist2,
    } = this.props.navigation.state.params;

    Alert.alert(
      "Stop burpee test?",
      "",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            if (this.props.navigation.getParam("fromScreen")) {
              this.props.navigation.navigate("CalendarHome");
            } else if (this.props.navigation.getParam("calendarScreen")) {
              const screen = this.props.navigation.getParam("calendarScreen");
              this.props.navigation.navigate(screen);
            } else {
              if (updateBurpees) {
                this.props.navigation.navigate("ProgressEdit", {
                  isInitial: isInitial,
                  photoExist2: photoExist2
                });
              } else {
                this.props.navigation.navigate("Settings")
              }
            }
          },
        },
      ],
      { cancelable: false }
    );
  };


  render() {
    const { loading, strengthAssessmentInfo } = this.state

    console.log(`Loading: ${loading}`)

    const renderMainContents = (strengthAssessmentInfo) => {

      if(!strengthAssessmentInfo) 
        return (<View style={styles.flexContainer}/>)

      const { 
        title, 
        message, 
        video: { title: videoTitle, version: videoVersion }, 
        additionalInfo: { coachingTips } 
      } = strengthAssessmentInfo

      return (
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.bodyText}>{message}</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.carouselContainer}>
              <Carousel
                width={width}
                inactiveIndicatorColor={colors.themeColor.color}
                indicatorColor={colors.themeColor.color}
                indicatorOffset={12}
                indicatorSize={13}
                inactiveIndicatorText="○"
                indicatorText="●"
                animate={false}
              >
                <View style={styles.exerciseTile}>
                  <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
                      <Text style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}>{videoTitle.toUpperCase()}</Text>
                      <Text style={WorkoutScreenStyle.exerciseTileHeaderBarRight}>MAX</Text>
                  </View>
                  <Video
                    source={{
                      uri: `${FileSystem.cacheDirectory}${encodeURIComponent(videoTitle+videoVersion)}.mp4`,
                    }}
                    resizeMode="contain"
                    repeat
                    muted
                    style={{ width: width - 80, height: width - 80 }}
                  />
                </View>
                <View style={styles.exerciseDescriptionContainer}>
                  <View style={WorkoutScreenStyle.exerciseTileHeaderBar}>
                    <View>
                      <Text style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}>ADDITIONAL INFO</Text>
                    </View>
                  </View>
                  <View style={WorkoutScreenStyle.exerciseDescriptionTextContainer}>
                    <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>
                      Coaching tip:
                    </Text>
                    {coachingTips.map((tip, index) => (
                      <View style={{ flexDirection: "row" }} key={index}>
                        <Text style={NutritionStyles.ingredientsText}> • </Text>
                        <Text style={NutritionStyles.ingredientsText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Carousel>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomBtn
              Title={
                this.props.navigation.getParam("updateBurpees") ? `Update ${title} count` : "READY!"
              }
              onPress={this.handleNext}
              outline={false}
              customBtnTitleStyle={{ fontSize: 14, fontFamily: fonts.bold }}
            />
          </View>
        </View>
      )
    }
    
    return (
      <SafeAreaView style={styles.container}>

        {!loading && renderMainContents(strengthAssessmentInfo) }
        
        {loading && ( 
          <View style={styles.flexContainer}>
              <Loader color={colors.coral.standard} loading={loading}/>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flexContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.offWhite,
  },
  textContainer: {
    flexShrink: 1,
    width,
    padding: 10,
    paddingHorizontal: containerPadding,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.darkest,
    marginBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.darkest,
  },
  contentContainer: {
    flex: 1,
    width,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseTile: {
    width: width - 80,
    height: width - 45,
    marginTop: 7.5,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.themeColor.themeBorderColor,
    overflow: "hidden",
  },

  exerciseDescriptionContainer: {
    width: width - 80,
    height: width - 45,
    marginTop: 7.5,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40,
    borderWidth: colors.themeColor.themeBorderWidth,
    borderRadius: 4,
    borderColor: colors.themeColor.themeBorderColor,
    backgroundColor: colors.white,
    overflow: "hidden",
  },

  buttonContainer: {
    flexShrink: 1,
    justifyContent: "flex-end",
    padding: 10,
    width: "100%",
    paddingHorizontal: containerPadding,
  },
  carouselContainer: {
    // width:width
    ...Platform.select({
      android: {
        height: width,
        width: width,
      },
    }),
  },
});
