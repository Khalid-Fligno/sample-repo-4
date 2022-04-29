import { Platform, Alert } from 'react-native';
import RNIap, {
    Product,
    ProductPurchase,
    PurchaseError,
    acknowledgePurchaseAndroid,
    purchaseErrorListener,
    purchaseUpdatedListener,
} from 'react-native-iap';
import { db } from './firebase';
import AsyncStorage from '@react-native-community/async-storage';

// const androidTokenUrl = 'http://3.8.209.87:8100/android/token/'; // this is installed on Personal server (Proj-Man) Server, this is required to generate secured token,  will need to move this on some other server with domain pointing
const androidTokenUrl = 'https://34.87.240.165/android/token/'; // Google cloud server ip

export const getAndroidToken = async () => {
    const res = await fetch(androidTokenUrl);
    
    const body = await res.text();
    return body;
}

export const getAndroidSubscriptionDetails = (packageName, subscriptionId, purchaseToken, accessToken) => {
    const verifyUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${subscriptionId}/tokens/${purchaseToken}?access_token=${accessToken}`;
    return async (receipt) => {
        
        const options = {
            method: 'GET'
        };

        const res = await fetch(verifyUrl, options);
        const body = await res.json();

        return body;
    };
}

export const replaceTestAndroidProduct = (productId) => { return productId.replace('com.fitazfkapp.fitazfkapp', 'com.fitazfk.fitazfkapp') }

export const restoreAndroidPurchases = async (navigation) =>{
    try {
        let purchases = await RNIap.getAvailablePurchases();
        if (purchases.length === 0) {
            navigation.navigate('Subscription');
            return false;
        }
        purchases = purchases.length > 1 ? purchases.slice().sort(sortByTransactionDate) : purchases;
        const activeSubscription = purchases[0];
        if (activeSubscription.purchaseStateAndroid !== 1) {
            Alert.alert('Play Connect', 'Transaction is not completed.');
            return false;
        }
        
        try {
            const androidData = JSON.parse(activeSubscription.transactionReceipt);
            
            const access_token = await getAndroidToken();
            const getPurchases = await getAndroidSubscriptionDetails(androidData.packageName, activeSubscription.productId, activeSubscription.purchaseToken, access_token);
            const purchaseDetails = await getPurchases();
            const expiryTime = Number(purchaseDetails.expiryTimeMillis);
            if (expiryTime > Date.now()) {

                // Alert.alert('Your subscription has been auto-renewed');
                const uid = await AsyncStorage.getItem('uid');
                const userRef = db.collection('users').doc(uid);
                const data = {
                    subscriptionInfo: {
                        receipt: activeSubscription.transactionReceipt,
                        expiry: expiryTime,
                        platform: Platform.OS,
                    },
                };
                await userRef.set(data, { merge: true });
                userRef.get()
                    .then(async (doc) => {
                        Alert.alert('Restore Successful', 'Successfully restored your purchase.');
                        if (await doc.data().onboarded) {
                            navigation.navigate('App');
                        } else {
                            navigation.navigate('Onboarding1', { name: navigation.getParam('name', null) });
                        }
                    });

                return true;
            } else if (expiryTime < Date.now()) {
                Alert.alert('Expired', 'Your most recent subscription has expired');
                navigation.navigate('Subscription');
            } else {
                Alert.alert('Something went wrong');
                navigation.navigate('Subscription');
            }
        }            
        catch (err) {
            Alert.alert('Error', 'Could not retrieve subscription information');
            navigation.navigate('Subscription');
            return false;
        }
    } catch (err) {
        Alert.alert(err.message);
    }
    return false;
}

export const sortByTransactionDate = (a, b) => {
  const purchaseA = a.transactionDate;
  const purchaseB = b.transactionDate;
  let comparison = 0;
  if (purchaseA > purchaseB) {
    comparison = -1;
  } else if (purchaseA < purchaseB) {
    comparison = 1;
  }
  return comparison;
};

// Grand unified receipt

export const compareInAppAND = (a, b) => {
  const purchaseA = a.expires_date_ms;
  const purchaseB = b.expires_date_ms;
  let comparison = 0;
  if (purchaseA > purchaseB) {
    comparison = -1;
  } else if (purchaseA < purchaseB) {
    comparison = 1;
  }
  return comparison;
};

export const compareProductsAND = (a, b) => {
  const purchaseA = a.price;
  const purchaseB = b.price;
  let comparison = 0;
  if (purchaseA > purchaseB) {
    comparison = -1;
  } else if (purchaseA < purchaseB) {
    comparison = 1;
  }
  return comparison;
};


export const androidIdentifiers = [
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.yearly',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.monthly',
];

// export const foundationIdentifiers = [
//   'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation',
//   'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation',
// ];

export const androidDiscountedIdentifiers = [
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.yearly.discounted',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.monthly.discount',
];

export const andriodPlatform = () =>{
  return Platform.OS === 'android';
}


