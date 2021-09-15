import React from "react";
import PropTypes from "prop-types";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";
import FastImage from "react-native-fast-image";
import ReactTimeout from "react-timeout";
import { db } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import ProgressBar from "../../../components/Progress/ProgressBar";
import Icon from "../../../components/Shared/Icon";
import HelperModal from "../../../components/Shared/HelperModal";
import CustomButton from "../../../components/Shared/CustomButton";
import ImageModal from "../../../components/Progress/ImageModal";
import { diff } from "../../../utils/index";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CustomBtn from "../../../components/Shared/CustomBtn";

const { width } = Dimensions.get("window");

class ProgressHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      profile: undefined,
      initialProgressInfo: undefined,
      currentProgressInfo: undefined,
      unitsOfMeasurement: undefined,
      measurements: undefined,
      helperModalVisible: false,
      imageModalVisible: false,
      imageModalSource: undefined,
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
    this.props.navigation.setParams({
      toggleHelperModal: this.showHelperModal,
    });
    this.fetchProgressInfo();
    this.showHelperOnFirstOpen();
    this.fetchActiveChallengeUserData();
    this.fetchDataMeasurement();
  };

  // componentDidMount() {
  //   this.props.navigation.setParams({
  //     toggleHelperModal: this.showHelperModal,
  //   });
  //   this.fetchProgressInfo();
  //   this.showHelperOnFirstOpen();
  //   this.fetchActiveChallengeUserData();
  // }
  componentWillUnmount() {
    this.unsubscribe();
    if (this.unsubscribeFACUD) this.unsubscribeFACUD();
    if (this.unsubscribeFACD) this.unsubscribeFACD();
  }
  showHelperOnFirstOpen = async () => {
    const helperShownOnFirstOpen = await AsyncStorage.getItem(
      "progressHelperShownOnFirstOpen"
    );
    if (helperShownOnFirstOpen === null) {
      this.props.setTimeout(
        () => this.setState({ helperModalVisible: true }),
        1200
      );
      AsyncStorage.setItem("progressHelperShownOnFirstOpen", "true");
    }
  };
  showHelperModal = () => {
    this.setState({ helperModalVisible: true });
  };
  hideHelperModal = () => {
    this.setState({ helperModalVisible: false });
  };
  toggleImageModal = (imageSource) => {
    this.setState((prevState) => ({
      imageModalSource: imageSource,
      imageModalVisible: !prevState.imageModalVisible,
    }));
  };

  fetchDataMeasurement = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    this.unsubscribe = await db.collection("users")
    .doc(uid)
    .collection("challenges")
    .where("status", "==", "Active")
    .onSnapshot(async (querySnapshot) => {
      const list = []
      await querySnapshot.forEach(async (doc) => {
        await list.push(await doc.data());
      });

      if (list[0]){
        const listing = list[0]
        const listing1 = listing.onBoardingInfo.measurements.unit
        console.log("Listing Uno", listing1)
        this.setState({
          measurements: listing1
        })
      }
    })
  }

  fetchProgressInfo = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db.collection("users").doc(uid);
    this.unsubscribe = userRef.onSnapshot(async (doc) => {
      var data = await doc.data();
      console.log("qwertyuiop", data.unitsOfMeasurement)
      this.setState({
        profile: data,
        initialProgressInfo: data.initialProgressInfo,
        currentProgressInfo: data.currentProgressInfo
          ? data.currentProgressInfo
          : null,
        // unitsOfMeasurement: data.unitsOfMeasurement,
        loading: false,
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
          if (list[0]) {
            this.fetchActiveChallengeData(list[0]);
          } else {
            this.setState({ totalS: 5 });
            this.setState({ totalI: 5 });
            this.setState({ totalC: 5 });

            this.setState({
              countI: this.state.profile.weeklyTargets.interval,
            });
            this.setState({ countC: this.state.profile.weeklyTargets.circuit });
            this.setState({
              countS: this.state.profile.weeklyTargets.strength,
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
            // activeChallengeData.phases.forEach(phase => {
            activeChallengeData.workouts.forEach((workout) => {
              totalWorkouts.push(workout);
            });
            // });

            const totalInterval = totalWorkouts.filter(
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
      initialProgressInfo,
      currentProgressInfo,
      unitsOfMeasurement,
      measurements,
      helperModalVisible,
      imageModalVisible,
      imageModalSource,
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

    // if (activeChallengeData !== undefined) {
    //   totalI = 0;
    //   totalInterval.forEach((res) => (totalI += res.days.length));
    //   totalC = 0;
    //   totalCircuit.forEach((res) => (totalC += res.days.length));
    //   totalS = 0;
    //   totalStrength.forEach((res) => (totalS += res.days.length));

    //   countI = totalIntervalCompleted.length;
    //   countC = totalCircuitCompleted.length;
    //   countS = totalStrengthCompleted.length;
    // } else if (profile !== undefined) {
    //   totalI = 5;
    //   totalC = 5;
    //   totalS = 5;

    //   countI = profile.weeklyTargets.interval;
    //   countC = profile.weeklyTargets.circuit;
    //   countS = profile.weeklyTargets.strength;
    // }

    const weightDifference =
      initialProgressInfo &&
      currentProgressInfo &&
      diff(initialProgressInfo.weight, currentProgressInfo.weight);
    const hipDifference =
      initialProgressInfo &&
      currentProgressInfo &&
      diff(initialProgressInfo.hip, currentProgressInfo.hip);
    const waistDifference =
      initialProgressInfo &&
      currentProgressInfo &&
      diff(initialProgressInfo.waist, currentProgressInfo.waist);
    const burpeesDifference =
      initialProgressInfo &&
      currentProgressInfo &&
      diff(initialProgressInfo.burpeeCount, currentProgressInfo.burpeeCount);

    const editBeforeBtn = (onPress) => (
      <CustomBtn
        // Title="Update"
        Title="Edit Before"
        outline={false}
        customBtnStyle={{
          // padding: wp("1.7%"),

          // justifyContent: "space-between",
          // paddingStart: wp("5%"),
          // paddingEnd: wp("3%"),
          // marginHorizontal: wp("10%"),
          // marginVertical: wp("3%"),
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 20,
          paddingRight: 20,
        }}
        // isRightIcon={true}
        // rightIconName="chevron-right"
        // rightIconColor={colors.black}
        customBtnTitleStyle={{
          // fontFamily: fonts.SimplonMonoMedium,
          fontFamily: fonts.bold,
          fontSize: 8,
          // color:colors.offWhite,
          // textTransform: "capitalize",
        }}
        onPress={onPress}
      />
    );

    const updateProgressBtn = (onPress) => (
      <CustomBtn
        // Title="Update"
        Title="Update Progress"
        outline={false}
        customBtnStyle={{
          // padding: wp("1.7%"),

          // justifyContent: "space-between",
          // paddingStart: wp("5%"),
          // paddingEnd: wp("1%"),
          // marginHorizontal: wp("10%"),
          // marginVertical: wp("3%"),
          padding: 8,
        }}
        // isRightIcon={true}
        // rightIconName="chevron-right"
        // rightIconColor={colors.black}
        customBtnTitleStyle={{
          // fontFamily: fonts.SimplonMonoMedium,
          fontFamily: fonts.bold,
          fontSize: 8,
          // color:colors.offWhite,
          // textTransform: "capitalize",
        }}
        onPress={onPress}
      />
    );

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.imagesContainer}>
            {initialProgressInfo && initialProgressInfo.photoURL ? (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.toggleImageModal(initialProgressInfo.photoURL)
                  }
                >
                  <FastImage
                    style={styles.image}
                    source={{
                      uri: initialProgressInfo.photoURL,
                      cache: "immutable",
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
                {/* {updateBtn(() =>
                  this.props.navigation.navigate("Progress1", {
                    isInitial: true,
                    navigateTo: "Progress",
                  })
                )} */}
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <TouchableOpacity
                  disabled={initialProgressInfo === undefined}
                  onPress={() =>
                    // this.props.navigation.navigate("Progress1", {
                    //   isInitial: true,
                    //   navigateTo: "Progress",
                    // })
                    this.props.navigation.navigate("Progress2", {
                      initialProgressInfo: initialProgressInfo,
                      currentProgressInfo: currentProgressInfo,
                      isInitial: true,
                    })
                  }
                  style={styles.imagePlaceholderButton}
                >
                  <Icon
                    name="add-circle"
                    color={colors.white}
                    size={20}
                    style={styles.addIcon}
                  />
                  <Text style={styles.imagePlaceholderButtonText}>
                    {/* Add before photo and measurements */}
                    Add Before Photo
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {currentProgressInfo ? (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.toggleImageModal(currentProgressInfo.photoURL)
                  }
                >
                  <FastImage
                    style={styles.image}
                    source={{
                      uri: currentProgressInfo.photoURL,
                      cache: "immutable",
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </TouchableOpacity>
                {/* {updateBtn(() =>
                  this.props.navigation.navigate("Progress1", {
                    isInitial: false,
                  })
                )} */}
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <TouchableOpacity
                  onPress={() =>
                    // this.props.navigation.navigate("Progress1", {
                    //   isInitial: false,
                    // })
                    this.props.navigation.navigate("Progress2", {
                      initialProgressInfo: initialProgressInfo,
                      currentProgressInfo: currentProgressInfo,
                      isInitial: false,
                    })
                  }
                  disabled={initialProgressInfo === undefined}
                  style={[
                    styles.imagePlaceholderButton,
                    initialProgressInfo === undefined &&
                      styles.disabledImagePlaceHolderButton,
                  ]}
                >
                  <Icon
                    name="add-circle"
                    color={colors.white}
                    size={20}
                    style={styles.addIcon}
                  />
                  <Text style={styles.imagePlaceholderButtonText}>
                    {/* Add after photo and measurements */}
                    Progress Photo
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.dateRowContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {initialProgressInfo
                  ? moment(initialProgressInfo.date).format("DD/MM/YYYY")
                  : "-"}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {currentProgressInfo
                  ? moment(currentProgressInfo.date).format("DD/MM/YYYY")
                  : "-"}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.weight : "-"}{" "}
                {initialProgressInfo && measurements === "metric" && "kg"}
                {initialProgressInfo &&
                  measurements === "imperial" &&
                  "lbs"}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>WEIGHT</Text>
              <Text
                style={[
                  styles.dataTextNegative,
                  weightDifference >= 0 && styles.dataTextPositive,
                ]}
              >
                {weightDifference || "-"}{" "}
                {weightDifference && measurements === "metric" && "kg"}
                {weightDifference && measurements === "imperial" && "lbs"}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {currentProgressInfo && currentProgressInfo.weight
                  ? currentProgressInfo.weight
                  : "-"}{" "}
                {currentProgressInfo &&
                  currentProgressInfo.weight &&
                  measurements === "metric" &&
                  "kg"}
                {currentProgressInfo &&
                  currentProgressInfo.weight &&
                  measurements === "imperial" &&
                  "lbs"}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.waist : "-"}{" "}
                {initialProgressInfo && measurements === "metric" && "cm"}
                {initialProgressInfo &&
                  measurements === "imperial" &&
                  "inches"}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>WAIST</Text>
              <Text
                style={[
                  styles.dataTextNegative,
                  waistDifference >= 0 && styles.dataTextPositive,
                ]}
              >
                {waistDifference || "-"}{" "}
                {waistDifference && measurements === "metric" && "cm"}
                {waistDifference &&
                  measurements === "imperial" &&
                  "inches"}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {currentProgressInfo && currentProgressInfo.waist
                  ? currentProgressInfo.waist
                  : "-"}{" "}
                {currentProgressInfo &&
                  currentProgressInfo.waist &&
                  measurements === "metric" &&
                  "cm"}
                {currentProgressInfo &&
                  currentProgressInfo.waist &&
                  measurements === "imperial" &&
                  "inches"}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.hip : "-"}{" "}
                {initialProgressInfo && measurements === "metric" && "cm"}
                {initialProgressInfo &&
                  measurements === "imperial" &&
                  "inches"}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>HIP</Text>
              <Text
                style={[
                  styles.dataTextNegative,
                  hipDifference >= 0 && styles.dataTextPositive,
                ]}
              >
                {hipDifference || "-"}{" "}
                {hipDifference && measurements === "metric" && "cm"}
                {hipDifference && measurements === "imperial" && "inches"}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {currentProgressInfo && currentProgressInfo.hip
                  ? currentProgressInfo.hip
                  : "-"}{" "}
                {currentProgressInfo &&
                  currentProgressInfo.hip &&
                  measurements === "metric" &&
                  "cm"}
                {currentProgressInfo &&
                  currentProgressInfo.hip &&
                  measurements === "imperial" &&
                  "inches"}
              </Text>
            </View>
          </View>
          <View style={styles.dataRowContainer}>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {initialProgressInfo ? initialProgressInfo.burpeeCount : "-"}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldText}>BURPEES</Text>
              <Text
                style={[
                  styles.dataTextNegative,
                  burpeesDifference >= 0 && styles.dataTextPositive,
                ]}
              >
                {burpeesDifference || "-"}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.dataText}>
                {currentProgressInfo && currentProgressInfo.burpeeCount
                  ? currentProgressInfo.burpeeCount
                  : "-"}
              </Text>
            </View>
          </View>
          <View
            style={{
              width: width - 20,
              marginTop: 5,
              marginBottom: 5,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {editBeforeBtn(() =>
                this.props.navigation.navigate("ProgressEdit", {
                  initialProgressInfo: initialProgressInfo,
                  currentProgressInfo: currentProgressInfo,
                  isInitial: true,
                })
              )}
            </View>
            <View
              style={{
                flex: 1,
              }}
            ></View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {updateProgressBtn(() =>
                this.props.navigation.navigate("ProgressEdit", {
                  initialProgressInfo: initialProgressInfo,
                  currentProgressInfo: currentProgressInfo,
                  isInitial: false,
                })
              )}
            </View>
          </View>
          {/* <View>
            {initialProgressInfo ? updateBtn(() =>
              this.props.navigation.navigate("ProgressEdit", {
                initialProgressInfo: initialProgressInfo,
                isInitial: true
              })
            ) : updateBtn(() =>
            this.props.navigation.navigate("ProgressEdit", {
              initialProgressInfo: initialProgressInfo,
              isInitial: true
            })
          )}
          </View> */}
          {/* {
            initialProgressInfo && currentProgressInfo && (
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="UPDATE PROGRESS"
                  onPress={() => this.props.navigation.navigate('Progress1', { isInitial: false })}
                  blue
                />
              </View>
            )
          } */}
          <View style={styles.workoutProgressContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.bodyText}>
                Total workout completed
              </Text>
            </View>
            <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  width: "100%",
                }}
            >
              {profile && (
                  <View>
                    <ProgressBar
                        title=""
                        completed={profile.totalWorkoutCompleted}
                        total={totalS}
                        size={wp("38%")}
                    />
                  </View>
              )}
            </View>
          </View>
          <View style={styles.workoutProgressContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.bodyText}>
                {activeChallengeData
                  ? "Active challenge progress"
                  : "Weekly workout progress"}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {profile && (
                <View>
                  <ProgressBar
                    title="Strength"
                    completed={countS}
                    total={totalS}
                    size={wp("38%")}
                  />
                </View>
              )}
              {profile && (
                <View>
                  <ProgressBar
                    title="Circuit"
                    completed={countC}
                    total={totalC}
                    size={wp("38%")}
                  />
                </View>
              )}
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                marginTop: -30,
              }}
            >
              {profile && (
                <View>
                  <ProgressBar
                    title="Interval"
                    completed={countI}
                    total={totalI}
                    size={wp("38%")}
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={this.hideHelperModal}
          headingText="Progress"
          bodyText="By tracking your progress, you can stay accountable and motivated throughout your fitness journey."
          bodyText2="Your ‘before’ photo and measurements will stay on the left of screen.  When it comes time to check-in, your ‘after’ photo and measurement will be uploaded on the right."
          bodyText3="When you want to update your ‘after’ photo, press the update button at the bottom of screen. You can reset your ‘before’ photo in Profile => Settings."
          color="red"
        />
        <ImageModal
          imageModalVisible={imageModalVisible}
          toggleImageModal={() => this.toggleImageModal()}
          color="red"
          imageSource={{ uri: imageModalSource }}
        />
        <Loader loading={loading} color={colors.red.standard} />
      </View>
    );
  }
}

ProgressHomeScreen.propTypes = {
  setTimeout: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: "center",
  },
  contentContainer: {
    width,
    backgroundColor: colors.offWhite,
    alignItems: "center",
    paddingBottom: 5,
  },
  imagesContainer: {
    width,
    flexDirection: "row",
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  image: {
    width: width / 2,
    height: (width / 3) * 2,
  },
  imagePlaceholder: {
    backgroundColor: colors.smoke,
    width: width / 2,
    height: (width / 3) * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderButton: {
    backgroundColor: colors.themeColor.lightColor,
    width: "70%",
    padding: 10,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  disabledImagePlaceHolderButton: {
    backgroundColor: colors.themeColor.lightColor,
    width: "70%",
    padding: 10,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    opacity: 0.5,
  },
  imagePlaceholderButtonText: {
    color: colors.black,
    fontFamily: fonts.standard,
    fontSize: 12,
    textAlign: "center",
  },
  addIcon: {
    alignSelf: "center",
    marginBottom: 10,
  },
  dateRowContainer: {
    width,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
  },
  dateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
  },
  dataRowContainer: {
    width: width - 20,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 2,
    shadowColor: colors.grey.standard,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fieldContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.themeColor.lightColor,
  },
  fieldText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.black,
    marginTop: 5,
    marginBottom: 5,
  },
  dataContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dataText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.black,
  },
  dataTextPositive: {
    marginBottom: 5,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
  },
  dataTextNegative: {
    marginBottom: 5,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.black,
  },
  buttonContainer: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  workoutProgressContainer: {
    alignItems: "center",
    width: width - 20,
    marginTop: 5,
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: "transparent",
    borderRadius: 2,
    shadowColor: colors.themeColor.lightColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sectionHeader: {
    alignItems: "center",
    // backgroundColor: colors.themeColor.lightColor,
    width: width - 20,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    padding: 8,
    paddingBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: colors.black,
    fontWeight: "500",
    paddingVertical: 20,
    textAlign: "center",
    width: "100%",
  },
});

export default ReactTimeout(ProgressHomeScreen);
