import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Haptics from "expo-haptics";
import Carousel from "react-native-snap-carousel";
import FadeInView from "react-native-fade-in-view";
import moment from "moment";
import ReactTimeout from "react-timeout";
import Icon from "../../../components/Shared/Icon";
import CustomButton from "../../../components/Shared/CustomButton";
import Loader from "../../../components/Shared/Loader";
import HelperModal from "../../../components/Shared/HelperModal";
import { db } from "../../../../config/firebase";
import colors from "../../../styles/colors";
// import fonts from '../../../styles/fonts';
import Tile from "../../../components/Shared/Tile";
const { width } = Dimensions.get("window");
import globalStyle from "../../../styles/globalStyles";
import WorkoutScreenStyle from "./WorkoutScreenStyle";
import { OTHERSIMG } from "../../../library/images/others/others";

const workout = [
  {
    displayName: "Workout Focus",
    image: OTHERSIMG.WORKOUTSRESISTANCE,
  },
  {
    displayName: "Equipment",
    image: OTHERSIMG.WORKOUTSRESISTANCE,
  },
  {
    displayName: "Mascle Group",
    image: OTHERSIMG.WORKOUTSRESISTANCE,
  },
];
const workoutTypes = [
  {
    displayName: "RESISTANCE",
    resistance: true,
    image: OTHERSIMG.WORKOUTSRESISTANCE,
  },
  {
    displayName: "HIIT",
    hiit: true,
    image: OTHERSIMG.WORKOUTSHIIT,
  },
];

const workoutLocations = [
  {
    displayName: "GYM",
    image: OTHERSIMG.WORKOUTSGYM,
  },
  {
    displayName: "HOME",
    image: OTHERSIMG.WORKOUTSHOME,
  },
  {
    displayName: "OUTDOORS",
    image: OTHERSIMG.WORKOUTSOUTDOORS,
  },
];

const gymResistanceWorkouts = [
  {
    displayName: "FULL BODY",
    image: OTHERSIMG.WORKOUTSGYMFULL,
  },
  {
    displayName: "UPPER BODY",
    image: OTHERSIMG.WORKOUTSGYMUPPER,
  },
  {
    displayName: "ABS, BUTT & THIGHS",
    image: OTHERSIMG.WORKOUTSGYMABT,
  },
];

const homeResistanceWorkouts = [
  {
    displayName: "FULL BODY",
    image: OTHERSIMG.WORKOUTSHOMEFULL,
  },
  {
    displayName: "UPPER BODY",
    image: OTHERSIMG.WORKOUTSHOMEUPPER,
  },
  {
    displayName: "ABS, BUTT & THIGHS",
    image: OTHERSIMG.WORKOUTSHOMEABT,
  },
];

const outdoorsResistanceWorkouts = [
  {
    displayName: "FULL BODY",
    image: OTHERSIMG.WORKOUTSOUTDOORSFULL,
  },
  {
    displayName: "UPPER BODY",
    image: OTHERSIMG.WORKOUTSOUTDOORSUPPER,
  },
  {
    displayName: "ABS, BUTT & THIGHS",
    image: OTHERSIMG.WORKOUTSOUTDOORSABT,
  },
];

const workoutTypeImageMap = {
  0: gymResistanceWorkouts,
  1: homeResistanceWorkouts,
  2: outdoorsResistanceWorkouts,
};

const hiitStyles = [
  {
    displayName: "INTERVAL",
    image: OTHERSIMG.WORKOUTSHIITAIRDYNE,
  },
  {
    displayName: "CIRCUIT",
    image: OTHERSIMG.WORKOUTSHIITSKIPPING,
  },
];

const workoutLocationMap = {
  0: "gym",
  1: "home",
  2: "outdoors",
};

const workoutFocusMap = {
  0: "fullBody",
  1: "upperBody",
  2: "lowerBody",
};

const hiitWorkoutStyleMap = {
  0: "interval",
  1: "circuit",
};

class WorkoutsHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedWorkoutTypeIndex: 0,
      selectedWorkoutLocationIndex: 0,
      selectedResistanceFocusIndex: 0,
      selectedHiitStyleIndex: 0,
      helperModalVisible: false,
      resistanceWeeklyTarget: 3,
      hiitWeeklyTarget: 2,
      resistanceWeeklyComplete: undefined,
      hiitWeeklyComplete: undefined,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setParams({
      toggleHelperModal: this.showHelperModal,
    });
    this.fetchWeeklyTargetInfo();
    this.showHelperOnFirstOpen();
  };
  componentWillUnmount = () => {
    this.unsubscribeFromTargets();
  };
  onSnapToItemTopCarousel = (field, slideIndex) => {
    Haptics.selectionAsync();
    this.setState({
      selectedWorkoutTypeIndex: slideIndex,
      selectedHiitStyleIndex: 0,
      selectedResistanceFocusIndex: 0,
    });
  };
  onSnapToItem = (field, slideIndex) => {
    Haptics.selectionAsync();
    this.setState({ [field]: slideIndex });
  };
  showHelperOnFirstOpen = async () => {
    const helperShownOnFirstOpen = await AsyncStorage.getItem(
      "workoutHelperShownOnFirstOpen"
    );
    if (helperShownOnFirstOpen === null) {
      this.props.setTimeout(
        () => this.setState({ helperModalVisible: true }),
        500
      );
      AsyncStorage.setItem("workoutHelperShownOnFirstOpen", "true");
    }
  };
  fetchWeeklyTargetInfo = async () => {
    const uid = await AsyncStorage.getItem("uid", null);
    const userRef = db.collection("users").doc(uid);
    this.unsubscribeFromTargets = userRef.onSnapshot(async (doc) => {
      this.setState({
        resistanceWeeklyComplete: await doc.data().weeklyTargets
          .resistanceWeeklyComplete,
        hiitWeeklyComplete: await doc.data().weeklyTargets.hiitWeeklyComplete,
      });
      if (
        (await doc.data().weeklyTargets.currentWeekStartDate) !==
        moment().startOf("week").format("YYYY-MM-DD")
      ) {
        const data = {
          weeklyTargets: {
            // resistanceWeeklyComplete: 0,
            // hiitWeeklyComplete: 0,
            currentWeekStartDate: moment().startOf("week").format("YYYY-MM-DD"),
          },
        };
        await userRef.set(data, { merge: true });
      }
    });
  };
  showHelperModal = () => {
    this.setState({ helperModalVisible: true });
  };
  hideHelperModal = () => {
    this.setState({ helperModalVisible: false });
  };
  handleWorkoutSelected = (
    selectedWorkoutLocationIndex,
    selectedResistanceFocusIndex
  ) => {
    const workoutLocation = workoutLocationMap[selectedWorkoutLocationIndex];
    const workoutFocus = workoutFocusMap[selectedResistanceFocusIndex];
    this.props.navigation.navigate("WorkoutsSelection", {
      workoutFocus,
      workoutLocation,
    });
  };
  handleHiitWorkoutSelected = (
    selectedWorkoutLocationIndex,
    selectedHiitStyleIndex
  ) => {
    const workoutLocation = workoutLocationMap[selectedWorkoutLocationIndex];
    const hiitWorkoutStyle = hiitWorkoutStyleMap[selectedHiitStyleIndex];
    this.props.navigation.navigate("HiitWorkoutsSelection", {
      hiitWorkoutStyle,
      workoutLocation,
    });
  };
  goToWorkouts = (selectedWorkoutTypeIndex) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const {
      selectedWorkoutLocationIndex,
      selectedResistanceFocusIndex,
      selectedHiitStyleIndex,
    } = this.state;
    if (selectedWorkoutTypeIndex === 0) {
      this.handleWorkoutSelected(
        selectedWorkoutLocationIndex,
        selectedResistanceFocusIndex
      );
    } else {
      this.handleHiitWorkoutSelected(
        selectedWorkoutLocationIndex,
        selectedHiitStyleIndex
      );
    }
  };
  renderItem = ({ item }) => {
    const {
      resistanceWeeklyTarget,
      hiitWeeklyTarget,
      resistanceWeeklyComplete,
      hiitWeeklyComplete,
    } = this.state;
    return (
      <View style={WorkoutScreenStyle.slide}>
        <ImageBackground
          source={
            item.image ||
            OTHERSIMG.WORKOUTSBLANKTILE
          }
          style={WorkoutScreenStyle.image}
        >
          <View style={globalStyle.opacityLayer}>
            <View style={WorkoutScreenStyle.titleContainer}>
              <Text style={WorkoutScreenStyle.title}>{item.displayName}</Text>
              {item.resistance && (
                <Text style={WorkoutScreenStyle.weeklyTargetText}>
                  {resistanceWeeklyComplete !== undefined &&
                    `${resistanceWeeklyComplete}/${resistanceWeeklyTarget} sessions this week`}
                </Text>
              )}
              {item.hiit && (
                <Text style={WorkoutScreenStyle.weeklyTargetText}>
                  {hiitWeeklyComplete !== undefined &&
                    `${hiitWeeklyComplete}/${hiitWeeklyTarget} sessions this week`}
                </Text>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };
  render() {
    const {
      loading,
      selectedWorkoutLocationIndex,
      selectedWorkoutTypeIndex,
      helperModalVisible,
    } = this.state;
    return (
      <View style={globalStyle.container}>
        {/* <Tile
              title1="Breakfast"
              image={require('../../../../assets/images/nutrition-breakfast.jpg')}
              onPress={() => navigation.navigate('RecipeSelection', { meal: 'breakfast' })}
            /> */}
        <View style={globalStyle.carouselsContainer}>
          <View style={globalStyle.flexContainer}>
            <View style={globalStyle.carouselTitleContainer}>
              <Text style={globalStyle.carouselTitle}>Workout Type</Text>
            </View>
            <Carousel
              ref={(c) => {
                this.carousel = c;
              }}
              data={workoutTypes}
              renderItem={this.renderItem}
              sliderWidth={width}
              itemWidth={width * 0.8}
              onSnapToItem={(slideIndex) =>
                this.onSnapToItemTopCarousel(
                  "selectedWorkoutTypeIndex",
                  slideIndex
                )
              }
            />
          </View>
          <View style={globalStyle.flexContainer}>
            <View style={globalStyle.carouselTitleContainer}>
              <View style={globalStyle.flex}>
                <Text style={globalStyle.carouselTitle}>Location</Text>
              </View>
              <Icon
                name="chevron-down"
                size={18}
                style={globalStyle.chevron}
                color={colors.grey.standard}
              />
              <View style={globalStyle.flex} />
            </View>
            <FadeInView duration={1500} style={globalStyle.flexContainer}>
              <Carousel
                ref={(c) => {
                  this.carousel = c;
                }}
                data={workoutLocations}
                renderItem={this.renderItem}
                sliderWidth={width}
                itemWidth={width * 0.8}
                onSnapToItem={(slideIndex) =>
                  this.onSnapToItem("selectedWorkoutLocationIndex", slideIndex)
                }
              />
            </FadeInView>
          </View>
          <View style={globalStyle.flexContainer}>
            {selectedWorkoutTypeIndex === 0 ? (
              <View style={globalStyle.carouselTitleContainer}>
                <View style={globalStyle.flex}>
                  <Text style={globalStyle.carouselTitle}>Focus</Text>
                </View>
                <Icon
                  name="chevron-down"
                  size={18}
                  style={globalStyle.chevron}
                  color={colors.grey.standard}
                />
                <View style={globalStyle.flex} />
              </View>
            ) : (
              <View style={globalStyle.carouselTitleContainer}>
                <View style={globalStyle.flex}>
                  <Text style={globalStyle.carouselTitle}>HIIT Style</Text>
                </View>
                <Icon
                  name="chevron-down"
                  size={18}
                  style={globalStyle.chevron}
                  color={colors.grey.standard}
                />
                <View style={globalStyle.flex} />
              </View>
            )}
            {selectedWorkoutTypeIndex === 0 && (
              <FadeInView duration={1000} style={globalStyle.flexContainer}>
                <Carousel
                  ref={(c) => {
                    this.carousel = c;
                  }}
                  data={workoutTypeImageMap[selectedWorkoutLocationIndex]}
                  renderItem={this.renderItem}
                  sliderWidth={width}
                  itemWidth={width * 0.8}
                  onSnapToItem={(slideIndex) =>
                    this.onSnapToItem(
                      "selectedResistanceFocusIndex",
                      slideIndex
                    )
                  }
                />
              </FadeInView>
            )}
            {selectedWorkoutTypeIndex === 1 && (
              <FadeInView duration={1000} style={globalStyle.flexContainer}>
                <Carousel
                  ref={(c) => {
                    this.carousel = c;
                  }}
                  data={hiitStyles}
                  renderItem={this.renderItem}
                  sliderWidth={width}
                  itemWidth={width * 0.8}
                  onSnapToItem={(slideIndex) =>
                    this.onSnapToItem("selectedHiitStyleIndex", slideIndex)
                  }
                />
              </FadeInView>
            )}
          </View>
          <Icon
            name="chevron-down"
            size={18}
            style={globalStyle.chevron}
            color={colors.grey.standard}
          />
        </View>
        <View style={globalStyle.buttonContainer}>
          <CustomButton
            title="SHOW WORKOUTS"
            onPress={() => this.goToWorkouts(selectedWorkoutTypeIndex)}
            primary
          />
        </View>
        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={this.hideHelperModal}
          headingText="Workouts"
          bodyText="What would you like to train today?"
          bodyText2="Select your workout type, followed by the location that you would like to train at.  Finally, select what you would like to focus on today."
          bodyText3="Once you are happy with your selections, press the ‘Show workouts’ button to continue."
          color="coral"
        />
        <Loader color={colors.coral.standard} loading={loading} />
      </View>
    );
  }
}

WorkoutsHomeScreen.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};

export default ReactTimeout(WorkoutsHomeScreen);
