import React from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  View
} from "react-native";
import calendarStyles from "../../../screens/AppStack/Calendar/calendarStyle";
import { ProgressComponent } from "./ProgressComponent";
// import { MealListComponent } from "./MealListComponent";
// import { ProgressComponet } from "./ProgressComponent";
// import { WorkoutCardComponent } from "./WorkoutCardComponent";

export const DayDisplayComponent = (props) => {
  const {
    phase,
    phaseData,
    showRC,
    activeChallengeData,
    currentChallengeDay,
    transformLevel
  } = props

  return (
    <ScrollView
      contentContainerStyle={calendarStyles.dayDisplayContainer}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
    >
      {phaseData && showRC && (
        <View
          style={{
            paddingVertical: 20,
            width: Dimensions.get("window").width,
            paddingHorizontal: 20,
          }}
        >
          <ProgressComponent
            activeChallengeData={activeChallengeData}
            currentChallengeDay={currentChallengeDay}
            transformLevel={transformLevel}
            phaseData={phaseData}
            phase={phase}
          />
        </View>
      )}
      {/* <WorkoutCardComponent/>
      <MealListComponent/> */}
    </ScrollView>
  );
}