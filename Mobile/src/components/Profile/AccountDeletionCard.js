
import { StyleSheet, View, Platform, Text, TextInput, Dimensions } from "react-native"
import React, { useState } from "react";
import fonts from "../../styles/fonts";
import CustomBtn from "../Shared/CustomBtn";
import { auth, db, storage } from "../../../config/firebase";
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

    const store = Platform.select({
        ios: "Apple",
        android: "Google Play"
    })

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
        return storage.ref()
          .child("user-photos")
          .child(uid)
          .listAll() // Get all file in the `user-photos/uid` path
          .then(files => Promise.all(files.items.map(f => f.delete()))) // Delete all the users photos
          .then(_ => true)
          .catch(error => {
            // Check Error to see if there was no files to begin with,
            // https://firebase.google.com/docs/storage/web/handle-errors
            if (error.code == "storage/object-not-found") return true
            throw error
          })
      }
  
      // Bonus, implementation
      function deleteMailSubscription() {
        // https://developers.klaviyo.com/en/reference/request-deletion
      }

      reauthenticate = (currentPassword) => {
        var user = auth.currentUser
        var credential = require('firebase').auth.EmailAuthProvider.credential(
          auth.currentUser.email, 
          currentPassword)
        return user.reauthenticateWithCredential(credential);
      }

      try {
        const userCredentials = await reauthenticate(password)
        const uid = userCredentials.user.uid

        // Perform background deletion request
        const _ = await Promise.all([
          deleteFireStoreData(uid),
          deleteStorageData(uid)
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
        default:
          return "Unexpected error, please try again"
      }
    }

    const errorMessage = userlocalisedError()
    const actionIsDisablesd = isLoading || password.trim().length == 0

    return (
      <Modal
        avoidKeyboard={true}
        isVisible={isVisible}
        onBackdropPress={cancelAction()}
        onBackButtonPress={cancelAction()}
        onModalHide={resetState}>
          <View style={styles.modalView}>
              <Text style={styles.modalTitleText}>Delete account</Text>
              <Text style={styles.modalText}>
                  Deleting your account is permanent. When you delete your FitazFK account, 
                  you won't be able to retrieve the contents generated or provided by FitazFK. 
                  Any subscriptions made via {store} will need to be manually suspended.
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
                    clearTextOnFocus
                    onFocus={ () => setPassword("") }/>

              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text> } 
      
              <CustomBtn
                Title="Delete my account!"
                disabled={actionIsDisablesd}
                loading={isLoading} // Integrate with deletion action
                customBtnStyle={styles.buttonState(actionIsDisablesd)}
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
    buttonState: (disabled) => [
      {
        opacity: disabled ? 0.2 : 1,
        width: wp("60%"),
        marginTop: 16
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
    }
  });