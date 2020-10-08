import React, { Component } from 'react';
import { View, 
  Text, 
  SafeAreaView, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity,
  Image,
  Alert, 
  Platform,
  ActionSheetIOS,
  PermissionsAndroid,} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Linking } from 'expo';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import Icon from '../../../components/Shared/Icon';
import Loader from '../../../components/Shared/Loader';
import { number } from 'prop-types';
import ChallengeStyle from '../chellengeStyle';
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
import CustomBtn from '../../../components/Shared/CustomBtn';
import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';
import AsyncStorage from '@react-native-community/async-storage';
const { width } = Dimensions.get('window');
const actionSheetOptions = ['Cancel', 'Take photo', 'Upload from Camera Roll'];


const uriToBlob = (url) => {
  return new Promise((resolve, reject) => {
    try{
      const xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob'; // convert type
      xhr.send();
    }catch(err){
      console.log(err)
    }
  
  });
};


export default class OnBoarding4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeData:{},
      hasCameraPermission: null,
      hasCameraRollPermission: null,
      hasExternalStorageDevicePermission: null,
      image: null,
      uploading: false,
      error: null,
      imgUrl:null
    };
  }
  
  onFocusFunction = () => {
    const data = this.props.navigation.getParam('data', {});
    console.log(data)
    this.setState({challengeData:data['challengeData']})
  }
  
  // add a focus listener onDidMount
  async componentDidMount () {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction();
    });
    if (Platform.OS === 'android') {
      await this.requestAndroidPermissions();
    
    }else{
    this.getCameraPermission();
    this.getCameraRollPermission();
    }
  }

  getCameraPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    console.log("getCameraPermission");
  }

  getCameraRollPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === 'granted' });
    console.log("getCameraRollPermission");
  }

  async requestAndroidPermissions() {
    try {
        await this.getCameraPermission();
        await this.getCameraRollPermission();
    }
    catch (err) {
        //Handle this error
        return false;
    }
}
  
  // and don't forget to remove the listener
  componentWillUnmount () {
    this.focusListener.remove()
  }
  
  saveImage = async (uri) => {
    try {
      const uid = await AsyncStorage.getItem('uid');
      const firebase = require('firebase');
      const blob = await uriToBlob(uri);
      const storageRef = firebase.storage().ref();
      const userPhotosStorageRef = storageRef.child('user-photos');
      const userStorageRef = userPhotosStorageRef.child(uid);
      const avatarStorageRef = userStorageRef.child('beforeChallengePhoto.jpeg');
      const metadata = {
        contentType: 'image/jpeg',
        cacheControl: 'public',
      };
      const snapshot = await avatarStorageRef.put(blob, metadata);
      const url = await snapshot.ref.getDownloadURL();
      this.setState({ imgUrl: url });
    } catch (err) {
      Alert.alert('Image save error');
    }
  };

  async goToScreen(type){ 
    let {challengeData , image,imgUrl} = this.state 
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log(imgUrl)
    try {
      if (imgUrl !== null) {
        const onBoardingInfo = Object.assign({},challengeData.onBoardingInfo,{
          beforePhotoUrl:imgUrl
        })
        console.log(challengeData)
        let updatedChallengedata = Object.assign({},challengeData,{onBoardingInfo})
        console.log(updatedChallengedata)
        if(type === 'next'){
          this.props.navigation.navigate('ChallengeOnBoarding5',{
            data:{
                   challengeData:updatedChallengedata
                 }
          })
        }else{
          this.props.navigation.navigate('ChallengeOnBoarding3',{
            data:{
                   challengeData:updatedChallengedata
                 }
          })
        }
      }else if(type === 'previous'){
        this.props.navigation.navigate('ChallengeOnBoarding3',{
          data:{
                 challengeData:challengeData
               }
        })
      } 
      else {
        this.setState({ error: 'Please select an image to continue', uploading: false });
      }
    } catch (err) {
      console.log(err)
      this.setState({ error: 'Problem uploading image, please try again', uploading: false });
    }  
  
     
  }
  chooseUploadType = () => {
    if (Platform.OS === 'android') {
        this.requestAndroidPermissions();
        this.showActionSheet();        
    }
    else {
        this.getCameraPermission();
        this.getCameraRollPermission();
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: actionSheetOptions,
                cancelButtonIndex: 0,
            },
            async (buttonIndex) => {
                this.uploadTypeAction(buttonIndex);
            },
        );
    }
}

async requestAndroidPermissions() {
    try {
        await this.getCameraPermission();
        await this.getCameraRollPermission();
    }
    catch (err) {
        //Handle this error
        return false;
    }
}

showActionSheet = () => {
    this.ActionSheet.show()
}

appSettingsPrompt = () => {
  Alert.alert(
    'FitazFK needs permissions to do this',
    'Go to app settings and enable camera and camera roll permissions',
    [
      {
        text: 'Cancel', style: 'cancel',
      },
      {
        text: 'Go to Settings', onPress: () => Linking.openURL('app-settings:'),
      },
    ],
    { cancelable: false },
  );
}

uploadTypeAction = (buttonIndex) => {
    if (buttonIndex === 1) {
        if (!this.state.hasCameraPermission || !this.state.hasCameraRollPermission) {
            this.appSettingsPrompt();
            return;
        }
        this.takePhoto();
    } else if (buttonIndex === 2) {
        if (!this.state.hasCameraRollPermission) {
            this.appSettingsPrompt();
            return;
        }
        this.pickImage();
    }
}

takePhoto = async () => {
const result = await ImagePicker.launchCameraAsync();
  if (!result.cancelled) {
    const manipResult = await ImageManipulator.manipulateAsync(
      result.uri,
      [{ resize: { width: 600, height: 800 } }],
      { format: 'jpeg', compress: 0.7 },
    );
    this.setState({ image: manipResult });
    await this.saveImage(manipResult.uri);
  }
};

pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    // console.log(result);
    const originXValue = result.width > result.height ? 130 : 0;
    if (!result.cancelled) {
      try {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.uri,
          [{ resize: { height: 800 } }, {
            crop: {
              originX: originXValue, originY: 0, width: 600, height: 800,
            },
          }],
          { format: 'jpeg', compress: 0.7 },
        );
        this.setState({ image: manipResult });
        await this.saveImage(manipResult.uri);
      } catch (err) {
        this.setState({ error: 'There was a problem with that image, please try a different one' });
      }
    }
};

handleImagePicked = async (pickerResult) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  this.setState({ uploading: true });
  try {
    if (this.state.image !== null) {
      const {
        weight,
        waist,
        hip,
        isInitial,
      } = this.props.navigation.state.params;
      this.setState({ uploading: false });
      this.props.navigation.navigate('Progress3', {
        image: pickerResult,
        weight,
        waist,
        hip,
        isInitial,
      });
    } else {
      this.setState({ error: 'Please select an image to continue', uploading: false });
    }
  } catch (err) {
    this.setState({ error: 'Problem uploading image, please try again', uploading: false });
  }
};
  render() {
    const { image, uploading, error } = this.state;
    return (
      <SafeAreaView style={ChallengeStyle.container}>
          <View style={[globalStyle.container,{paddingVertical:15}]}>
            <View>
              <Text style={[ChallengeStyle.onBoardingTitle,{textAlign:'center'}]}>Capture Yourself</Text>
            </View>
          
            <View style={styles.contentContainer}>
            {
              image ? (
                <TouchableOpacity
                  onPress={this.chooseUploadType}
                  style={styles.imageContainer}
                >
                  <Image
                    resizeMode="contain"
                    source={{ uri: image.uri }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={this.chooseUploadType}
                  style={styles.imagePlaceholder}
                >
                  <Icon
                    name="add-circle"
                    size={40}
                    color={colors.charcoal.light}
                  />
                  <Text style={styles.imagePlaceholderText}>
                    Add a photo
                  </Text>
                </TouchableOpacity>
              )
            }
            <ActionSheet
                ref={o => this.ActionSheet = o}
                options={actionSheetOptions}
                cancelButtonIndex={0}
                onPress={(index) => this.uploadTypeAction(index)}
            />
            </View>
                {
                  error && <Text style={styles.errorText}>{error}</Text>
                }
            <View style={ChallengeStyle.btnContainer}>
               
                  <CustomBtn 
                      Title="Previous"
                      outline={true}
                      customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                      onPress={()=>this.goToScreen('previous')}
                  />    
                  <CustomBtn 
                    Title="Next"
                    outline={true}
                    customBtnStyle={{borderRadius:50,padding:15,width:"49%"}}
                    onPress={()=>this.goToScreen('next')}
                  />
                </View>
          <Loader
            loading={uploading}
            color={colors.coral.standard}
          />
          </View>
      </SafeAreaView> 
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offWhite,
  },
  textContainer: {
    flex: 1,
    width,
    padding: 10,
    paddingHorizontal:containerPadding
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  image: {
    height: 240,
    width: 180,
    backgroundColor: colors.grey.standard,
    borderRadius: 4,
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    width: 180,
    backgroundColor: colors.grey.standard,
    borderRadius: 4,
    shadowColor: colors.grey.standard,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  imagePlaceholderText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.light,
    margin: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
    paddingHorizontal:containerPadding,
    width:'100%'
  },
  errorText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.coral.standard,
    textAlign: 'center',
    margin: 10,
  },
});
