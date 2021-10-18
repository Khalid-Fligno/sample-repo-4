import React from "react";
import { createBottomTabNavigator, BottomTabBar } from "react-navigation-tabs";
import ChallengeSubscriptionStack from "./ChallengeSubscriptionStack";
import CalendarStack from "./CalendarStack";
import ProgressStack from "./ProgressStack";
import Icon from "../../src/components/Shared/Icon";
import colors from "../../src/styles/colors";
import { tabColorMap } from "./utils";
import {
  Image,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";
import fonts from "../../src/styles/fonts";
import DashboardStack from "./DashboardStack";
import FeedStack from "./FeedStack";
import FeedSvg from "../../assets/icons/Feed";
import CalenderSvg from "../../assets/icons/calender";
import SubSVG from "../../assets/icons/subscriptionSVG";
import ProgressSvg from "../../assets/icons/progress";
import TabBarComponent from "../../src/components/Shared/TabBarComponent";
import ChallengeSvg from "../../assets/icons/challengeSvg";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const getTabName = (routeName) => {
  if (routeName == "Challenges") {
    return "Transform";
  } else if (routeName == "Progress") {
    return "You";
  } else return routeName;
};

const TabStack = createBottomTabNavigator(
  {
    Feed: FeedStack,
    Lifestyle: DashboardStack,
    Challenges: {
      screen: ChallengeSubscriptionStack,
    },
    // Calendar: CalendarStack,
    Progress: { screen: ProgressStack },
  },
  {
    initialRouteName: "Lifestyle",
    tabBarComponent: (props) => <TabBarComponent {...props} />, //remember to import it,
    defaultNavigationOptions: ({ navigation }) => ({
      header: null,
      title: getTabName(navigation.state.routeName),
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const activeState = colors.black;
        const inactiveState = colors.smoke;
        // const inactiveState = colors.charcoal.standard;
        let icon;
        if (routeName === "Home") {
          icon = (
            <Icon
              name={"home-outline"}
              size={hp("2.5%")}
              color={focused ? activeState : inactiveState}
            />
          );
        }
        if (routeName === "Feed") {
          icon = (
            // <FeedSvg
            //   width={hp("3%")}
            //   height={hp("3%")}
            //   fill={focused ? activeState : inactiveState}
            // />
              <FeedSvg
                  width={hp("2.5%")}
                  height={hp("2.5%")}
                  focused={focused}
              />
          );
        } else if (routeName === "Lifestyle") {
          icon = (
            // <SubSVG
            //   width={hp("2.5%")}
            //   height={hp("2.5%")}
            //   fill={focused ? activeState : inactiveState}
            // />
              <SubSVG
                  width={hp("2.5%")}
                  height={hp("2.5%")}
                  focused={focused}
              />
          );
        } else if (routeName === "Challenges") {
          icon = (
            // <ChallengeSvg
            //   width={hp("2.5%")}
            //   height={hp("2.5%")}
            //   fill={focused ? activeState : inactiveState}
            // />
            <ChallengeSvg
              width={hp("2.5%")}
              height={hp("2.5%")}
              focused={focused}
            />
          );
        } else if (routeName === "Calendar") {
          icon = (
            <CalenderSvg
              width={hp("2.5%")}
              height={hp("2.5%")}
              fill={focused ? activeState : inactiveState}
            />
          );
        } else if (routeName === "Progress") {
          icon = (
            // <ProgressSvg
            //   width={hp("2.5%")}
            //   height={hp("2.5%")}
            //   fill={focused ? activeState : inactiveState}
            // />
              <ProgressSvg
                  width={hp("2.5%")}
                  height={hp("2.5%")}
                  focused={focused}
              />
          );
        }
        return icon;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.black,
      // inactiveTintColor: colors.smoke,
      inactiveTintColor: colors.black,
      style: {
        // shadowColor: colors.charcoal.standard,
        // shadowOffset: { width: 0, height: -1 },
        // shadowOpacity: 0.3,
        // shadowRadius: 2,
        // borderTopWidth: 0,
        height: 60,
        borderTopWidth: 1,
        borderTopColor: colors.grey.light,
        // backgroundColor: colors.themeColor.footerBackgroundColor,
      },
      labelStyle: {
        fontFamily: fonts.StyreneAWebRegular,
        textTransform: "uppercase",
        paddingBottom: 4,
        fontSize: hp("1.1%"),
      },
    },
  }
);

export default TabStack;
