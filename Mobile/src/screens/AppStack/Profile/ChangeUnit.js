import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Picker,
  TouchableOpacity,
  Dimensions,
  Alert,
  ImageBackground,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Haptics from "expo-haptics";
import * as Localization from "expo-localization";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import Loader from "../../../components/Shared/Loader";
import { db } from "../../../config/firebase";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import CustomBtn from "../../../components/Shared/CustomBtn";
import globalStyle, { containerPadding } from "../../../styles/globalStyles";
import Icon from "../../../components/Shared/Icon";

const { width } = Dimensions.get("window");

export default class ChangeUnitScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      unitOfMeasurement: undefined,
    };
  }
  // componentDidMount = async () => {
  //   this.focusListener = this.props.navigation.addListener("didFocus", () => {
  //     this.fetchDataMeasurement();
  //   });
  // };

  componentDidMount() {
    this.listeners = [
      this.props.navigation.addListener("didFocus", () => {
        this.onFocusFunction();
      }),
    ];
  }

  fetchDataMeasurement = async () => {
    const uid = await AsyncStorage.getItem("uid");
    this.unsubscribed = db
      .collection("users")
      .doc(uid)
      .onSnapshot(async (doc) => {
        var data = doc.data();
        console.log("data:", data.unitsOfMeasurement);
        this.setState({
          unitOfMeasurement: data.unitsOfMeasurement,
        });
      });
  };

  async onFocusFunction() {
    this.fetchDataMeasurement();
  }

  componentWillUnmount() {
    this.listeners.forEach((item) => item.remove());
    if (this.unsubscribed) this.unsubscribed();
  }

  handleSubmit = async (unitOfMeasurement) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
    try {
      const uid = await AsyncStorage.getItem("uid");
      const userRef = db.collection("users").doc(uid);
      const data = {
        unitsOfMeasurement: unitOfMeasurement,
      };
      await userRef.set(data, { merge: true });
      this.setState({ loading: false });
      this.props.navigation.navigate("Settings");
    } catch (err) {
      console.log(err);
      Alert.alert("Database write error", `${err}`);
      this.setState({ loading: false });
    }
  };
  render() {
    const { loading, unitOfMeasurement } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.contentContainer}>
            <View style={styles.inputFieldContainer}>
              <Text style={styles.inputFieldTitle}>Units of measurement</Text>
              <View style={styles.buttonRowContainer}>
                <CustomBtn
                  Title="Metric"
                  outline={true}
                  customBtnStyle={{
                    padding: 5,
                    width: "46%",
                    borderColor:
                      unitOfMeasurement === "metric"
                        ? colors.themeColor.color
                        : colors.themeColor.color,
                  }}
                  onPress={() => this.setState({ unitOfMeasurement: "metric" })}
                  customBtnTitleStyle={{
                    fontSize: 15,
                    marginLeft: 5,
                    color:
                      unitOfMeasurement === "metric"
                        ? colors.black
                        : colors.black,
                  }}
                  leftIconColor={colors.black}
                  leftIconSize={15}
                  isLeftIcon={unitOfMeasurement === "metric" ? true : false}
                  leftIconName="tick"
                />
                <CustomBtn
                  Title="Imperial"
                  outline={true}
                  customBtnStyle={{
                    padding: 5,
                    width: "46%",
                    borderColor:
                      unitOfMeasurement === "imperial"
                        ? colors.themeColor.color
                        : colors.themeColor.color,
                  }}
                  onPress={() =>
                    this.setState({ unitOfMeasurement: "imperial" })
                  }
                  customBtnTitleStyle={{
                    fontSize: 15,
                    marginLeft: 5,
                    color:
                      unitOfMeasurement === "imperial"
                        ? colors.black
                        : colors.black,
                  }}
                  leftIconColor={colors.black}
                  leftIconSize={15}
                  isLeftIcon={unitOfMeasurement === "imperial" ? true : false}
                  leftIconName="tick"
                />
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomBtn
              Title="Confirm"
              customBtnStyle={{ padding: 15 }}
              onPress={() => this.handleSubmit(unitOfMeasurement)}
              customBtnTitleStyle={{ letterSpacing: fonts.letterSpacing }}
            />
          </View>
          <Loader loading={loading} color={colors.coral.standard} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexContainer: {
    paddingHorizontal: 20,
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.offWhite,
  },
  buttonRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width - containerPadding * 2,
    marginTop: 15,
  },

  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingHorizontal: containerPadding,
  },
  headerText: {
    fontFamily: fonts.SimplonMonoLight,
    fontSize: 40,
    color: colors.offWhite,
    marginBottom: 7,
    textTransform: "capitalize",
  },
  bodyText: {
    fontFamily: fonts.StyreneAWebRegular,
    fontSize: 13,
    color: "#eaeced",
    width: "65%",

    letterSpacing: fonts.letterSpacing,
  },
  contentContainer: {
    paddingTop: 20,
    flex: 1,
    justifyContent: "flex-start",
  },
  inputFieldContainer: {
    marginBottom: 20,
  },
  inputFieldTitle: {
    marginLeft: 2,
    fontSize: 15,
    color: colors.black,
    marginBottom: 5,
    fontFamily: fonts.StyreneAWebRegular,
    letterSpacing: fonts.letterSpacing,
  },
  inputButton: {
    width: width - containerPadding * 2,
    padding: 15,
    paddingBottom: 12,
    backgroundColor: colors.containerBackground,
    borderBottomWidth: 2,
    paddingLeft: 0,
    borderColor: colors.themeColor.color,
    borderRadius: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  inputSelectionText: {
    fontFamily: fonts.StyreneAWebRegular,
    letterSpacing: fonts.letterSpacing,
    fontSize: 15,
    color: colors.grey.dark,
  },
  buttonContainer: {
    flex: 0.5,
    justifyContent: "flex-start",
    padding: 10,
    width: width - containerPadding * 2,
  },
});
