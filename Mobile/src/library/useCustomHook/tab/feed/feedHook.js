import { useState } from "react";
import { isActiveChallenge } from "../../../../utils/challenges";
import AsyncStorage from "@react-native-community/async-storage";
import { 
  getCollection,
  getDocument, 
  getSpecificCollection 
} from "../../../../hook/firestore/read/index";
import { COLLECTION_NAMES } from "../../../collections/index"
import moment from "moment";
import { navigate } from "../../../../navigation/rootNavigation"

export const useCounter = () => {
  const [loading, setLoading] = useState(false)
  const [activeUserChallengeData, setActiveUserChallengeData] = useState([])
  const [trainerData, setTrainerData] = useState([])

  const navigateToTrainers = (item) => {
    navigate("Trainers", {
      name: item.name,
      title: item.title,
      about: item.about,
      profile: item.profile,
      id: item.id,
      coverImage: item.coverImage,
    })
  }

  const getProfileTrainers = async () => {
    const snapshot = await getCollection(
      COLLECTION_NAMES.TRAINERS
    )

    if (snapshot) {
      return snapshot.docs.map((res) => res.data())
    } else {
      return undefined
    }
  };

  const getBlogsData = async (phaseTag) => {
    const blogsRef = await getSpecificCollection(
      COLLECTION_NAMES.BLOGS,
      "tags",
      phaseTag,
      "array-contains"
    )

    if (blogsRef) {
      return blogsRef.docs.map((res) => res.data());
    } else {
      return undefined;
    }
  }

  const getActiveUser = async () => {
    const uid = await AsyncStorage.getItem("uid");
    const userRef = await getDocument(
      COLLECTION_NAMES.USERS,
      uid
    )

    if (userRef) {
      return userRef
    } else {
      return undefined;
    }
  }

  const getCurrentPhase = (data, currentDate1) => {
    let phase = undefined;
    
    data.forEach((el) => {
      let currentDate = moment(currentDate1).format("YYYY-MM-DD");
      const isBetween = moment(currentDate).isBetween(
        el.startDate,
        el.endDate,
        undefined,
        "[]"
      );
  
      if (isBetween) {
        phase = el;
      } else {
        phase = el;
      }
    });

    return phase;
  };

  const getActiveUserChallengeData = async () => {
    const activeUserChallengeData = await isActiveChallenge()
    const stringDate = moment().format("YYYY-MM-DD").toString();
    const activeUserData = await getActiveUser()
    setLoading(true)

    if (!activeUserChallengeData && activeUserData) {
      setLoading(false)
      console.log('NO ACTIVE USER CHALEENGE DATA')
      const tag = activeUserData.subscriptionInfo?.blogsId

      try {
        const blogsData = await getBlogsData(tag)
        const trainerData = await getProfileTrainers()

        if (blogsData || trainerData) {
          setLoading(false)
          setActiveUserChallengeData(blogsData)
          setTrainerData(trainerData)
        } else {
          setLoading(false)
          console.log('NO DATA')
        }

      } catch {
        setLoading(false)
        console.log('Error: ', err)
      }
    }

    if (activeUserChallengeData.status === "Active") {
      console.log('ACTIVE CHALLENGE')
      const phases = activeUserChallengeData.phases
      const tag = activeUserChallengeData?.tag
      //TODO :getCurrent phase data
      const currentPhase = getCurrentPhase(
        phases,
        stringDate
      );
      let data = currentPhase.displayName;
      let phase = data.toLowerCase();
      let phaseTag = phase.concat("-", tag);

      try {
        const blogsData = await getBlogsData(phaseTag)
        const trainerData = await getProfileTrainers()

        if (blogsData || trainerData) {
          setLoading(false)
          setActiveUserChallengeData(blogsData)
          setTrainerData(trainerData)
        } else {
          setLoading(false)
          console.log('NO DATA')
        }
      } catch (err) {
        setLoading(false)
        console.log('Error: ', err)
      }
    }
  }

  return {
    loading,
    activeUserChallengeData,
    trainerData,
    navigateToTrainers,
    getActiveUserChallengeData
  }
}