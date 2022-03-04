import React from "react";
import {
  Image,
  View,
  Text,
  ScrollView,
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

export default class AllBlogs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      blogs: [],
    };
  }

  onFocusFunction() {
    this.setState({
      blogs: this.props.navigation.getParam("data", null),
    });
  }

  componentDidMount() {
    this.onFocusFunction();
  }

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  };

  render() {
    const { blogs } = this.state;

    return (
      <ScrollView style={{ backgroundColor: "#333333" }}>
        <View
          style={{ marginBottom: wp("10%"), flex: 1, alignItems: "center" }}
        >
          <View style={{ alignContent: "center", flex: 1 }}>
            <FlatList
              data={blogs}
              style={{ flex: 1 }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    delayPressOut={3}
                    onPress={() => this.openLink(item.urlLink)}
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
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
