import React, {
  useEffect,
  useState
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from "react-native";
import moment from "moment";
import FastImage from "react-native-fast-image";
import Loader from "../../../../components/Shared/Loader";
import ProgressBar from "../../../../components/Progress/ProgressBar";
import Icon from "../../../../components/Shared/Icon";
import HelperModal from "../../../../components/Shared/HelperModal";
import ImageModal from "../../../../components/Progress/ImageModal";
import colors from "../../../../styles/colors";
import fonts from "../../../../styles/fonts";
import {
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import CustomBtn from "../../../../components/Shared/CustomBtn";
import { styles } from "./style";
import { diff } from "../../../../utils/index";
import AsyncStorage from "@react-native-community/async-storage";
import { db } from "../../../../../config/firebase"

export const YouScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(undefined);
  const [initialProgressInfo, setInitialProgressInfo] = useState(undefined);
  const [currentProgressInfo, setCurrentProgressInfo] = useState(undefined);
  const [unitsOfMeasurement, setUnitsOfMeasurement] = useState(undefined);
  const [helperModalVisible, setHelperModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageModalSource, setImageModalSource] = useState(undefined);
  const [activeChallengeData, setActiveChallengeData] = useState(undefined);
  const [totalI, setTotalI] = useState(0);
  const [totalS, setTotalS] = useState(0);
  const [totalC, setTotalC] = useState(0);
  const [countI, setCountI] = useState(0);
  const [countS, setCountS] = useState(0);
  const [countC, setCountC] = useState(0);

  const weightDifference =
    initialProgressInfo &&
    currentProgressInfo &&
    diff(initialProgressInfo.weight, currentProgressInfo.weight);
  const weightToDecimal =
    Number(weightDifference).toFixed(2);
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
  const { width } = Dimensions.get("window");

  const showHelperOnFirstOpen = async () => {
    const helperShownOnFirstOpen = await AsyncStorage.getItem("progressHelperShownOnFirstOpen");

    if (helperShownOnFirstOpen === null) {
      setTimeout(
        () => setHelperModalVisible(true),
        1200
      );
      AsyncStorage.setItem("progressHelperShownOnFirstOpen", "true")
    }
  };

  const showHelperModal = () => {
    setHelperModalVisible(true)
  };

  const hideHelperModal = () => {
    setHelperModalVisible(false)
  };

  const toggleImageModal = (imageSource) => {
    setImageModalSource(imageSource)
    setImageModalVisible(!imageModalVisible)
  };

  const fetchProgressInfo = async () => {
    setLoading(true)
    const uid = await AsyncStorage.getItem("uid");
    const userData = await db
      .collection("users")
      .doc(uid)
      .get();

    if (userData) {
      const userInfo = userData.data()
      const currentProgressInfo = userInfo.currentProgressInfo ?
        userInfo.currentProgressInfo :
        null

      setProfile(userInfo)
      setInitialProgressInfo(userInfo.initialProgressInfo)
      setCurrentProgressInfo(currentProgressInfo)
      setUnitsOfMeasurement(userInfo.unitsOfMeasurement)
      setLoading(false)

      if (
        userInfo.weeklyTargets.currentWeekStartDate !==
        moment().startOf("week").format("YYYY-MM-DD")
      ) {
        const data = {
          weeklyTargets: {
            currentWeekStartDate: moment().startOf("week").format("YYYY-MM-DD"),
          },
        };

        await db
          .collection("users")
          .doc(userInfo.id)
          .set(data, { merge: true })
          .then((res) => {
            return true
          })
          .catch((err) => console.log(err));
        
      }
    }
  };

  const fetchActiveChallengeUserData = async () => {
    try {
      setLoading(true)
      const uid = await AsyncStorage.getItem("uid");
      const userActiveChallengeRef = await db
        .collection("users")
        .doc(uid)
        .collection("challenges")
        .where("status", "==", "Active")
        .get()

      userActiveChallengeRef.docs.forEach(userActiveChallenge => {
        if (userActiveChallenge) {
          fetchActiveChallengeData(userActiveChallenge.data())
        } else {
          setTotalS(0)
          setTotalI(0)
          setTotalC(0)
          setCountC(0)
          setCountI(0)
          setCountS(0)
        }
      })
    } catch (err) {
      setLoading(false)
      console.log("Fetch active challenge user data error!", err);
    }
  };

  const fetchActiveChallengeData = async (activeChallengeUserData) => {
    try {
      const activeChallengeDatas = await db
        .collection("challenges")
        .doc(activeChallengeUserData.id)
        .get();

      if (activeChallengeDatas) {
        const activeChallengeData = activeChallengeDatas.data()
        const totalIntervalCompleted =
          activeChallengeUserData.workouts
            .filter(res => res.target === "interval");
        const totalCircuitCompleted =
          activeChallengeUserData.workouts
            .filter(res => res.target === "circuit");
        const totalStrengthCompleted =
          activeChallengeUserData.workouts
            .filter(res => res.target === "strength");

        setTotalS(5)
        setTotalI(5)
        setTotalC(5)
        setCountC(totalCircuitCompleted.length)
        setCountI(totalIntervalCompleted.length)
        setCountS(totalStrengthCompleted.length)
        setActiveChallengeData(activeChallengeData)
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
      console.log("Fetch active challenge data error: ", err);
    }
  };

  const updateProgressBtn = (
    initialProgressInfo,
    currentProgressInfo
  ) => {

    navigation.navigate("ProgressEdit", {
      isInitial: false,
      initialProgressInfo: initialProgressInfo,
      currentProgressInfo: currentProgressInfo
    })
  }

  const editBeforeBtn = (
    initialProgressInfo,
    currentProgressInfo
  ) => (

    navigation.navigate("ProgressEdit", {
      isInitial: true,
      initialProgressInfo: initialProgressInfo,
      currentProgressInfo: currentProgressInfo
    })
  );

  useEffect(() => {
    showHelperOnFirstOpen()
  }, [])

  useEffect(() => {
    navigation.setParams({
      toggleHelperModal: showHelperModal,
    });
  }, [])

  useEffect(() => {
    fetchProgressInfo();
    fetchActiveChallengeUserData();
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.imagesContainer}>
          {initialProgressInfo && initialProgressInfo.photoURL ? (
            <View>
              <TouchableOpacity
                onPress={() =>
                  toggleImageModal(initialProgressInfo.photoURL)
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
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <TouchableOpacity
                disabled={initialProgressInfo === undefined}
                onPress={() =>
                  navigation.navigate("Progress2", {
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
                  Add Before Photo
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {currentProgressInfo ? (
            <View>
              <TouchableOpacity
                onPress={() =>
                  toggleImageModal(currentProgressInfo.photoURL)
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
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Progress2", {
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
              {initialProgressInfo && unitsOfMeasurement === "metric" && "kg"}
              {initialProgressInfo &&
                unitsOfMeasurement === "imperial" &&
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
              {weightToDecimal || "-"}{" "}
              {weightDifference && unitsOfMeasurement === "metric" && "kg"}
              {weightDifference && unitsOfMeasurement === "imperial" && "lbs"}
            </Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>
              {currentProgressInfo && currentProgressInfo.weight
                ? currentProgressInfo.weight
                : "-"}{" "}
              {currentProgressInfo &&
                currentProgressInfo.weight &&
                unitsOfMeasurement === "metric" &&
                "kg"}
              {currentProgressInfo &&
                currentProgressInfo.weight &&
                unitsOfMeasurement === "imperial" &&
                "lbs"}
            </Text>
          </View>
        </View>
        <View style={styles.dataRowContainer}>
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>
              {initialProgressInfo ? initialProgressInfo.waist : "-"}{" "}
              {initialProgressInfo && unitsOfMeasurement === "metric" && "cm"}
              {initialProgressInfo &&
                unitsOfMeasurement === "imperial" &&
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
              {waistDifference && unitsOfMeasurement === "metric" && "cm"}
              {waistDifference &&
                unitsOfMeasurement === "imperial" &&
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
                unitsOfMeasurement === "metric" &&
                "cm"}
              {currentProgressInfo &&
                currentProgressInfo.waist &&
                unitsOfMeasurement === "imperial" &&
                "inches"}
            </Text>
          </View>
        </View>
        <View style={styles.dataRowContainer}>
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>
              {initialProgressInfo ? initialProgressInfo.hip : "-"}{" "}
              {initialProgressInfo && unitsOfMeasurement === "metric" && "cm"}
              {initialProgressInfo &&
                unitsOfMeasurement === "imperial" &&
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
              {hipDifference && unitsOfMeasurement === "metric" && "cm"}
              {hipDifference && unitsOfMeasurement === "imperial" && "inches"}
            </Text>
          </View>
          <View style={styles.dataContainer}>
            <Text style={styles.dataText}>
              {currentProgressInfo && currentProgressInfo.hip
                ? currentProgressInfo.hip
                : "-"}{" "}
              {currentProgressInfo &&
                currentProgressInfo.hip &&
                unitsOfMeasurement === "metric" &&
                "cm"}
              {currentProgressInfo &&
                currentProgressInfo.hip &&
                unitsOfMeasurement === "imperial" &&
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
            <CustomBtn
              Title="Edit Before"
              outline={false}
              customBtnStyle={{
                padding: 8,
              }}
              customBtnTitleStyle={{
                fontFamily: fonts.bold,
                fontSize: 8,
              }}
              onPress={() => editBeforeBtn(initialProgressInfo, currentProgressInfo)}
            />
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
            <CustomBtn
              Title="Update Progress"
              outline={false}
              customBtnStyle={{
                padding: 8,
              }}
              customBtnTitleStyle={{
                fontFamily: fonts.bold,
                fontSize: 8,
              }}
              onPress={() => updateProgressBtn(initialProgressInfo, currentProgressInfo)}
            />
          </View>
        </View>
        <View style={styles.workoutProgressContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.bodyText}>
              Total workout complete
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
                  // title=""
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
        hideHelperModal={hideHelperModal}
        headingText="Progress"
        bodyText="By tracking your progress, you can stay accountable and motivated throughout your fitness journey."
        bodyText2="Your ‘before’ photo and measurements will stay on the left of screen.  When it comes time to check-in, your ‘after’ photo and measurement will be uploaded on the right."
        bodyText3="When you want to update your ‘after’ photo, press the update button at the bottom of screen. You can reset your ‘before’ photo in Profile => Settings."
        color="red"
      />
      <ImageModal
        imageModalVisible={imageModalVisible}
        toggleImageModal={() => toggleImageModal()}
        color="red"
        imageSource={{ uri: imageModalSource }}
      />
      <Loader
        loading={loading}
        color={colors.red.standard}
      />
    </View>
  );
}
