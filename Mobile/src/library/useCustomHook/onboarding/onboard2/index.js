import { useState } from "react";
import { db } from "../../../../config/firebase";
import { hasChallenges } from "../../../../utils/challenges";
import { useStorage } from "../../../../hook/storage";
import { navigate } from '../../../../navigation/rootNavigation'
import * as Haptics from "expo-haptics";

export const useCounter = () => {
  const [loading, setLoading] = useState(false)
  const [specialOffer, setSpeciaOffer] = useState(undefined)
  const [name, setName] = useState(null)

  const handleSubmit = async (fitnessLevel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true)

    try {
      const uid = await useStorage.getItem("uid");
      const userRef = db.collection("users").doc(uid);
      const userData = (await userRef.get()).data();
      const data = {
        fitnessLevel: fitnessLevel,
        onboarded: true,
      };
      await userRef.set(data, { merge: true });
      setLoading(false)

      if (
        userData.subscriptionInfo &&
        userData.subscriptionInfo.expiry > Date.now()
      ) {
        navigate("App");
      } else if (await hasChallenges(uid)) {
        navigate("App");
      } else {
        navigate("Subscription", {
          name,
          specialOffer,
        });
      }
    } catch (err) {
      console.log("Database write error: ", err)
      setLoading(false)
    }
  };

  return {
    loading,
    handleSubmit,
    setSpeciaOffer,
    setName
  }
}