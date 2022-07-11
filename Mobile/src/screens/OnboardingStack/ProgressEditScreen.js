import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { containerPadding } from "../../styles/globalStyles";
import { Icon } from 'react-native-elements'
import * as FileSystem from "expo-file-system";
import { IMAGE } from '../../library/images';

const { width } = Dimensions.get("window");

const ProgressEditScreen = ({ navigation }) => {

  const {
    isInitial,
    initialProgressInfo,
    currentProgressInfo,
    photoExist2
  } = navigation.state.params

  const navigateToBurpee = async (isInitial, photoExist, photoExist2) => {
    if (photoExist || photoExist2) {
      await FileSystem.downloadAsync(
        "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE%20(2).mp4?alt=media&token=9ae1ae37-6aea-4858-a2e2-1c917007803f",
        `${FileSystem.cacheDirectory}exercise-burpees.mp4`
      );

      navigation.navigate("Burpee1", {
        isInitial: isInitial,
        navigateTo: "Progress",
        updateBurpees: true,
        photoExist2: photoExist || photoExist2
      });
    } else {
      if (isInitial) {
        Alert.alert("Add a Before Photo first to retake your Burpee Test");
      } else {
        Alert.alert("Add a Progress Photo first to retake your Burpee Test");
      }
    }
  }

  const retakeBurpeeTest = async (
    isInitial,
    initialProgressInfo,
    currentProgressInfo,
    photoExist2
  ) => {

    const isCurrentPhotoExist = currentProgressInfo?.photoURL
    const isInitialPhotoExist = initialProgressInfo?.photoURL

    if (isInitial) {
      await navigateToBurpee(isInitial, isInitialPhotoExist, photoExist2)
    } else {
      await navigateToBurpee(isInitial, isCurrentPhotoExist, photoExist2)
    }
  };

  return (
    <View
      style={[{ flex: 1, flexDirection: "column" }]}
    >
      <View style={{ padding: 20 }}>
        <Text style={styles.headerText}>
          {isInitial ?
            'View/Edit Before' :
            'View/Edit Progress'
          }
        </Text>
      </View>
      <View
        style={{
          flex: 2,
          flexDirection: "column",
          marginHorizontal: 10,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 5,
            paddingHorizontal: containerPadding,
            justifyContent: 'center',
            backgroundColor: "#DEDBDB",
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.navigate("Progress2", {
              initialProgressInfo: initialProgressInfo,
              currentProgressInfo: currentProgressInfo,
              isInitial: isInitial,
              progressEdit: true
            });
          }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 22,
                  color: colors.charcoal.dark,
                  marginBottom: 5,
                }}
              >
                {isInitial ?
                  "Before Photo" :
                  "Progress Photo"
                }
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <Icon name="chevron-right" size={36} color={colors.charcoal.light} type="entypo" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 5,
            paddingHorizontal: containerPadding,
            justifyContent: 'center',
            backgroundColor: "#DEDBDB",
            borderRadius: 10,
            marginVertical: 10,
          }}
          onPress={() => {
            navigation.navigate("Progress1", {
              initialProgressInfo: initialProgressInfo,
              currentProgressInfo: currentProgressInfo,
              isInitial: isInitial,
              progressEdit: true,
              measurements: true
            });
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 22,
                  color: colors.charcoal.dark,
                  marginBottom: 5,
                }}
              >
                {isInitial ?
                  "Measurements" :
                  "Progress Measurements"
                }
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <Icon name="chevron-right" size={36} color={colors.charcoal.light} type="entypo" />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            padding: 5,
            paddingHorizontal: containerPadding,
            justifyContent: 'center',
            backgroundColor: "#DEDBDB",
            borderRadius: 10
          }}
          onPress={() => retakeBurpeeTest(
            isInitial,
            initialProgressInfo,
            currentProgressInfo,
            photoExist2
          )}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 22,
                  color: colors.charcoal.dark,
                  marginBottom: 5,
                }}
              >
                {isInitial ?
                  "Retake Strength Assessment" :
                  "Update Strength Assessment"
                }
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <Icon name="chevron-right" size={36} color={colors.charcoal.light} type="entypo" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{ flex: 3 }}
      >
        <View style={{flexBasis: 20}}></View>
        {
          isInitial ?
            <Image
              source={IMAGE.PROGRESS2_IMG}
              style={{
                width,
                height: width / 1.2,
              }}
              resizeMode="cover"
            />
            :
            <Image
              source={IMAGE.PROGRESS1_IMG}
              style={{
                width,
                height: width,
              }}
              resizeMode="cover"
            />
        }
      </View>
    </View>
  );
}

export default ProgressEditScreen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: colors.offWhite,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.light,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
  },

  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inputFieldContainer: {
    marginBottom: 20,
  },
  inputFieldTitle: {
    marginLeft: 2,
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  inputButton: {
    width: width - containerPadding * 2,
    padding: 15,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.grey.light,
    borderRadius: 2,
  },
  inputSelectionText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.dark,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 10,
    paddingHorizontal: containerPadding,
    width: "100%",
  },
});