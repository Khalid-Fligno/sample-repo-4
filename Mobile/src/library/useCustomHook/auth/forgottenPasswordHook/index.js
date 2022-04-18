
import { useState } from 'react';
import { auth } from '../../../../config/firebase';
import Toast from 'react-native-toast-message';

export const useCounter = () => {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const emailIsValid = (email) => {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  }

  const sendPasswordResetEmail = (email) => {
    setLoading(true)

    if (!email) {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Invalid email address entered.',
      });
    }

    if (email && emailIsValid(email)) {
      auth.sendPasswordResetEmail(email)
        .then(() => {
          setLoading(false)
          Toast.show({
            type: 'success',
            text1: 'Successful sent',
            text2: 'A password reset email has been sent to this email address.',
          });
        }).catch(() => {
          setLoading(false)
          Toast.show({
            type: 'error',
            text1: 'Account does not exist',
            text2: 'No account found with that email address.'
          });
        });
    } else {
      setLoading(false)
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
        text2: 'Pleae enter a valid email address.'
      });
    }
  }

  return {
    email,
    setEmail,
    loading,
    sendPasswordResetEmail
  }
}