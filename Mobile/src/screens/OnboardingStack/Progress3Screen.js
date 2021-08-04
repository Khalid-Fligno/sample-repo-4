import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as FileSystem from "expo-file-system";
import Video from "react-native-video";
import Carousel from "react-native-carousel";
import CustomButton from "../../components/Shared/CustomButton";
import Loader from "../../components/Shared/Loader";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import WorkoutScreenStyle from "../AppStack/Workouts/WorkoutScreenStyle";
import NutritionStyles from "../AppStack/Nutrition/NutritionStyles";
import CustomBtn from "../../components/Shared/CustomBtn";
import { containerPadding } from "../../styles/globalStyles";
import { db } from "../../../config/firebase";
import AsyncStorage from "@react-native-community/async-storage";
import * as ImageManipulator from "expo-image-manipulator";

const { width } = Dimensions.get("window");
const coachingTip = [
  "Land with your feet flat on the ground just outside your hands.",
  "When extending out, avoid keeping your legs dead straight.",
  "Don’t let your hips drop as you land into your push-up.",
];

export default class Progress3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
  };
  handleSkip = () => {
    if (this.props.navigation.getParam("isInitial", false)) {
      Alert.alert(
        "Warning",
        "Entering your progress information is a good way to stay accountable. Are you sure you want to skip?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Skip",
            onPress: () => this.props.navigation.navigate("Progress"),
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Warning",
        "Skipping means that you will lose any information that you have already entered.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Skip",
            onPress: () => this.props.navigation.navigate("Progress"),
          },
        ],
        { cancelable: false }
      );
    }
  };
  handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const { image, weight, waist, hip, isInitial, navigateTo } =
      this.props.navigation.state.params;
    // this.props.navigation.navigate("Progress4", {
    //   image,
    //   weight,
    //   waist,
    //   hip,
    //   isInitial,
    //   navigateTo,
    // });
    const uid = await AsyncStorage.getItem("uid");
    db.collection("users")
    .doc(uid)
    .get()
    .then(async (snapshot) => {
      const isInitial = this.props.navigation.getParam("isInitial");
      const data = snapshot.data();
      const progressInfo = isInitial
        ? data.initialProgressInfo
        : data.currentProgressInfo;
      if (progressInfo) {
        const imageURL = progressInfo.photoURL ?? null;
        if (imageURL) {
          await FileSystem.downloadAsync(
            imageURL,
            `${FileSystem.cacheDirectory}progressImage.jpeg`
          );
          const image = await ImageManipulator.manipulateAsync(
            `${FileSystem.cacheDirectory}progressImage.jpeg`,
            null,
            { base64: true }
          );
          this.props.navigation.navigate("Progress4", {
            image: image,
            weight: progressInfo.weight,
            waist: progressInfo.waist,
            hip: progressInfo.hip,
            isInitial: isInitial,
            navigateTo: "Progress",
          });
        }
      }
    })
    .catch((reason) => {
      console.log("[Progress2Screen.js fetchImage()] error: ", reason);
      Alert.alert("Error", `Error: ${reason}.`);
    });
  };
  render() {
    const { loading } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Burpee Test</Text>
            <Text style={styles.bodyText}>
              It’s time to test your fitness level - this will help us gauge the
              intensity of your workouts. Complete as many burpees as possible
              in 60 seconds.
            </Text>
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
                    <View>
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}
                      >
                        BURPEES
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderBarRight}
                      >
                        MAX
                      </Text>
                    </View>
                  </View>
                  <Video
                    source={{
                      uri: `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
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
                      <Text
                        style={WorkoutScreenStyle.exerciseTileHeaderTextLeft}
                      >
                        ADDITIONAL INFO
                      </Text>
                    </View>
                  </View>
                  <View
                    style={WorkoutScreenStyle.exerciseDescriptionTextContainer}
                  >
                    <Text style={WorkoutScreenStyle.exerciseDescriptionHeader}>
                      Coaching tip:
                    </Text>
                    {coachingTip.map((tip, index) => (
                      <View style={{ flexDirection: "row" }} key={index}>
                        <Text style={NutritionStyles.ingredientsText}> • </Text>
                        <Text style={NutritionStyles.ingredientsText}>
                          {tip}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </Carousel>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <CustomBtn
              // Title="READY!"
              Title={this.props.navigation.getParam("progressEdit") !== undefined ? "Re-take Burpee Test" : "READY!"}
              onPress={this.handleNext}
              outline={false}
              customBtnTitleStyle={{ fontSize: 14, fontFamily: fonts.bold }}
            />
            {/* <CustomButton
              title="READY!"
              onPress={this.handleNext}
              primary
            /> */}
          </View>
          <Loader color={colors.coral.standard} loading={loading} />
        </View>
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
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
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
  // exerciseTileHeaderBar: {
  //   height: 35,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   padding: 8,
  //   paddingBottom: 5,
  //   backgroundColor: colors.themeColor.themeBackgroundColor,
  // },
  // exerciseTileHeaderTextLeft: {
  //   fontFamily: fonts.standardNarrow,
  //   fontSize: 16,
  //   color: colors.white,
  // },
  // exerciseTileHeaderBarRight: {
  //   fontFamily: fonts.standardNarrow,
  //   fontSize: 16,
  //   color: colors.white,
  // },
  exerciseDescriptionContainer: {
    width: width - 80,
    height: width - 45,
    marginTop: 7.5,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.themeColor.themeBorderColor,
    backgroundColor: colors.themeColor.themeBackgroundColor,
    overflow: "hidden",
  },
  // exerciseDescriptionTextContainer: {
  //   padding: 15,
  // },
  // exerciseDescriptionHeader: {
  //   fontFamily: fonts.bold,
  //   fontSize: 14,
  //   color: colors.charcoal.standard,
  // },
  // exerciseDescriptionText: {
  //   fontFamily: fonts.standard,
  //   fontSize: 14,
  //   color: colors.charcoal.standard,
  //   marginTop: 5,
  //   marginBottom: 5,
  // },
  buttonContainer: {
    flexShrink: 1,
    justifyContent: "flex-end",
    padding: 10,
    paddingHorizontal: containerPadding,
    width: "100%",
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
