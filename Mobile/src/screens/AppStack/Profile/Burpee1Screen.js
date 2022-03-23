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

const { width } = Dimensions.get("window");

const coachingTip = [
  "Land with your feet flat on the ground just outside your hands.",
  "When extending out, avoid keeping your legs dead straight.",
  "Don’t let your hips drop as you land into your push-up.",
];

export default class Burpee1Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleCancel: this.handleCancel });
  }

  handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const {
      isInitial,
      navigateTo,
      updateBurpees
    } = this.props.navigation.state.params;

    if (this.props.navigation.getParam("fromScreen")) {
      const screen = this.props.navigation.getParam("fromScreen");
      const params = this.props.navigation.getParam("screenReturnParams");
      this.props.navigation.navigate("Burpee2", {
        fromScreen: screen,
        screenReturnParams: params,
      });
      return;
    }

    this.props.navigation.navigate("Burpee2", {
      isInitial: isInitial,
      navigateTo: navigateTo,
      updateBurpees: updateBurpees,
    });
  };

  handleCancel = () => {
    const {
      isInitial,
      updateBurpees
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
              const screen = this.props.navigation.getParam("fromScreen");
              const params =
                this.props.navigation.getParam("screenReturnParams");
              this.props.navigation.navigate(screen, params);
              return;
            }

            if (updateBurpees) {
              this.props.navigation.navigate("ProgressEdit", {
                isInitial: isInitial
              });
            } else {
              this.props.navigation.navigate("Settings")
            }
          },
        },
      ],
      { cancelable: false }
    );
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
              Title={
                this.props.navigation.getParam("updateBurpees") ?
                this.props.navigation.getParam("isInitial") ?
                    "Re-take Burpee Test" :
                    "Update Burpee count"
                  :
                  "READY!"
              }
              onPress={this.handleNext}
              outline={false}
              customBtnTitleStyle={{ fontSize: 14, fontFamily: fonts.bold }}
            />
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
