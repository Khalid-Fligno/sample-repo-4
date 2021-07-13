import React from "react";
import { BottomTabBar } from "react-navigation-tabs";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { isActiveChallenge } from "../../utils/challenges";

var { height, width } = Dimensions.get("window");
let navigation = null;
const HiddenView = () => <View style={{ display: "none" }} />;
const TouchableWithoutFeedbackWrapper = ({
  onPress,
  onLongPress,
  testID,
  accessibilityLabel,
  ...props
}) => {
  const routeKey = accessibilityLabel.split(",")[0];
  const onPress1 = () => {
    if (routeKey === "Lifestyle") navigation.navigate("Home");
    else if (routeKey === "Transform") {
      isActiveChallenge().then((res) => {
        if (res) navigation.navigate("Calendar");
        else navigation.navigate("ChallengeSubscription");
      });
    } else if (routeKey === "You") {
      navigation.navigate("Progress");
    } else navigation.navigate(routeKey);
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => onPress1()}
      onLongPress={onLongPress}
      testID={testID}
      hitSlop={{
        left: 15,
        right: 15,
        top: 5,
        bottom: 5,
      }}
      accessibilityLabel={accessibilityLabel}
    >
      <View {...props} />
    </TouchableWithoutFeedback>
  );
};
const TabBarComponent = (props) => {
  navigation = props.navigation;
  return (
    <BottomTabBar
      {...props}
      style={styles.bottomBarStyle}
      getButtonComponent={({ route }) => {
        if (route.key === "Dashboard")
          //   if (route.key === "Dashboard" || route.key === "Calendar")
          return HiddenView;
        else return TouchableWithoutFeedbackWrapper;
      }}
    />
  );
};

export default TabBarComponent;

const styles = StyleSheet.create({
  bottomBarStyle: {
    // height: (height * 10.625) / 100   //your header height (10.625 is the %)
    height: hp("6.6%"), //your header height (10.625 is the %)
    flexDirection: "row",
  },
});
