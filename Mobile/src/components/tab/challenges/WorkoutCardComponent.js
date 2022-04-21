// export const WorkoutCardComponent = (
//   todayRcWorkout,
//   showRC
// ) => {

//   return todayRcWorkout && showRC ? (
//     <>
//       <Text style={calendarStyles.headerText}>Today's Workout</Text>
//       <View style={calendarStyles.listContainer}>
//         <ChallengeWorkoutCard
//           onPress={() =>
//             todayRcWorkout.name && todayRcWorkout.name !== "rest"
//               ? this.loadExercises(todayRcWorkout, this.currentChallengeDay)
//               : ""
//           }
//           res={todayRcWorkout}
//           currentDay={this.currentChallengeDay}
//           title={activeChallengeData.displayName}
//         />
//       </View>
//     </>
//   ) : showRC ? (
//     <>
//       <Text style={calendarStyles.headerText}>Today's Workout</Text>
//       <View style={calendarStyles.listContainer}>
//         <ChallengeWorkoutCard
//           onPress={() => null}
//           res={""}
//           currentDay={this.currentChallengeDay}
//           title={activeChallengeData.displayName}
//         />
//       </View>
//     </>
//   ) : null;
// }