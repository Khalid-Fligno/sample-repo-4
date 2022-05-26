import React from "react";
import {
  Image,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import fonts from "../../../../styles/fonts";
import * as Haptics from "expo-haptics";

export const AllBlogScreen = ({ navigation }) => {

  const blogs = navigation.getParam("data", null)

  const openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };

  const blogDataComponent = ({ item }) => {

    return (
      <View
        style={{
          backgroundColor: "#333333"
        }}
      >
        <View
          style={{
            marginBottom: wp("10%"),
            flex: 1,
            alignItems: "center"
          }}
        >
          <View style={{ alignContent: "center", flex: 1 }}>
            <TouchableOpacity
              delayPressOut={3}
              onPress={() => openLink(item.urlLink)}
            >
              <View
                style={{
                  marginTop: 20,
                  alignItems: "center",
                  paddingLeft: 20,
                }}
              >
                <Image
                  style={{
                    overflow: "hidden",
                    width: 250,
                    height: 350,
                    borderRadius: 10,
                  }}
                  source={{
                    uri: item.coverImage,
                  }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    alignItems: "flex-start",
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: wp("4.5%"),
                      fontFamily: fonts.bold,
                      fontWeight: "800",
                      color: "white",
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      scrollEnabled={true}
      data={blogs}
      style={{ flex: 1 }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={(item) => blogDataComponent(item)}
    />
  )
}