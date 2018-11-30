import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { FileSystem, Video } from 'expo';
import Carousel from 'react-native-carousel';
import CustomButton from '../../components/Shared/CustomButton';
import Loader from '../../components/Shared/Loader';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Progress3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
    this.downloadVideo();
  }
  downloadVideo = async () => {
    this.setState({ loading: true });
    await FileSystem.downloadAsync(
      'https://firebasestorage.googleapis.com/v0/b/fitazfk-app.appspot.com/o/videos%2Fexercises%2Fburpees.m4v?alt=media&token=cfd6adaa-8ec0-4d0f-be46-f7623a8b598c',
      `${FileSystem.cacheDirectory}exercise-burpees.mp4`,
    );
    this.setState({ loading: false });
  }
  handleSkip = () => {
    if (this.props.navigation.getParam('isInitial', false)) {
      Alert.alert(
        'Warning',
        'You will need to do this before your first workout',
        [
          {
            text: 'Cancel', style: 'cancel',
          },
          {
            text: 'Ok, got it!', onPress: () => this.props.navigation.navigate('App'),
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        'Warning',
        'Skipping means that you will lose any information that you have already entered.',
        [
          {
            text: 'Cancel', style: 'cancel',
          },
          {
            text: 'Ok, got it!', onPress: () => this.props.navigation.navigate('App'),
          },
        ],
        { cancelable: false },
      );
    }
  }
  handleNext = async () => {
    const {
      image,
      weight,
      waist,
      hip,
      isInitial,
    } = this.props.navigation.state.params;
    this.props.navigation.navigate('Progress4', {
      image,
      weight,
      waist,
      hip,
      isInitial,
    });
  }
  render() {
    const { loading } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              Burpee Test
            </Text>
            <Text style={styles.bodyText}>
              Complete as many burpees as you can in one minute!
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={{ height: width }}>
              <Carousel
                width={width}
                inactiveIndicatorColor={colors.coral.standard}
                indicatorColor={colors.coral.standard}
                indicatorOffset={-2}
                indicatorSize={13}
                inactiveIndicatorText="○"
                indicatorText="●"
                animate={false}
              >
                <View
                  style={styles.exerciseTile}
                >
                  <View style={styles.exerciseTileHeaderBar}>
                    <View>
                      <Text style={styles.exerciseTileHeaderTextLeft}>
                        Burpees
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.exerciseTileHeaderBarRight}>
                        AMRAP
                      </Text>
                    </View>
                  </View>
                  <Video
                    source={{ uri: `${FileSystem.cacheDirectory}exercise-burpees.mp4` }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    shouldPlay
                    isLooping
                    style={{ width: width - 80, height: width - 80 }}
                  />
                </View>
                <View style={styles.exerciseDescriptionContainer}>
                  <Text>This is an exercise description</Text>
                </View>
              </Carousel>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="READY!"
              onPress={() => this.handleNext()}
              primary
            />
          </View>
          <Loader
            color={colors.coral.standard}
            loading={loading}
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
    flexShrink: 1,
    width,
    padding: 10,
    paddingTop: 15,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseTile: {
    width: width - 80,
    height: width - 45,
    marginTop: 7.5,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.coral.standard,
    overflow: 'hidden',
  },
  exerciseTileHeaderBar: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    paddingBottom: 5,
    backgroundColor: colors.coral.standard,
  },
  exerciseTileHeaderTextLeft: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: colors.white,
  },
  exerciseTileHeaderBarRight: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: colors.white,
  },
  exerciseDescriptionContainer: {
    height: '100%',
    width,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.transparent,
  },
  buttonContainer: {
    flexShrink: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
});
