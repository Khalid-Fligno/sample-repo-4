import React from "react";
import { View, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import FastImage from "react-native-fast-image";
import Icon from "../Shared/Icon";
import { db } from "../../../config/firebase";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { Image } from "react-native";

export default class ProfileButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      initials: undefined,
      avatar: null,
    };
  }
  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem("uid");
    if (uid) {
      this.unsubscribe = await db
        .collection("users")
        .doc(uid)
        .onSnapshot(async (doc) => {
          const profile = await doc.data();
          let initials =
            profile.firstName && profile.firstName.length > 0
              ? profile.firstName.substring(0, 1).toUpperCase()
              : "";
          initials +=
            profile.lastName && profile.lastName.length > 0
              ? profile.lastName.substring(0, 1).toUpperCase()
              : "";
          this.setState({
            initials: initials || undefined,
            avatar: profile.avatar,
          });
        });
    }
  };
  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  };
  render() {
    const { initials, avatar } = this.state;
    console.log("Profile....", initials);
    return (
      <View>
        {!avatar &&
          (initials !== undefined ? (
            <View style={styles.avatarOutline}>
              <View style={styles.tagCircle} key={initials}>
                <Text style={styles.tagText}>{initials}</Text>
              </View>
            </View>
          ) : (
            <Icon
              name="profile-solid"
              size={30}
              color={colors.themeColor.color}
            />
          ))}
        {avatar && (
          <Image
            source={{ uri: avatar }}
            style={styles.avatarBackdrop}
            resizeMode="cover"
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatarOutline: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarBackdrop: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grey.standard,
  },
  tagCircle: {
    height: 30,
    width: 30,
    marginRight: 5,
    borderWidth: 2.5,
    borderColor: colors.themeColor.color,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.themeColor.color,
  },
  tagText: {
    fontFamily: fonts.SimplonMonoMedium,
    fontSize: 10,
    color: colors.black,
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
