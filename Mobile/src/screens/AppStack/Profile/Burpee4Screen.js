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
import { db } from "../../../../config/firebase";
import { burpeeOptions, findFitnessLevel } from "../../../utils";
import moment from "moment";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import CustomBtn from "../../../components/Shared/CustomBtn";
import { containerPadding } from "../../../styles/globalStyles";

const { width } = Dimensions.get("window");

const storeProgressInfo = async (
  isInitial,
  burpeeCount
) => {
  const uid = await AsyncStorage.getItem("uid");
  const progressDataFieldName = isInitial
    ? "initialProgressInfo"
    : "currentProgressInfo";

  console.log('progressDataFieldName: ', progressDataFieldName)

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

export default class Burpee4Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      burpeeCount: 0,
      burpeeModalVisible: false,
      loading: false,
    };
  }

  componentDidMount = () => {
    this.props.navigation.setParams({ handleCancel: this.handleCancel });
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

            if(updateBurpees){
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

  handleSubmit = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    const { burpeeCount } = this.state;
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db.collection("users").doc(uid);
    const userSnapshot = await userRef.get();
    const initialProgressInfo = userSnapshot.data().initialProgressInfo ?? null;
    const {
      isInitial,
      navigateTo,
      updateBurpees
    } = this.props.navigation.state.params;
    const fitnessLevel = findFitnessLevel(burpeeCount);
    console.log('isInitial: ', isInitial)

    if (updateBurpees) {
      await storeProgressInfo(isInitial, burpeeCount)
    } else {
      const progressInfo = {
        ...initialProgressInfo,
        burpeeCount: burpeeCount,
      };

      try {
        await userRef.set(
          {
            initialProgressInfo: progressInfo,
          },
          { merge: true }
        );
      } catch (reason) {
        console.log("[Burpee4Screen.js handleSubmit() error: ", reason);
      }
    }

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
        this.props.navigation.navigate("ProgressEdit", {
          isInitial: isInitial
        });
      } else {
        if (this.props.navigation.getParam("fromScreen")) {
          const screen = this.props.navigation.getParam("fromScreen");
          const params = this.props.navigation.getParam("screenReturnParams");
          this.props.navigation.navigate(screen, params);
          return;
        }
        this.props.navigation.navigate("Home");
      }
    } catch (err) {
      console.log(err)
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
                    customBtnStyle={{ margin: 10, marginTop: 0 }}
                    onPress={this.toggleBurpeeModal}
                  />
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
