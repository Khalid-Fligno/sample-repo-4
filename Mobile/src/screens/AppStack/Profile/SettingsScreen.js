import React from "react";
import {
  SafeAreaView,
  View,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as FileSystem from "expo-file-system";
import { ListItem } from "react-native-elements";
import { db, auth } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
import globalStyle from "../../../styles/globalStyles";
import ProfileStyles from "./ProfileStyles";
import moment from "moment";

export default class SettingsScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: false,
      isPasswordAccount: false,
    };
  }

  componentDidMount = async () => {
    this.fetchProfile();
    const { providerData } = auth.currentUser;
    providerData.forEach((profile) => {
      if (profile.providerId === "password") {
        this.setState({ isPasswordAccount: true });
      }
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    this.unsubscribe = db
      .collection("users")
      .doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            profile: await doc.data(),
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      });
  };

  changePasswordAlert = () => {
    Alert.alert(
      "Change Password",
      "A password reset link will be emailed to your nominated email address",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          onPress: () => this.sendPasswordResetEmail(),
        },
      ],
      { cancelable: false }
    );
  };

  sendPasswordResetEmail = () => {
    const { email } = this.state.profile;
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert("Your password reset email has been sent");
      })
      .catch((error) => {
        Alert.alert(error);
      });
  };

  resetProgressAlert = () => {
    Alert.alert(
      "Reset Progress Info",
      "Are you sure you want to reset initial Progress info?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => this.resetInitialProgress(),
        },
      ],
      { cancelable: false }
    );
  };

  resetInitialProgress = async () => {
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db.collection("users")
      .doc(uid)
    await userRef.update({
      initialProgressInfo: {
        date: moment().format("YYYY-MM-DD"),
      },
      currentProgressInfo: {
        date: moment().format("YYYY-MM-DD"),
      },
      initialBurpeeTestCompleted: false
    });
    Alert.alert("Your progress info has been reset");
  };

  retakeBurpeeTest = async () => {
    this.props.navigation.navigate("Burpee1");
  };

  render() {
    const { isPasswordAccount, profile, loading } = this.state;

    return (
      <SafeAreaView style={globalStyle.safeContainer}>
        <View style={[globalStyle.container, { paddingHorizontal: 0 }]}>
          <ScrollView contentContainerStyle={globalStyle.scrollView}>
            <View style={ProfileStyles.listContainer}>
              {
                isPasswordAccount && (
                  <ListItem
                    title="Change Password"
                    titleStyle={ProfileStyles.listItemTitleStyle}
                    containerStyle={ProfileStyles.listItemContainer}
                    rightIcon={{
                      name: "chevron-right",
                      color: colors.grey.standard,
                    }}
                    onPress={() => this.changePasswordAlert()}
                  />
                )
              }
              {
                profile && (
                  <ListItem
                    title="Reset initial progress info"
                    titleStyle={ProfileStyles.listItemTitleStyle}
                    disabled={profile && !profile.initialProgressInfo}
                    containerStyle={ProfileStyles.listItemContainer}
                    rightIcon={{
                      name: "chevron-right",
                      color: colors.grey.standard,
                    }}
                    onPress={() => this.resetProgressAlert()}
                  />
                )
              }
              <ListItem
                title="Re-take fitness test"
                titleStyle={ProfileStyles.listItemTitleStyle}
                containerStyle={ProfileStyles.listItemContainer}
                rightIcon={{
                  name: "chevron-right",
                  color: colors.grey.standard,
                }}
                onPress={() => this.retakeBurpeeTest()}
              />
              <ListItem
                title="Change the unit of measurements"
                titleStyle={ProfileStyles.listItemTitleStyle}
                containerStyle={ProfileStyles.listItemContainerBottom}
                rightIcon={{
                  name: "chevron-right",
                  color: colors.grey.standard,
                }}
                onPress={() => this.props.navigation.navigate("ChangeUnit")}
              />
            </View>
          </ScrollView>
          <Loader loading={loading} color={colors.charcoal.standard} />
        </View>
      </SafeAreaView>
    );
  }
}
