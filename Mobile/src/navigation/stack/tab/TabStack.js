import React from "react";
import { createBottomTabNavigator } from "react-navigation-tabs";
import ChallengeSubscriptionStack from "../challengeSubscription/ChallengeSubscriptionStack";
import ProgressStack from "../progress/ProgressStack";
import Icon from "../../../components/Shared/Icon";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";
import DashboardStack from "../dashboard/DashboardStack";
import FeedStack from "../feed/FeedStack";
import FeedSvg from "../../../assets/icons/Feed";
import CalenderSvg from "../../../assets/icons/calender";
import SubSVG from "../../../assets/icons/subscriptionSVG";
import ProgressSvg from "../../../assets/icons/progress";
import TabBarComponent from "../../../components/Shared/TabBarComponent";
import ChallengeSvg from "../../../assets/icons/challengeSvg";
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
    Progress: { screen: ProgressStack },
  },
  {
    initialRouteName: "Lifestyle",
    tabBarComponent: (props) => <TabBarComponent {...props} />,
    defaultNavigationOptions: ({ navigation }) => ({
      header: null,
      title: getTabName(navigation.state.routeName),
      tabBarIcon: ({ focused }) => {
        const { routeName } = navigation.state;
        const activeState = colors.black;
        const inactiveState = colors.smoke;
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
              <FeedSvg
                  width={hp("2.5%")}
                  height={hp("2.5%")}
                  fill={focused ? activeState : inactiveState}
                  focused={focused}
              />
          );
        } else if (routeName === "Lifestyle") {
          icon = (
              <SubSVG
                  width={hp("2.5%")}
                  height={hp("2.5%")}
                  fill={focused ? activeState : inactiveState}
                  focused={focused}
              />
          );
        } else if (routeName === "Challenges") {
          icon = (
            <ChallengeSvg
              width={hp("2.5%")}
              height={hp("2.5%")}
              fill={focused ? activeState : inactiveState}
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
              <ProgressSvg
                  width={hp("2.5%")}
                  height={hp("2.5%")}
                  fill={focused ? activeState : inactiveState}
                  focused={focused}
              />
          );
        }
        return icon;
      },
    }),
    tabBarOptions: {
      activeTintColor: colors.black,
      inactiveTintColor: colors.black,
      style: {
        height: 60,
        borderTopWidth: 1,
        borderTopColor: colors.grey.light,
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
