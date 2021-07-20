import React from "react";
import { View } from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import calendarStyles from "../../screens/AppStack/Calendar/calendarStyle";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import Icon from "../Shared/Icon";

const CustomCalendarStrip = (props) => {
  const { ref1, onDateSelected, CalendarSelectedDate } = props;
  return (
    <View style={calendarStyles.calendarStripContainer}>
      <CalendarStrip
        ref={ref1}
        maxDayComponentSize={50}
        onDateSelected={onDateSelected}
        selectedDate={CalendarSelectedDate}
        daySelectionAnimation={{
          type: "border",
          duration: 400,
          highlightColor: "transparent",
          borderWidth: 2,
          borderHighlightColor: colors.themeColor.color,
        }}
        style={calendarStyles.calendarStrip}
        calendarHeaderStyle={calendarStyles.calendarStripHeader}
        calendarColor="transparent"
        dateNumberStyle={{
          fontFamily: fonts.SimplonMonoMedium,
          color: colors.black,
        }}
        dateNameStyle={{
          fontFamily: fonts.SimplonMonoMedium,
          color: colors.black,
        }}
        highlightDateNumberStyle={{
          fontFamily: fonts.SimplonMonoMedium,
          color: colors.black,
        }}
        highlightDateNameStyle={{
          fontFamily: fonts.SimplonMonoMedium,
          color: colors.black,
        }}
        weekendDateNameStyle={{
          fontFamily: fonts.bold,
          color: colors.grey.standard,
        }}
        weekendDateNumberStyle={{
          fontFamily: fonts.bold,
          color: colors.grey.standard,
        }}
        iconContainer={{
          flex: 0.15,
        }}
        leftSelector={
          <Icon name="chevron-left" size={17} color={colors.themeColor.color} />
        }
        rightSelector={
          <Icon
            name="chevron-right"
            size={17}
            color={colors.themeColor.color}
          />
        }
      />
    </View>
  );
};
export default CustomCalendarStrip;
