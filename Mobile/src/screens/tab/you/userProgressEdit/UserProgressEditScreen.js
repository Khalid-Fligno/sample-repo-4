import React from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image
} from "react-native";
import colors from "../../../../styles/colors";
import fonts from "../../../../styles/fonts";
import { containerPadding } from "../../../../styles/globalStyles";
import { Icon } from 'react-native-elements'
import * as FileSystem from "expo-file-system";
import { OTHERSIMG } from "../../../../library/images/others/others";
import { styles } from "./style";

const { width } = Dimensions.get("window");

const UserProgressEditScreen = ({ navigation }) => {

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
          style={styles.buttonTouch}
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
                  "Retake Burpee Test" :
                  "Update Burpee Test"
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
              source={OTHERSIMG.PROGRESS2_IMG}
              style={{
                width,
                height: width / 1.2,
              }}
              resizeMode="cover"
            />
            :
            <Image
              source={OTHERSIMG.PROGRESS1_IMG}
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

export default UserProgressEditScreen;