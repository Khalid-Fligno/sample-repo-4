import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { ListItem } from "react-native-elements";
import * as FileSystem from "expo-file-system";
import { PieChart } from "react-native-svg-charts";
import Rate from "react-native-rate";
import Loader from "../../../../components/Shared/Loader";
import Icon from "../../../../components/Shared/Icon";
import CustomBtn from "../../../../components/Shared/CustomBtn";
import fonts from "../../../../styles/fonts";
import colors from "../../../../styles/colors";
import { Platform } from "react-native";
import globalStyle from "../../../../styles/globalStyles";
import Dialog, {
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogButton,
} from "react-native-popup-dialog";

const { width } = Dimensions.get("window");

const pieDataComplete = [100, 0].map((value, index) => ({
  value,
  svg: {
    fill: colors.coral.standard,
  },
  key: `pie-${index}`,
}));

export default class WorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      popUp: false,
    };
    this.backButtonClick = this.backButtonClick.bind(this);
  }
  componentDidMount = async () => {
    BackHandler.addEventListener("hardwareBackPress", this.backButtonClick);
    this.manageVideoCache();
    if (Platform.OS === "ios") this.showRatePopup();
    if (Platform.OS === "android") {
      this.setState({ popUp: true });
    }
  };

  componentWillUnmount = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.backButtonClick);
  };

  backButtonClick() {
    this.setState({ popUp: false });
  }

  showRatePopup = async () => {
    Rate.rate({
      AppleAppID: "1438373600",
      preferInApp: true,
      openAppStoreIfInAppFails: false,
    });
  };
  manageVideoCache = async () => {
    FileSystem.readDirectoryAsync(`${FileSystem.cacheDirectory}`).then(
      (res) => {
        // console.log(res)
        Promise.all(
          res.map(async (item, index) => {
            if (item.includes("exercise-")) {
              // console.log(`${FileSystem.cacheDirectory}${item}`);
              FileSystem.deleteAsync(`${FileSystem.cacheDirectory}${item}`, {
                idempotent: true,
              }).then(() => {
                // console.log("deleted...",item)
              });
            }
          })
        );
      }
    );
  };
  completeWorkout = async () => {
    const extraProps = this.props.navigation.getParam("extraProps", undefined);
    if (extraProps["fromCalender"]) {
      this.props.navigation.navigate("CalendarHome");
    } else {
      this.props.navigation.navigate("WorkoutsHome");
    }
  };
  completeWorkoutAndInvite = async () => {
    this.props.navigation.navigate("WorkoutsHome");
    this.props.navigation.navigate("InviteFriends");
  };
  render() {
    const { loading, popUp } = this.state;
    const completePieChart = (
      <PieChart
        style={styles.pieChart}
        data={pieDataComplete}
        innerRadius="80%"
      />
    );
    const tickIcon = (
      <View style={styles.invisibleView}>
        <View style={styles.tickContainer}>
          <Icon name="tick-heavy" color={colors.charcoal.dark} size={100} />
        </View>
      </View>
    );
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <Dialog
            visible={popUp}
            onTouchOutside={() => {
              this.setState({ popUp: false });
            }}
            dialogTitle={
              <DialogTitle title="Your feedback matters to us" align="left" />
            }
            footer={
              <DialogFooter>
                <DialogButton
                  text="DO THIS LATER"
                  onPress={() => {
                    this.setState({ popUp: false });
                  }}
                />
                <DialogButton
                  text="RATE NOW"
                  onPress={() => {
                    const options = {
                      GooglePackageName: "com.fitazfk.fitazfkapp",
                    };
                    Rate.rate(options, (success, errorMessage) => {
                      if (success) {
                        console.log("ANDROID RATE REVIEW ", success);
                      }
                      if (errorMessage) {
                        console.log("ANDROID RATE REVIEW ", errorMessage);
                      }
                    });
                  }}
                />
              </DialogFooter>
            }
            // onTouchOutside={() => {
            //   this.setState({ visible: false });
            // }}
          >
            <DialogContent>
              <TouchableOpacity
                onPress={() => {
                  const options = {
                    GooglePackageName: "com.fitazfk.fitazfkapp",
                  };
                  Rate.rate(options, (success, errorMessage) => {
                    if (success) {
                      console.log("ANDROID RATE REVIEW ", success);
                    }
                    if (errorMessage) {
                      console.log("ANDROID RATE REVIEW ", errorMessage);
                    }
                  });
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 10,
                  }}
                >
                  <Icon name="star-outline" size={50} />
                  <Icon name="star-outline" size={50} />
                  <Icon name="star-outline" size={50} />
                  <Icon name="star-outline" size={50} />
                  <Icon name="star-outline" size={50} />
                </View>
              </TouchableOpacity>
              <Text>
                If you enjoy using this app, would you mind{"\n"}taking a moment
                to rate it? It won't take more{"\n"}than a minute. Thank you for
                your support!
              </Text>
            </DialogContent>
          </Dialog>
          {/* <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              WORKOUT
            </Text>
            <Text style={styles.headerText}>
              COMPLETE
            </Text>
            <Text style={styles.bodyText}>
              {"EVERY SESSION GETS YOU CLOSER TO SMASHING YOUR GOALS.  YOU'VE GOT THIS!"}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            {completePieChart}
            {tickIcon}
          </View> */}
          <Image
            source={require("../../../../../assets/icons/FITAZ_BrandMark.png")}
            style={{ width: 75 }}
            resizeMode="contain"
          />
          <View style={styles.iconContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>Workout Complete!</Text>
              <Text style={styles.bodyText1}>
                "Congratulations on empowering yourself!"
              </Text>
              <Text style={styles.bodyText2}>See you back here soon.</Text>
            </View>
          </View>
          <View>
            {/* <ListItem
              key="InviteFriends"
              title="Earn Free Gifts!"
              containerStyle={styles.listItemContainerGreen}
              titleStyle={styles.listItemTitleStyleGreen}
              onPress={() => this.completeWorkoutAndInvite()}
              leftIcon={
                <Icon
                  name="present"
                  size={20}
                  color={colors.green.forest}
                  style={styles.giftIcon}
                />
              }
              rightIcon={{ name: 'chevron-right', color: colors.grey.standard }}
            /> */}
            <View style={styles.buttonContainer}>
              <CustomBtn
                Title="Next"
                customBtnStyle={{
                  padding: 15,
                  width: width - 20,
                }}
                isRightIcon={true}
                rightIconName="chevron-right"
                rightIconColor={colors.citrus}
                rightIconSize={13}
                onPress={() => this.completeWorkout()}
                disabled={false}
                workoutComplete={true}
              />
            </View>
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
    // backgroundColor: colors.white,
    backgroundColor: colors.citrus,
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    width,
    padding: 10,
    paddingTop: 25,
  },
  headerText: {
    // fontFamily: fonts.ultraItalic,
    fontFamily: fonts.SimplonMonoMedium,
    fontSize: 44,
    // color: colors.themeColor.color,
    color: colors.charcoal.dark,
    textAlign: "center",
    //
    paddingBottom: 60,
  },
  bodyText1: {
    // fontFamily: fonts.bold,
    fontFamily: fonts.SimplonMonoLight,
    // fontSize: 16,
    fontSize: 36,
    color: colors.charcoal.dark,
    marginTop: 10,
    textAlign: "center",
    //
    paddingBottom: 25,
  },
  bodyText2: {
    // fontFamily: fonts.bold,
    fontFamily: fonts.SimplonMonoLight,
    // fontSize: 16,
    fontSize: 36,
    color: colors.charcoal.dark,
    marginTop: 10,
    textAlign: "center",
    //
    paddingBottom: 220,
    width: 300,
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pieChart: {
    height: 160,
    width: 160,
  },
  invisibleView: {
    height: 0,
  },
  tickContainer: {
    marginTop: -130,
  },
  buttonContainer: {
    padding: 10,
  },
  listItemContainerGreen: {
    width,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0,
    backgroundColor: colors.green.superLight,
  },
  listItemTitleStyleGreen: {
    fontFamily: fonts.bold,
    color: colors.green.forest,
    marginTop: 5,
    fontSize: 14,
  },
  giftIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
});
