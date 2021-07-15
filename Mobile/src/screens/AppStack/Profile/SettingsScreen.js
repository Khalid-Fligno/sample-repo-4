import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as FileSystem from "expo-file-system";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import { db, auth } from "../../../../config/firebase";
import Loader from "../../../components/Shared/Loader";
import colors from "../../../styles/colors";
// import fonts from '../../../styles/fonts';
import globalStyle from "../../../styles/globalStyles";
import ProfileStyles from "./ProfileStyles";

const { width } = Dimensions.get("window");

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
      "Are you sure?",
      "This will clear your progress photos and measurements",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          onPress: () => this.resetInitialProgress(),
        },
      ],
      { cancelable: false }
    );
  };
  resetInitialProgress = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db.collection("users").doc(uid);
    await userRef.update({
      initialProgressInfo: firebase.firestore.FieldValue.delete(),
      currentProgressInfo: firebase.firestore.FieldValue.delete(),
    });
    Alert.alert("Your progress info has been reset");
    this.setState({ loading: false });
  };
  retakeBurpeeTest = async () => {
    this.setState({ loading: true });
    await FileSystem.downloadAsync(
      "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE.mp4?alt=media&token=ff7a5afd-58d2-4508-9cd0-49af7672e333",
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`
    );
    this.setState({ loading: false });
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
                // Only show password change if an email/password account is present
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
                // Only show password change if an email/password account is present
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
                title="Re-take burpee test"
                titleStyle={ProfileStyles.listItemTitleStyle}
                containerStyle={ProfileStyles.listItemContainerBottom}
                rightIcon={{
                  name: "chevron-right",
                  color: colors.grey.standard,
                }}
                onPress={() => this.retakeBurpeeTest()}
              />
            </View>
          </ScrollView>
          <Loader loading={loading} color={colors.charcoal.standard} />
        </View>
      </SafeAreaView>
    );
  }
}
