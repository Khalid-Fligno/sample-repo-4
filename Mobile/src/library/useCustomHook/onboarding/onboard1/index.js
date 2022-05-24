import { useState } from "react"
import * as Haptics from "expo-haptics";
import { useStorage } from '../../../../hook/storage'
import { addDocument } from '../../../../hook/firestore/write'
import { COLLECTION_NAMES } from '../../../collections/index'
import { navigate } from '../../../../navigation/rootNavigation'
import moment from "moment-timezone"

export const useCounter = () => {
  const [loading, setLoading] = useState(false)
  const [chosenDate, setChosenDate] = useState(null)
  const [dobModalVisible, setDobModalVisible] = useState(false)
  const [chosenUom, setChosenUom] = useState("metric")
  const [specialOffer, setSpeciaOffer] = useState(undefined)
  const [name, setName] = useState(null)

  const setDate = async (event, selectedDate) => {
    const currentDate = selectedDate;
    setChosenDate(currentDate ? currentDate : new Date(1990, 0, 1))
  };

  const handleSubmit = async (chosenDate, chosenUom) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true)
    try {
      const resChosenDate = chosenDate ?
        chosenDate : new Date(1990, 0, 1)
      const dob = moment(resChosenDate).format("YYYY-MM-DD");
      const uid = await useStorage.getItem("uid");
      const data = {
        dob,
        unitsOfMeasurement: chosenUom,
        totalWorkoutCompleted: 0,
        weeklyTargets: {
          currentWeekStartDate: moment().startOf("week").format("YYYY-MM-DD"),
          resistanceWeeklyComplete: 0,
          hiitWeeklyComplete: 0,
          strength: 0,
          circuit: 0,
          interval: 0,
        },
      };
      const setUserData = await addDocument(
        COLLECTION_NAMES.USERS,
        uid,
        data
      )

      if (setUserData) {
        setLoading(false)
        navigate("Onboarding2", {
          name,
          specialOffer,
        });
      }

    } catch (err) {
      console.log("Database write error", err);
      setLoading(false)
    }
  };

  const toggleDobModal = () => {
    setDobModalVisible(true)
  };

  const closeDobModal = () => {
    setDobModalVisible(false)
  };

  return {
    loading,
    chosenDate,
    dobModalVisible,
    chosenUom,
    setChosenUom,
    setDate,
    handleSubmit,
    toggleDobModal,
    closeDobModal,
    setSpeciaOffer,
    setName
  };
}