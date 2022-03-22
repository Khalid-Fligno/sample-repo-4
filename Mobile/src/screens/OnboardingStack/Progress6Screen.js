import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  TouchableOpacity,
  Picker,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Haptics from "expo-haptics";
import Modal from "react-native-modal";
import moment from "moment";
import { db } from "../../../config/firebase";
import { burpeeOptions, findFitnessLevel } from "../../utils";
import Loader from "../../components/Shared/Loader";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import CustomBtn from "../../components/Shared/CustomBtn";
import { containerPadding } from "../../styles/globalStyles";

const { width } = Dimensions.get("window");

const storeProgressInfo = async (
  isInitial,
  burpeeCount
) => {
  const uid = await AsyncStorage.getItem("uid");
  const progressDataFieldName = isInitial
    ? "initialProgressInfo"
    : "currentProgressInfo";

  await db
    .collection("users")
    .doc(uid)
    .set(
      {
        [progressDataFieldName]: {
          burpeeCount,
          date: moment().format("YYYY-MM-DD"),
        },
      },
      { merge: true }
    );
};

export default class Progress6Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      burpeeCount: 0,
      burpeeModalVisible: false,
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

  handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    const { burpeeCount } = this.state;
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db.collection("users").doc(uid);
    const { 
      isInitial, 
      navigateTo 
    } = this.props.navigation.state.params;
    const fitnessLevel = findFitnessLevel(burpeeCount);

    await storeProgressInfo(isInitial, burpeeCount);

    AsyncStorage.setItem("fitnessLevel", fitnessLevel.toString());
    try {
      await userRef.set(
        {
          fitnessLevel,
          initialBurpeeTestCompleted: true,
        },
        { merge: true }
      );

      this.setState({ loading: false });
      if (navigateTo === "Progress") {
        this.props.navigation.navigate("ProgressEdit");
      } 

    } catch (err) {
      Alert.alert("Database write error", `${err}`);
      this.setState({ loading: false });
    }
  };

  toggleBurpeeModal = () => {
    this.setState((prevState) => ({
      burpeeModalVisible: !prevState.burpeeModalVisible,
    }));
  };

  render() {
    const { 
      burpeeCount, 
      burpeeModalVisible, 
      loading 
    } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Results</Text>
            <Text style={styles.bodyText}>
              Please enter the number of burpees you completed.
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>Burpee Count</Text>
              <TouchableOpacity
                onPress={this.toggleBurpeeModal}
                style={styles.inputButton}
              >
                <Text style={styles.inputSelectionText}>{burpeeCount}</Text>
              </TouchableOpacity>
              <Modal
                isVisible={burpeeModalVisible}
                onBackdropPress={this.toggleBurpeeModal}
                animationIn="fadeIn"
                animationInTiming={600}
                animationOut="fadeOut"
                animationOutTiming={600}
              >
                <View style={styles.modalContainer}>
                  <Picker
                    selectedValue={burpeeCount}
                    onValueChange={(value) =>
                      this.setState({ burpeeCount: value })
                    }
                  >
                    {burpeeOptions.map((i) => (
                      <Picker.Item
                        key={i.value}
                        label={i.label}
                        value={i.value}
                      />
                    ))}
                  </Picker>
                  <CustomBtn
                    Title="DONE"
                    titleCapitalise={true}
                    outline={false}
                    customBtnStyle={{
                      margin: 10,
                      marginTop: 0,
                    }}
                    onPress={this.toggleBurpeeModal}
                  />
                  {/* <TouchableOpacity
                    title="DONE"
                    onPress={this.toggleBurpeeModal}
                    style={styles.modalButton}
                  >
                    <Text style={styles.modalButtonText}>
                      DONE
                    </Text>
                  </TouchableOpacity> */}
                </View>
              </Modal>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomBtn
              Title="NEXT"
              titleCapitalise={true}
              onPress={this.handleSubmit}
            />
            {/* <CustomButton
              title="NEXT"
              onPress={this.handleSubmit}
              primary
            /> */}
          </View>
          <Loader
            loading={loading}
            color={colors.coral.standard}
            text="SAVING"
          />
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
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: "hidden",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor.color,
    height: 50,
    width: "100%",
  },
  modalButtonText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    paddingHorizontal: containerPadding,
    width: "100%",
  },
});
