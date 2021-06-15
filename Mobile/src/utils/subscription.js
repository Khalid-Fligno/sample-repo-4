import {
  Platform,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { auth, db } from '../../config/firebase';
// const subscriptionServiceUrl = 'http://3.8.209.87:8100/subscriptions/';
const subscriptionServiceUrl = 'https://34.87.240.165/subscriptions/'; //Google cloud server ip
export class RestoreSubscriptions {
  constructor(props) {
    this.props = props;
  }
  restore = async (subscriptionInfo, onboarded) => {
    const newSubscriptionInfoReq = await fetch(subscriptionServiceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriptionInfo)
    });
    const newSubscriptionInfo = await newSubscriptionInfoReq.json();
    if (newSubscriptionInfo.error && newSubscriptionInfo.error.errorCode) {
      this.handleError(newSubscriptionInfo.error);
      return null;
    }
    await this.updateSubscription(subscriptionInfo, newSubscriptionInfo, onboarded);
    return newSubscriptionInfo;
  }

  updateSubscription = async (oldSubscriptionInfo, newSubscriptionInfo, onboarded) => {
    const uid = await AsyncStorage.getItem('uid');
    const userRef = db.collection('users').doc(uid);
    const data = {
      subscriptionInfo: {
        receipt: newSubscriptionInfo.receipt,
        expiry: newSubscriptionInfo.expiry,
        platform: newSubscriptionInfo.platform,
      },
    };
    await userRef.set(data, { merge: true });
    if (onboarded) {
      this.props.navigation.navigate('App');
    } else {
      this.props.navigation.navigate('Onboarding1');
    }
  }

  handleError = (error) => {
    switch (error.errorCode) {
      case 121:
        Alert.alert(error.title, error.message);
        break;
      case 122:
        Alert.alert('Expired', 'Your most recent subscription has expired');
        break;
      case 123:
        Alert.alert('Restore Failed', error.message);
        break;
      case 141:
        Alert.alert(error.title, error.message);
      default:
        Alert.alert('Restore Failed', error.message);
    }
    this.props.navigation.navigate('Subscription');
  }
}