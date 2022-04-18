import { COLLECTION_NAMES } from "../../../../library/collections/index"
import { getDocument } from "../../../../hook/firestore/read";
import { useStorage } from "../../../../hook/storage"
import { useState } from "react";

export const useCounter = () => {
  const [loading, setLoading] = useState(false)
  const [firstName, setFirstName] = useState(undefined)

  const getProfile = async () => {
    setLoading(true)
    const uid = await useStorage.getItem("uid");
    const userDoc = await getDocument(
      COLLECTION_NAMES.USERS,
      uid
    )

    if (!userDoc) {
      return undefined
    } else {
      setLoading(false)
      setFirstName(userDoc.firstName)
    }
  };

  return {
    loading,
    firstName,
    getProfile
  }
}