import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import globalStyle from "../../styles/globalStyles";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import RoundTick from "../../../assets/icons/RoundTick";

const { width } = Dimensions.get("window");
const containerPadding = 20;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: fonts.fontWeight,
    fontFamily: fonts.SimplonMonoLight,
    color: colors.black,
    letterSpacing: fonts.letterSpacing,
    marginStart: 15,
  },

  paragraph: {
    fontSize: 15,
    fontWeight: fonts.fontWeight,
    fontFamily: fonts.SimplonMonoMedium,
    color: colors.black,
    letterSpacing: fonts.letterSpacing,
    marginStart: 15,
  },

  container: {
    width: width - containerPadding * 2,
    height: 110,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});

class FitnessLevelCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.isCardColored) {
      return (
        <View
          style={(styles.container, { backgroundColor: this.props.cardColor })}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.container}
            onPress={this.props.onPress}
          >
            {this.props.showTick && (
              <View style={{ marginStart: 15 }}>
                <RoundTick />
              </View>
            )}
            {!this.props.showTick && <View style={{ marginStart: 15 }}></View>}
            <View>
              <Text style={styles.title}>{this.props.title} </Text>
              <Text style={styles.paragraph}>{this.props.helpText}</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <ImageBackground
        source={this.props.source}
        style={globalStyle.FT_ImageContainer}
        imageStyle={{ borderRadius: 5 }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={globalStyle.FT_InnerContainer}
          onPress={this.props.onPress}
        >
          {this.props.showTick && (
            <View style={{ marginStart: 15 }}>
              <RoundTick />
            </View>
          )}
          {!this.props.showTick && <View style={{ marginStart: 15 }}></View>}
          <View>
            <Text style={globalStyle.FT_Title}>{this.props.title} </Text>
            <Text style={globalStyle.FT_Paragraph}>{this.props.helpText}</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

export default FitnessLevelCard;
