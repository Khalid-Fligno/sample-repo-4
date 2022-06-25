
import { StyleSheet, View, Platform, Text, TextInput, TouchableOpacity } from "react-native"
import React, { useState } from "react";
import fonts from "../../styles/fonts";
import CustomBtn from "../Shared/CustomBtn";
import Icon from "../Shared/Icon";

import { auth, db, storage } from "../../config/firebase";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Modal from "react-native-modal";
import colors from "../../styles/colors";

export default function AccountDeletionCard({isVisible, onCancel, onSuccess}) {

    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    function resetState() {
      setPassword("")
      setIsLoading(false)
      setError(null)
    }

    async function deleteAccount() {

      // Update states
      setIsLoading(true)
      setError(null)
  
      async function deleteFireStoreData(uid) {
        const userRef = db
          .collection("users")
          .doc(uid)
  
        // Get all subcollections for this user
        // and flatten it to get all the refs for its documents
        // Return an array of those DocumentReference
        return Promise.all([
          userRef.collection("challenges").get(),
          userRef.collection("calendarEntries").get()
        ])
        .then(subCollections => {
          const batch = db.batch()
          subCollections
            .forEach(collection => collection.forEach(e => batch.delete(e.ref)))
          
          // Delete user data
          batch.delete(userRef)

          // Start batch deletion of all the users documents
          return batch.commit()
        })
        .then(_ => true)
      }
  
      async function deleteStorageData(uid) {

        // This exists because Reac-Native 0.63.2, does not have Promoise.allSettled
        // It is available in 0.64.0+, please remove this and change below to Promise.allSettled
        // when we update to a newer version of React-Native
        const allSettled = (promises) => {
          return Promise.all(promises.map(promise => promise
              .then(value => ({ status: 'fulfilled', value }))
              .catch(reason => ({ status: 'rejected', reason }))
          ));
        }

        return storage.ref()
          .child("user-photos")
          .child(uid)
          .listAll() // Get all file in the `user-photos/uid` path
          .then(files => allSettled(files.items.map(f => f.delete()))) // Delete all the users photos
          .then(result => {
              const failedFileDeletions = result.filter(r => {
                switch (r.status) {
                  case "fulfilled": 
                    return false
                  case "rejected":
                    // Check Error to see if there was no files to begin with,
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    return r.reason.error.code != "storage/object-not-found"
                }
              })
              .map(r => r.reason.error.code)

              // If we have any valid reason
              if (failedFileDeletions.length > 0) throw { code: [...new Set(failedFileDeletions)].join(', ') }
              return true
          })
      }
  
      // Bonus, implementation
      function deleteMailSubscription() {

        // https://developers.klaviyo.com/en/reference/request-deletion
        const options = {
          method: 'POST',
          headers: {
            'Accept': 'application/json', 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email: auth.currentUser.email})
        };
        
        return fetch('https://a.klaviyo.com/api/v2/data-privacy/deletion-request?api_key=pk_1d7c9e7b4fbc006231b653c80218a3a2b8', options)
          .then(response => true)
      }

      function reauthenticate(currentPassword) {
        var user = auth.currentUser
        var credential = require('firebase').auth.EmailAuthProvider.credential(
          user.email, 
          currentPassword)
        return user.reauthenticateWithCredential(credential)
      }

      try {
        const userCredentials = await reauthenticate(password)
        const uid = userCredentials.user.uid

        // Perform background deletion request
        const _ = await Promise.all([
          deleteFireStoreData(uid),
          deleteStorageData(uid),
          deleteMailSubscription()
        ])

        // Lets remove them from our authentication
        await auth.currentUser.delete()
      } catch(error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    // We only want to pass cancel action when we are not loading the screen,
    // Else the modal could dissapear, whilst it is deleting the user
    function cancelAction() {
      if(isLoading) {
        return null
      }
      return onCancel
    }

    function userlocalisedError() {
      if(error == null) {
        return null
      }

      switch (error.code) {
        case "auth/wrong-password":
          return "This password is invalid for the signed in user"
        case "auth/too-many-requests":
          return error.message
        default:
          return "Unexpected error, please try again"
      }
    }

    const errorMessage = userlocalisedError()
    const actionIsDisablesd = password.trim().length == 0

    return (
      <Modal
        avoidKeyboard={true}
        isVisible={isVisible}
        onBackdropPress={cancelAction()}
        onBackButtonPress={cancelAction()}
        onModalHide={resetState}>
          <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton} 
                onPress={cancelAction()}>
                  <Icon
                    name="cross"
                    color={colors.black}
                    size={22}/>
              </TouchableOpacity>
              {/* </View> */}
              <Text style={styles.modalTitleText}>Delete account</Text>
              <Text style={styles.modalText}>
                Deleting your account is permanent. When you delete your Fitaz app account, 
                you will no longer be able to login and access the app. Any Transform challenges 
                and all of your data (measurements, workouts completed, photos) will be lost. 
                You will also need to suspend any Lifestyle subscriptions made via the Apple or Google Play app stores yourself if this applies.
              </Text>
              <TextInput
                    editable={!isLoading}
                    style={styles.inputField}
                    placeholder="Enter password"
                    returnKeyType="done"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                    autoCapitalize='none'
                    textContentType="password"
                    textAlign="center"
                    clearTextOnFocus
                    onFocus={ () => setPassword("") }/>

              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text> } 
      
              <CustomBtn
                Title="Delete my account!"
                disabled={isLoading || actionIsDisablesd}
                loading={isLoading} // Integrate with deletion action
                customBtnStyle={styles.buttonState(isLoading, actionIsDisablesd)}
                onPress={deleteAccount}
                customBtnTitleStyle={{ letterSpacing: fonts.letterSpacing }} />
        </View>
      </Modal>
    )
}
 
const styles = StyleSheet.create({
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    buttonState: (isLoading, isDisabled) => [
      {
        opacity: isDisabled && !isLoading ? 0.2 : 1,
        width: wp("60%"),
        marginTop: 16,
        backgroundColor: colors.bloodOrange
      }
    ],
    modalTitleText: {
      marginBottom: 16,
      textAlign: "center",
      fontSize: hp('2%'),
      fontFamily: fonts.bold
    },
    modalText: {
      fontSize: hp('1.5%'),
      marginBottom: 16,
      textAlign: "center",
      fontFamily: fonts.bold
    },
    inputField: {
      padding: 8,
      marginBottom: 16,
      borderWidth: 1,
      fontSize: hp('2%'),
      height: hp("5%"),
      alignItems: "center",
      fontFamily: fonts.SimplonMonoMedium,
      alignSelf: "stretch",
      width: "auto"
	  },
    errorText: {
      color: colors.red.standard,
      fontFamily: fonts.GothamMedium,
      marginBottom: 16,
      textAlign: "center"
    },
    closeButton: {
      alignSelf: "flex-end"
    }
  });