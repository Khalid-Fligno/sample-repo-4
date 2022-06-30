import React, {
  useEffect,
  useState
} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
  TouchableOpacity,
  Picker,
  TextInput,
} from "react-native";
import * as Haptics from "expo-haptics";
import Modal from "react-native-modal";
import HelperModal from "../../../../../components/Shared/HelperModal";
import CustomBtn from "../../../../../components/Shared/CustomBtn";
import Loader from "../../../../../components/Shared/Loader";
import {
  weightOptionsMetric,
  waistOptionsMetric,
  hipOptionsMetric,
  weightOptionsImperial,
  waistOptionsImperial,
  hipOptionsImperial,
} from "../../../../../utils/index";
import colors from "../../../../../styles/colors";
import fonts from "../../../../../styles/fonts";
import globalStyle, { containerPadding } from "../../../../../styles/globalStyles";
import * as FileSystem from "expo-file-system";
import _ from "lodash";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStorage } from "../../../../../hook/storage"
import { getDocument } from "../../../../../hook/firestore/read";
import { COLLECTION_NAMES } from "../../../../../library/collections";
import { addDocument } from "../../../../../hook/firestore/write";
import moment from "moment";

const { width } = Dimensions.get("window");

export const EditMeasurement = ({ navigation }) => {
  const [loading, setLoading] = useState(false)
  const [weight, setWeight] = useState(60)
  const [waist, setWaist] = useState(60)
  const [hip, setHip] = useState(60)
  const [modal, setModal] = useState(false)
  const [helperModalVisible, setHelperModalVisible] = useState(false)
  const [unitOfMeasurement, setUnitOfMeasurement] = useState(null)
  const [uom, setUom] = useState(null)
  
  const fetchDataMeasurement = async () => {
    setLoading(true)
    const uid = await useStorage.getItem("uid");
    const userData = await getDocument(
      COLLECTION_NAMES.USERS,
      uid
    )

    if (userData) {
      setUnitOfMeasurement(userData.unitsOfMeasurement)
      setLoading(false)
    }
  };

  const fetchInitialDataMeasurements = async () => {
    setLoading(true)
    const uid = await useStorage.getItem("uid");
    const userData = await getDocument(
      COLLECTION_NAMES.USERS,
      uid
    )

    if (userData) {
      const initialProgressInfo = userData?.initialProgressInfo;
      setWeight(initialProgressInfo?.weight)
      setWaist(initialProgressInfo?.waist)
      setHip(initialProgressInfo?.hip)
      setLoading(false)
    }
  };

  const fetchCurrentDataMeasurements = async () => {
    setLoading(true)
    const uid = await useStorage.getItem("uid");
    const userData = await getDocument(
      COLLECTION_NAMES.USERS,
      uid
    )

    if (userData) {
      const currentProgressInfo = userData?.currentProgressInfo;
      setWeight(currentProgressInfo?.weight)
      setWaist(currentProgressInfo?.waist)
      setHip(currentProgressInfo?.hip)
      setLoading(false)
    }
  };

  const handleSkip = () => {
    if (navigation.getParam("isInitial", false)) {
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
            onPress: () => navigation.navigate("Progress"),
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
            onPress: () => navigation.navigate("Progress"),
          },
        ],
        { cancelable: false }
      );
    }
  };

  const storeProgressInfo = async (
    isInitial,
    weight,
    waist,
    hip,
  ) => {
    const uid = await useStorage.getItem("uid");
    const progressDataFieldName = isInitial
      ? "initialProgressInfo"
      : "currentProgressInfo";

    console.log(progressDataFieldName)
    try {
      const data = {
        [progressDataFieldName]: {
          // photoURL: url,
          weight: parseFloat(weight, 10),
          waist: parseInt(waist, 10),
          hip: parseInt(hip, 10),
          // burpeeCount,
          date: moment().format("YYYY-MM-DD"),
        },
      }
      
      await addDocument(
        COLLECTION_NAMES.USERS,
        uid,
        data
      )
    } catch (err) {
      console.log("Data set error: ", err);
    }
  };

  const handleSubmit = async (
    weight,
    waist,
    hip
  ) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true)
    const isInitial = navigation.getParam("isInitial", false);

    await FileSystem.downloadAsync(
      "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE%20(2).mp4?alt=media&token=9ae1ae37-6aea-4858-a2e2-1c917007803f",
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`
    );

    try {
      const uid = await useStorage.getItem("uid");
      const userData = await getDocument(
        COLLECTION_NAMES.USERS,
        uid
      )

      if (userData) {
        const progressInfo = isInitial
          ? userData.initialProgressInfo
          : userData.currentProgressInfo;
        if (progressInfo) {
          if (true) {
            await storeProgressInfo(
              navigation.getParam("isInitial"),
              weight,
              waist,
              hip,
            );
            navigation.navigate("ProgressEdit");
          }
        } else {
          await storeProgressInfo(
            navigation.getParam("isInitial"),
            weight,
            waist,
            hip,
          );
          navigation.navigate("ProgressEdit");
        }
      }
    } catch (err) {
      Alert.alert("Error", `Error: ${err}.`, [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
    }
  };

  const showHelperModal = () => {
    setHelperModalVisible(true)
  };

  const hideHelperModal = () => {
    setHelperModalVisible(false)
  };

  useEffect(() => {
    if (unitOfMeasurement == "metric") {
      setUom("kg")
    } else {
      setUom("lbs")
    }
  }, [])

  useEffect(() => {
    navigation.setParams({
      handleSkip: handleSkip,
      toggleHelperModal: showHelperModal,
    });
  }, [])

  useEffect(() => {
    fetchDataMeasurement();
  }, [])

  useEffect(() => {
    if (navigation.getParam("isInitial")) {
      fetchInitialDataMeasurements();
    } else {
      fetchCurrentDataMeasurements();
    }
  }, [])

  return (
    <KeyboardAwareScrollView style={{ backgroundColor: colors.offWhite }}>
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              {navigation.getParam("isInitial")
                ? "Measurements"
                : "Progress Measurements"}
            </Text>
            <Text style={styles.bodyText}>
              To help you track your progress, let’s find out where you are
              now.
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>Weight({uom})</Text>

              {unitOfMeasurement === "metric" ? (
                <TextInput
                  style={styles.inputButton}
                  placeholder="Input your weight"
                  keyboardType="numeric"
                  onChangeText={(value) => setWeight(value)}
                  value={weight ? weight.toString() : null}
                />
              ) : (
                <TextInput
                  style={styles.inputButton}
                  placeholder="Input your weight"
                  keyboardType="numeric"
                  onChangeText={(value) => setWeight(value)}
                  value={weight ? weight.toString() : null}
                />
              )}
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>Waist</Text>
              <TouchableOpacity
                onPress={() => setModal(true)}
                style={styles.inputButton}
              >
                {
                  waist ?
                    <Text style={styles.inputSelectionText}>
                      {waist} {unitOfMeasurement === "metric" && "cm"}
                      {unitOfMeasurement === "imperial" && "inches"}
                    </Text>
                    :
                    <Text style={{
                      color: "#CACACA"
                    }}>
                      Input your waist
                    </Text>
                }
              </TouchableOpacity>
              <Modal
                isVisible={modal}
                onBackdropPress={() => setModal(!modal)}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOut="fadeOut"
                animationOutTiming={600}
              >
                <View style={globalStyle.modalContainer}>
                  <Picker
                    selectedValue={waist}
                    onValueChange={(value) => setWaist(value)}
                  >
                    {unitOfMeasurement === "metric"
                      ? waistOptionsMetric.map((i) => (
                        <Picker.Item
                          key={i.value}
                          label={`${i.label} cm`}
                          value={i.value}
                        />
                      ))
                      : waistOptionsImperial.map((i) => (
                        <Picker.Item
                          key={i.value}
                          label={`${i.label} inches`}
                          value={i.value}
                        />
                      ))}
                  </Picker>
                  <TouchableOpacity
                    title="DONE"
                    onPress={() => setModal(!modal)}
                    style={globalStyle.modalButton}
                  >
                    <Text style={globalStyle.modalButtonText}>DONE</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>Hip</Text>
              <TouchableOpacity
                onPress={() => setModal(true)}
                style={styles.inputButton}
              >
                {
                  hip ?
                    <Text style={styles.inputSelectionText}>
                      {hip} {unitOfMeasurement === "metric" && "cm"}
                      {unitOfMeasurement === "imperial" && "inches"}
                    </Text>
                    :
                    <Text style={{
                      color: "#CACACA"
                    }}>
                      Input your hip
                    </Text>
                }
              </TouchableOpacity>
              <Modal
                isVisible={modal}
                onBackdropPress={() => setModal(!modal)}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOut="fadeOut"
                animationOutTiming={600}
              >
                <View style={globalStyle.modalContainer}>
                  <Picker
                    selectedValue={hip}
                    onValueChange={(value) => setHip(value)}
                  >
                    {unitOfMeasurement === "metric"
                      ? hipOptionsMetric.map((i) => (
                        <Picker.Item
                          key={i.value}
                          label={`${i.label} cm`}
                          value={i.value}
                        />
                      ))
                      : hipOptionsImperial.map((i) => (
                        <Picker.Item
                          key={i.value}
                          label={`${i.label} inches`}
                          value={i.value}
                        />
                      ))}
                  </Picker>
                  <TouchableOpacity
                    title="DONE"
                    onPress={() => setModal(!modal)}
                    style={globalStyle.modalButton}
                  >
                    <Text style={globalStyle.modalButtonText}>DONE</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomBtn
              // Title="NEXT"
              Title="Update"
              titleCapitalise={true}
              onPress={() => handleSubmit(weight, waist, hip)}
              customBtnStyle={{ width: width / 1.1 }}
            />
          </View>
          <Loader loading={loading} color={colors.themeColor.color} />
        </View>
        <HelperModal
          helperModalVisible={helperModalVisible}
          hideHelperModal={hideHelperModal}
          headingText="Progress"
          bodyText="Adding a progress entry involves 3 steps - your measurements, a progress photo and a 1 minute burpee test."
          bodyText2="You will need to complete all three to successfully add an entry."
          bodyText3="If you can't do all of this right now, press skip in the top right corner to complete it later."
          color="coral"
        />
      </SafeAreaView>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.offWhite,
  },
  textContainer: {
    flex: 1,
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
    flexGrow: 1,
    justifyContent: "center",
    top: 15
  },
  inputFieldContainer: {
    marginBottom: 20,
  },
  inputFieldTitle: {
    marginLeft: 2,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  inputButton: {
    width: width - containerPadding * 2,
    padding: 15,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey.light,
    borderRadius: 2,
  },
  inputSelectionText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.dark,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    paddingHorizontal: containerPadding,
    width: "100%",
  },
});