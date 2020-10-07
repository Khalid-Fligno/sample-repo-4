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

export default class LifeStyleScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    //   profile: undefined,
    };
  }
  componentDidMount = () => {
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
  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(url);
  }

  render() {
    const {
      loading,
    } = this.state;
   
 
    return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={HomeScreenStyle.scrollView}
          style={[globalStyle.container]}
        >
          <View>
           
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


