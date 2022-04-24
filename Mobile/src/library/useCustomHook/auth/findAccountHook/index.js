import { useState } from 'react';
import { getSpecificCollection } from '../../../../hook/firestore/read';
import { navigate } from "../../../../navigation/rootNavigation";
import { COLLECTION_NAMES } from '../../../collections';
import { FIELD_NAME } from '../../../fieldName';
import Toast from 'react-native-toast-message';

export const useCounter = () => {
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(false)

  const getUserInfo = async (email) => {
    setLoading(true)
    const userDatas = await getSpecificCollection(
      COLLECTION_NAMES.USERS,
      FIELD_NAME.EMAIL,
      email,
      "=="
    );
    const userData = userDatas.docs[0].data()

    if (!userData?.id) {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'That email address is invalid.',
      });
    } else {
      setLoading(false)
      navigate('Signup', { userData })
    }
  }

  return {
    email,
    setEmail,
    loading,
    getUserInfo
  }
}