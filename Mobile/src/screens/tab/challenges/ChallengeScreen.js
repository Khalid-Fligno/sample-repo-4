import moment from "moment";
import React, { useEffect } from "react"
import {
  View
} from "react-native";
import CustomCalendarStrip from "../../../components/Calendar/CustomCalendarStrip";
import globalStyle from "../../../styles/globalStyles";

export const ChallengeScreen = () => {

  const calendarStrip = React.createRef();

  const fetchCalendarEntries = () => {
    const selectedDate = calendarStrip.current.getSelectedDate();
    //Todo :call the function to get the data of current date
    handleDateSelected(selectedDate);
  };

  const handleDateSelected = (date) => {
    console.log('Date: ', date)
  }

  useEffect(() => {
    fetchCalendarEntries()
  }, [])

  return (
    <View style={[globalStyle.container, { paddingHorizontal: 0 }]}>
      <CustomCalendarStrip
        ref1={calendarStrip}
        onDateSelected={(date) => {
          handleDateSelected(date);
        }}
        CalendarSelectedDate={moment.isDate()}
      />
      {/* {isSchedule && !showRC && !loading && (
        <View style={{ margin: wp("5%") }}>
          <Text style={calendarStyles.scheduleTitleStyle}>
            {ScheduleData.displayName}
          </Text>
          <Text style={calendarStyles.scheduleTextStyle}>
            Your challenge will start from{" "}
            {moment(ScheduleData.startDate).format("DD MMM YYYY")}
          </Text>
          <Text style={calendarStyles.scheduleTextStyle}>
            You can change this in settings
          </Text>
        </View>
      )}
      {skipped && (
        <OnBoardingNotification
          navigation={navigation}
          data={activeChallengeUserData}
        />
      )}
      <DayDisplayComponent/>
      {setting}
      <Loader loading={loading} color={colors.red.standard} />
      <Loader
        progressive={true}
        loading={loadingExercises}
        downloaded={downloaded}
        totalToDownload={totalToDownload}
        color={colors.red.standard}
      /> */}
    </View>
  );
}