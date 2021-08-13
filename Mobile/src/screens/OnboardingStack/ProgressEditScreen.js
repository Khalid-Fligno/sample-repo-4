import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Picker,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Haptics from "expo-haptics";
import Modal from "react-native-modal";
import HelperModal from "../../components/Shared/HelperModal";
import CustomButton from "../../components/Shared/CustomButton";
import CustomBtn from "../../components/Shared/CustomBtn";
import Loader from "../../components/Shared/Loader";
import {
  weightOptionsMetric,
  waistOptionsMetric,
  hipOptionsMetric,
  weightOptionsImperial,
  waistOptionsImperial,
  hipOptionsImperial,
} from "../../utils/index";
import { db } from "../../../config/firebase";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import globalStyle, { containerPadding } from "../../styles/globalStyles";
import { BackHandler } from "react-native";
import { Icon } from 'react-native-elements'

const { width } = Dimensions.get("window");

export default class ProgressEditScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount = () => {
    BackHandler.addEventListener('hardwareBackPress',() =>true)
    

  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress',() =>true)


  }

  
  render() {
    const { initialProgressInfo, currentProgressInfo, isInitial } = this.props.navigation.state.params;
    return (
      <View style={[{
        flex: 1,
        flexDirection: "column"
      }]}>
        <View style={{flex: 1}}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>{isInitial ? 'Edit Before' : 'Progress'}</Text>
          </View>
        </View>
        <View style={{flex: 2, flexDirection: "column"}}>
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
                isInitial: this.props.navigation.getParam('isInitial'),
                progressEdit: true
              });
            }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
                }}>
                <Text style={{
                  fontFamily: fonts.bold,
                  fontSize: 22,
                  color: colors.charcoal.light,
                  marginBottom: 5,
                }}>{isInitial ? "Before Photo" : "Progress Photo"}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
                }}>
                <Icon name="chevron-right" size={36} color={colors.coolIce} type="entypo" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{
            flex: 1,
            width,
            padding: 10,
            paddingHorizontal: containerPadding,
            justifyContent: 'center',
            borderTopWidth: 1,
            borderColor: colors.grey.light,
          }} onPress={() => {
            this.props.navigation.navigate("Progress1", {
              initialProgressInfo: initialProgressInfo,
              currentProgressInfo: currentProgressInfo,
              isInitial: this.props.navigation.getParam('isInitial'),
              progressEdit: true,
              measurements: true
            });
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
                }}>
                <Text style={{
                  fontFamily: fonts.bold,
                  fontSize: 22,
                  color: colors.charcoal.light,
                  marginBottom: 5,
                }}>{isInitial ? "Measurements" : "Progress Measurements"}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
                }}>
                <Icon name="chevron-right" size={36} color={colors.coolIce} type="entypo" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{
            flex: 1,
            width,
            padding: 10,
            paddingHorizontal: containerPadding,
            justifyContent: 'center',
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: colors.grey.light,
          }} onPress={() => {
            this.props.navigation.navigate("Progress3", {
              initialProgressInfo: initialProgressInfo,
              currentProgressInfo: currentProgressInfo,
              isInitial: this.props.navigation.getParam('isInitial'),
              progressEdit: true
            });
          }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
                }}>
                <Text style={{
                  fontFamily: fonts.bold,
                  fontSize: 22,
                  color: colors.charcoal.light,
                  marginBottom: 5,
                }}>{isInitial ? "Retake Burpee Test" : "Update Burpee Test"}</Text>
              </View>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
                }}>
                <Icon name="chevron-right" size={36} color={colors.coolIce} type="entypo" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex: 3}} />
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
