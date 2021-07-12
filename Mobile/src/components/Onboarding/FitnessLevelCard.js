import React, { Component } from "react";
import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import globalStyle from "../../styles/globalStyles";
import RoundTick from "../../../assets/icons/RoundTick";

class FitnessLevelCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
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
