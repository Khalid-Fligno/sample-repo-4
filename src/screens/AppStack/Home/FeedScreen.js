import React from 'react';
import {
  View,
  Linking,
  ScrollView,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import * as Haptics from 'expo-haptics';
import * as Localization from 'expo-localization';
import * as FileSystem from 'expo-file-system';
import moment from 'moment';
import momentTimezone from 'moment-timezone';
import NewsFeedTile from '../../../components/Home/NewsFeedTile';
import DoubleNewsFeedTile from '../../../components/Home/DoubleNewsFeedTile';
import Loader from '../../../components/Shared/Loader';
import ProgressBar from '../../../components/Progress/ProgressBar';
import { db } from '../../../../config/firebase';
import Icon from '../../../components/Shared/Icon';
// import fonts from '../../../styles/fonts';
import colors from '../../../styles/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import globalStyle, { containerPadding } from '../../../styles/globalStyles';
import RoundButton from '../../../components/Home/RoundButton';
import HomeScreenStyle from './HomeScreenStyle';
import BigHeadingWithBackButton from '../../../components/Shared/BigHeadingWithBackButton';
import WorkOutCard from '../../../components/Home/WorkoutCard';
import TimeSvg from '../../../../assets/icons/time';
import CustomBtn from '../../../components/Shared/CustomBtn';
import fonts from '../../../styles/fonts';
const { width } = Dimensions.get('window');


const workoutTypeMap = {
  1: 'Strength',
  2: 'Circuit',
  3: 'Strength',
  4: 'Interval',
  5: 'Strength',
};

const resistanceFocusMap = {
  1: 'Full Body',
  3: 'Upper Body',
  5: 'Abs, Butt & Thighs',
};

export default class FeedScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dayOfWeek: undefined,
    //   profile: undefined,
    };
  }
  componentDidMount = () => {
    this.setDayOfWeek();
    // this.fetchProfile();
  }
  componentWillUnmount = () => {
    // this.unsubscribe();
  }


//   fetchProfile = async () => {
//     this.setState({ loading: true });
//     const uid = await AsyncStorage.getItem('uid');
//     const userRef = db.collection('users').doc(uid);
//     this.unsubscribe = userRef.onSnapshot(async (doc) => {
//       this.setState({
//         profile: await doc.data(),
//         loading: false,
//       });
//     });
//   }

  setDayOfWeek = async () => {
    const timezone = await Localization.timezone;
    const dayOfWeek = momentTimezone.tz(timezone).day();
    this.setState({ dayOfWeek });
  }

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }

  render() {
    const {
      loading,
      dayOfWeek
    } = this.state;
    let recommendedWorkout =[];

    (dayOfWeek > 0 && dayOfWeek < 6) ? recommendedWorkout.push(workoutTypeMap[dayOfWeek]): recommendedWorkout.push(' Rest Day') 
    if(dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) 
      recommendedWorkout.push(resistanceFocusMap[dayOfWeek])
 
    return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={HomeScreenStyle.scrollView}
          style={[globalStyle.container]}
        >
          <View style={{marginBottom:20}}>
           
              <WorkOutCard
                image={require('../../../../assets/images/homeScreenTiles/todayWorkoutImage2.jpeg')}
                title="TODAY'S WORKOUT"
                recommendedWorkout ={recommendedWorkout}
                onPress={() => this.props.navigation.navigate('Calendar')}
                cardCustomStyle ={{marginTop:20}} 
              />
              <NewsFeedTile
                image={require('../../../../assets/images/homeScreenTiles/home-screen-shop-apparel-jumper.jpg')}
                title="SHOP APPAREL"
                onPress={() => this.openLink('https://fitazfk.com/collections/wear-fitazfk-apparel')}
              />
              <DoubleNewsFeedTile
                imageLeft={require('../../../../assets/images/homeScreenTiles/home-screen-blog.jpg')}
                imageRight={require('../../../../assets/images/hiit-rest-placeholder.jpg')}
                titleLeft1="BLOG"
                titleRight1="FAQ"
                onPressLeft={() => this.props.navigation.navigate('HomeBlog')}
                onPressRight={() => this.openLink('https://fitazfk.zendesk.com/hc/en-us')}
              />
              <NewsFeedTile
                image={require('../../../../assets/images/shop-bundles.jpg')}
                title="SHOP EQUIPMENT"
                onPress={() => this.openLink('https://fitazfk.com/collections/equipment')}
              />
              <NewsFeedTile
                image={require('../../../../assets/images/fitazfk-army.jpg')}
                title="JOIN THE FITAZFK ARMY"
                onPress={() => this.openLink('https://www.facebook.com/groups/180007149128432/?source_id=204363259589572')}
              />
              {/* <Loader
                loading={loading}
                color={colors.charcoal.standard}
              /> */}

          </View>
          
        </ScrollView>

       
    );
  }
}


