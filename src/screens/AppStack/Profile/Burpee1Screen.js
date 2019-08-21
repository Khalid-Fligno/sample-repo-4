import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import Video from 'react-native-video';
import Carousel from 'react-native-carousel';
import CustomButton from '../../../components/Shared/CustomButton';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class Progress3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({ handleCancel: this.handleCancel });
  }
  handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    this.props.navigation.navigate('Burpee2');
  }
  handleCancel = () => {
    Alert.alert(
      'Stop burpee test?',
      '',
      [
        {
          text: 'Cancel', style: 'cancel',
        },
        {
          text: 'Yes', onPress: () => this.props.navigation.navigate('Home'),
        },
      ],
      { cancelable: false },
    );
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
              It’s time to test your fitness level - this will help us gauge the intensity of your workouts. Complete as many burpees as possible in 60 seconds.
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={{ height: width }}>
              <Carousel
                width={width}
                inactiveIndicatorColor={colors.coral.standard}
                indicatorColor={colors.coral.standard}
                indicatorOffset={12}
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
                        BURPEES
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.exerciseTileHeaderBarRight}>
                        MAX
                      </Text>
                    </View>
                  </View>
                  <Video
                    source={{ uri: `${FileSystem.cacheDirectory}exercise-burpees.mp4` }}
                    resizeMode="contain"
                    repeat
                    muted
                    style={{ width: width - 80, height: width - 80 }}
                  />
                </View>
                <View style={styles.exerciseDescriptionContainer}>
                  <View style={styles.exerciseTileHeaderBar}>
                    <View>
                      <Text style={styles.exerciseTileHeaderTextLeft}>
                        ADDITIONAL INFO
                      </Text>
                    </View>
                  </View>
                  <View style={styles.exerciseDescriptionTextContainer}>
                    <Text style={styles.exerciseDescriptionHeader}>
                      Coaching tip:
                    </Text>
                    <Text style={styles.exerciseDescriptionText}>
                      - Land with your feet flat on the ground just outside your hands.
                    </Text>
                    <Text style={styles.exerciseDescriptionText}>
                      - When extending out, avoid keeping your legs dead straight.
                    </Text>
                    <Text style={styles.exerciseDescriptionText}>
                      - Don’t let your hips drop as you land into your push-up.
                    </Text>
                  </View>
                </View>
              </Carousel>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="READY!"
              onPress={this.handleNext}
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
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.darkest,
    marginBottom: 5,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.darkest,
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
    fontFamily: fonts.standardNarrow,
    fontSize: 16,
    color: colors.white,
  },
  exerciseTileHeaderBarRight: {
    fontFamily: fonts.standardNarrow,
    fontSize: 16,
    color: colors.white,
  },
  exerciseDescriptionContainer: {
    width: width - 80,
    height: width - 45,
    marginTop: 7.5,
    marginBottom: 20,
    marginLeft: 40,
    marginRight: 40,
    borderWidth: 2,
    borderRadius: 4,
    borderColor: colors.coral.standard,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  exerciseDescriptionTextContainer: {
    padding: 15,
  },
  exerciseDescriptionHeader: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.darkest,
  },
  exerciseDescriptionText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.darkest,
    marginTop: 5,
    marginBottom: 5,
  },
  buttonContainer: {
    flexShrink: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
});
