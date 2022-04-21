import React, { useState } from "react";
import { Text, View } from "react-native";
import colors from "../../../styles/colors";
import fonts from "../../../styles/fonts";

export const ProgressComponent = (
  activeChallengeData,
  currentChallengeDay,
  transformLevel
) => {
  const [width, setWidth] = useState()

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <View
          style={{
            borderRadius: 3,
            backgroundColor: "rgba(0,0,0,0.1)",
            padding: 5,
            borderBottomColor: "rgba(0,0,0,0.1)",
            borderBottomWidth: 2,
          }}
        >
          <Text
            style={{
              color: "#656565",
              fontFamily: fonts.bold,
            }}
          >
            Day 1
          </Text>
        </View>
        <View
          style={{
            borderRadius: 3,
            backgroundColor: "rgba(0,0,0,0.1)",
            padding: 5,
            borderBottomColor: "rgba(0,0,0,0.1)",
            borderBottomWidth: 2,
          }}
        >
          <Text
            style={{
              color: "#656565",
              fontFamily: fonts.bold,
            }}
          >
            Day {activeChallengeData.numberOfDays}
          </Text>
        </View>
      </View>
      <View
        onLayout={(e) => {
          const newWidth = e.nativeEvent.layout.width;
          setWidth(newWidth);
        }}
        style={{
          height: 10,
          backgroundColor: "rgba(0,0,0,0.1)",
          borderRadius: 10,
          overflow: "hidden",
          marginTop: 10,
        }}
      >
        <View
          style={{
            height: 10,
            width:
              (width * currentChallengeDay) /
              activeChallengeData.numberOfDays,
            borderRadius: 10,
            backgroundColor: colors.themeColor.fill,
            position: "absolute",
            left: 0,
            top: 0,
          }}
        ></View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 60,
        }}
      >
        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 3,
            borderBottomColor: "rgba(0,0,0,0.1)",
            borderBottomWidth: 1,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
            }}
          >
            {transformLevel + " "}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: fonts.bold,
          }}
        >
          {getPhase(this.phaseData)}
        </Text>
      </View>
      <View style={{ marginTop: 20, flex: 1 }}>
        <TouchableOpacity
          phase={this.phase}
          onPress={() => this.openLink(this.phase.pdfUrl)}
        >
          <View style={{ flex: 1 }}>
            <Icon name="file-text-o" size={20} />
          </View>

          <View style={{ marginTop: -20 }}>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fonts.bold,
                paddingLeft: 25,
              }}
            >
              Phase guide doc
            </Text>
          </View>
          <View style={{ marginTop: -20 }}>
            <View style={{ paddingLeft: 20, alignItems: "flex-end" }}>
              <Icon name="arrow-right" size={18} />
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                borderBottomColor: "#cccccc",
                borderBottomWidth: 1,
                width: "100%",
              }}
            ></View>
          </View>
        </TouchableOpacity>
      </View>
      <View
        elevation={5}
        style={{
          position: "absolute",
          left:
            Platform.OS === "ios"
              ? (width * this.currentChallengeDay) /
              activeChallengeData.numberOfDays +
              11
              : (width * this.currentChallengeDay) /
              activeChallengeData.numberOfDays +
              12,
          top: 85,
        }}
      >
        <Svg
          id="prefix__Layer_1"
          viewBox="0 0 110 90"
          xmlSpace="preserve"
          width={hp("1.5%")}
          height={hp("1.5%")}
          fill={colors.themeColor.fill}
          style={{
            strokeWidth: 50,
            stroke: colors.themeColor.fill,
            strokeLinejoin: "round",
            strokeLinecap: "round",
          }}
        >
          <Path className="prefix__st0" d="M 55 46 L 87 90 L 22 90 z" />
        </Svg>
      </View>
      <View
        elevation={5}
        style={{
          position: "absolute",
          left:
            Platform.OS === "ios"
              ? (width * this.currentChallengeDay) /
              activeChallengeData.numberOfDays -
              7
              : (width * this.currentChallengeDay) /
              activeChallengeData.numberOfDays -
              7,
          top: Platform.OS === "ios" ? 96 : 94,
          backgroundColor: "#F79400",
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          borderRadius: 8,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.GothamMedium,
            color: "white",
            fontSize: 25,
          }}
        >
          {this.currentChallengeDay}
        </Text>
      </View>
    </>
  )
}