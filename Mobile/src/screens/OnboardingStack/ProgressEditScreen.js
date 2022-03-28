import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { containerPadding } from "../../styles/globalStyles";
import { BackHandler } from "react-native";
import { Icon } from 'react-native-elements'
import * as FileSystem from "expo-file-system";
import Loader from "../../components/Shared/Loader";

const { width } = Dimensions.get("window");

export default class ProgressEditScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.backButtonClick = this.backButtonClick.bind(this);
  }

  componentDidMount = () => {
    this.subscribed = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backButtonClick
    );
  };

  componentWillUnmount() {
    if (this.subscribed) this.subscribed.remove();
  }

  backButtonClick() {
    if (this.props.navigation && this.props.navigation.goBack) {
      this.props.navigation.navigate('ProgressHome')
      return true;

    }
    return false;
  }

  navigateToBurpee = async (isInitial, photoExist) => {
    if (photoExist) {
      this.setState({ loading: true });
      await FileSystem.downloadAsync(
        "https://firebasestorage.googleapis.com/v0/b/staging-fitazfk-app.appspot.com/o/videos%2FBURPEE%20(2).mp4?alt=media&token=9ae1ae37-6aea-4858-a2e2-1c917007803f",
        `${FileSystem.cacheDirectory}exercise-burpees.mp4`
      );

      this.setState({ loading: false });
      this.props.navigation.navigate("Burpee1", {
        isInitial: isInitial,
        navigateTo: "Progress",
        updateBurpees: true
      });
    } else {
      if (isInitial) {
        Alert.alert("Add a Before Photo first to retake your Burpee Test");
      } else {
        Alert.alert("Add a Progress Photo first to retake your Burpee Test");
      }
    }
  }

  retakeBurpeeTest = async (
    isInitial,
    initialProgressInfo,
    currentProgressInfo
  ) => {

    const isCurrentPhotoExist = currentProgressInfo?.photoURL
    const isInitialPhotoExist = initialProgressInfo?.photoURL

    if (isInitial) {
      await this.navigateToBurpee(isInitial, isInitialPhotoExist)
    } else {
      await this.navigateToBurpee(isInitial, isCurrentPhotoExist)
    }
  };

  render() {
    const {
      isInitial,
      initialProgressInfo,
      currentProgressInfo
    } = this.props.navigation.state.params

    return (
      <View
        style={[{ flex: 1, flexDirection: "column" }]}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              {isInitial ?
                'Edit Before' :
                'Progress'
              }
            </Text>
          </View>
        </View>
        <View
          style={{ flex: 2, flexDirection: "column" }}
        >
          <TouchableOpacity style={{
            flex: 1,
            width,
            padding: 10,
            paddingHorizontal: containerPadding,
            justifyContent: 'center',
            borderTopWidth: 1,
            borderColor: colors.grey.light,
          }} onPress={() => {
            this.props.navigation.navigate("Progress2", {
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
                    color: colors.charcoal.light,
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
                <Icon name="chevron-right" size={36} color={colors.coolIce} type="entypo" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              width,
              padding: 10,
              paddingHorizontal: containerPadding,
              justifyContent: 'center',
              borderTopWidth: 1,
              borderColor: colors.grey.light,
            }}
            onPress={() => {
              this.props.navigation.navigate("Progress1", {
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
                    color: colors.charcoal.light,
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
                <Icon name="chevron-right" size={36} color={colors.coolIce} type="entypo" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              width,
              padding: 10,
              paddingHorizontal: containerPadding,
              justifyContent: 'center',
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: colors.grey.light,
            }}
            onPress={() => this.retakeBurpeeTest(
              isInitial,
              initialProgressInfo,
              currentProgressInfo
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
                    color: colors.charcoal.light,
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
                <Icon name="chevron-right" size={36} color={colors.coolIce} type="entypo" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <Loader loading={this.state.loading} color={colors.charcoal.standard} />
        <View style={{ flex: 3 }} />
      </View>
    );
  }
}

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
  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingHorizontal: containerPadding
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.light,
    marginBottom: 5,
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
