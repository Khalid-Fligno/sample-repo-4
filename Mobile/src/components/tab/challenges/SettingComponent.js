import React from "react";
import Modal from "react-native-modal";
import ChallengeSetting from "../../Calendar/ChallengeSetting";

export const SettingComponent = (props) => {
  const {
    isSettingVisible,
    currentDay,
    activeChallengeUserData,
    activeChallengeData,
    isSchedule,
    navigation,
    fetchCalendarEntries,
    resetActiveChallengeUserData,
    completeCha,
    toggleSetting,
    ScheduleData
  } = props

  return (
    <Modal
      isVisible={isSettingVisible}
      coverScreen={true}
      style={{ margin: 0 }}
      animationIn="fadeInLeft"
      animationOut="fadeOutLeft"
      onBackdropPress={() => toggleSetting()}
    >
      <ChallengeSetting
        onToggle={() => toggleSetting()}
        currentDay={currentDay}
        activeChallengeUserData={activeChallengeUserData}
        activeChallengeData={activeChallengeData}
        isSchedule={isSchedule}
        ScheduleData={ScheduleData}
        navigation={navigation}
        fetchCalendarEntries={fetchCalendarEntries}
        resetActiveChallengeUserData={resetActiveChallengeUserData}
        completeCha={completeCha}
      />
    </Modal>
  );
}