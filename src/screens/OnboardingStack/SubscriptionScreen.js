import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  NativeModules,
  Alert,
  Linking,
  ImageBackground,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as Haptics from 'expo-haptics';
import appsFlyer from 'react-native-appsflyer';
// import * as Sentry from 'sentry-expo';
import { auth, db } from '../../../config/firebase';
import {
  // foundationIdentifiers,
  discountedIdentifiers,
  identifiers,
  compareProducts,
  validateReceiptProduction,
  validateReceiptSandbox,
  compare,
  compareInApp,
} from '../../../config/apple';
import SubscriptionTile from '../../components/Onboarding/SubscriptionTile';
import NativeLoader from '../../components/Shared/NativeLoader';
import Icon from '../../components/Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';
const productTitleMap = {
  0: 'YEARLY - ',
  1: 'MONTHLY - ',
};

const subscriptionPeriodMap = {
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount': 'month',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted': 'year',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation': 'month',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation': 'year',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly': 'month',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly': 'year',
};

const andriodSubscriptionPeriodMap = {
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.monthly.discount': 'month',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.yearly.discounted': 'year',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.monthly.foundation': 'month',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.yearly.foundation': 'year',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.monthly': 'month',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.yearly': 'year',
};

const itemSkus = Platform.select({
  android: [andriodSubscriptionPeriodMap],
});
const itemSubs = Platform.select({ android: ['com.fitazfkapp.fitazfkapp.sub']});
let purchaseUpdateSubscription;
let purchaseErrorSubscription;
const { InAppUtils } = NativeModules;
const { width, height } = Dimensions.get('window');

// export const compareLatest = (a, b) => {
//   const purchaseA = a.purchase_date_ms;
//   const purchaseB = b.purchase_date_ms;
//   let comparison = 0;
//   if (purchaseA > purchaseB) {
//     comparison = -1;
//   } else if (purchaseA < purchaseB) {
//     comparison = 1;
//   }
//   return comparison;
// };

export default class SubscriptionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      products: undefined,
      discountedProducts: undefined,
      specialOffer: props.navigation.getParam('specialOffer', undefined),
    };
  }
  componentDidMount = async () => {
    if (Platform.OS === 'android') {
      alert("componentDidMount Platform.android")
    }
    this.props.navigation.setParams({ handleRestore: this.restore });
    this.props.navigation.setParams({ handleLogout: this.logout });
    if (this.state.specialOffer) {
      await this.loadDiscountedProducts();
      await this.loadProducts();
    } else {
      await this.loadProducts();
    }
  }
  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  }
  logout = () => {
    try {
      AsyncStorage.removeItem('uid');
      auth.signOut();
      this.props.navigation.navigate('Auth');
    } catch (err) {
      Alert.alert('Error logging out');
    }
  }
  // GRAND UNIFIED
  restore = async () => {   
    this.setState({ loading: true });
    if (Platform.OS === 'ios') {
      this.restoreIOS();
    }
    else if (Platform.OS === 'android') {
      alert("Platform.android")
      await  this.restoreAND();
    }
  }
  restoreIOS = async () => {
    await InAppUtils.restorePurchases(async (error, response) => {
      if (error) {
        // Sentry.captureException(error);
        this.setState({ loading: false });
        Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
        return;
      } else if (response.length === 0) {
        await this.restoreReceipt();
        return;
      }
      this.restorePurchaseCommone(response);
    });
  }
  restoreReceipt = async () => {
    InAppUtils.receiptData(async (error2, receiptData) => {
      if (error2) {
        this.setState({ loading: false });
        Alert.alert('itunes Error', 'Receipt not found.');
      } else {
        const validationData = await this.validate(receiptData);
        if (validationData.latest_receipt_info === undefined) {
          this.setState({ loading: false });
          Alert.alert('No Purchases to restore');
          return;
        }
        const sortedReceipts = validationData.latest_receipt_info.slice().sort(compare);
        const latestReceipt = sortedReceipts[0];
        if (latestReceipt && latestReceipt.expires_date_ms > Date.now()) {
          const uid = await AsyncStorage.getItem('uid');
          const userRef = db.collection('users').doc(uid);
          const data = {
            subscriptionInfo: {
              expiry: latestReceipt.expires_date_ms,
              originalTransactionId: latestReceipt.original_transaction_id,
              originalPurchaseDate: latestReceipt.original_purchase_date_ms,
              productId: latestReceipt.product_id,
            },
          };
          await userRef.set(data, { merge: true });
          userRef.get()
            .then(async (doc) => {
              if (await doc.data().onboarded) {
                this.setState({ loading: false });
                Alert.alert('Restore Successful', 'Successfully restored your purchase.');
                this.props.navigation.navigate('App');
              } else {
                this.setState({ loading: false });
                Alert.alert('Restore Successful', 'Successfully restored your purchase.');
                this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
              }
            });
        } else if (latestReceipt && latestReceipt.expires_date_ms < Date.now()) {
          this.setState({ loading: false });
          Alert.alert('Expired', 'Your most recent subscription has expired');
        } else {
          this.setState({ loading: false });
          Alert.alert('No purchase information available');
        }
      }
    });
  }
  restorePurchaseCommone = async (response) =>  {
    const sortedPurchases = response.slice().sort(compare);
    try {
      const validationData = await this.validate(sortedPurchases[0].transactionReceipt);
      if (validationData === undefined) {
        this.setState({ loading: false });
        Alert.alert('Receipt Validation Error');
        return;
      }
      const sortedInApp = validationData.receipt.in_app.slice().sort(compareInApp);
      if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
        const uid = await AsyncStorage.getItem('uid');
        const userRef = db.collection('users').doc(uid);
        const data = {
          subscriptionInfo: {
            receipt: sortedPurchases[0].transactionReceipt,
            expiry: sortedInApp[0].expires_date_ms,
            originalTransactionId: sortedInApp[0].original_transaction_id,
            originalPurchaseDate: sortedInApp[0].original_purchase_date_ms,
            productId: sortedInApp[0].product_id,
          },
        };
        await userRef.set(data, { merge: true });
        userRef.get()
          .then(async (doc) => {
            if (await doc.data().onboarded) {
              this.setState({ loading: false });
              Alert.alert('Success', 'Successfully restored your purchase.');
              this.props.navigation.navigate('App');
            } else {
              this.setState({ loading: false });
              Alert.alert('Success', 'Successfully restored your purchase.');
              this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
            }
          });
      } else if (sortedInApp[0] && sortedInApp[0].expires_date_ms < Date.now()) {
        this.setState({ loading: false });
        Alert.alert('Expired', 'Your most recent subscription has expired');
      } else {
        this.setState({ loading: false });
        Alert.alert('No purchase information available');
      }
    } catch (err) {
      this.setState({ loading: false });
      Alert.alert('No current subscriptions to restore');
    }
  }
  // GRAND UNIFIED
  restoreAND = async () => {   
    this.setState({ loading: true });
     RNIap.getAvailablePurchases(response => {
     if (response.length === 0) {
        Alert.alert('error');
        return;
      }
      this.restorePurchaseCommone(response);
    }).catch(error =>{
        // Sentry.captureException(error);
        this.setState({ loading: false });
        Alert.alert('Google Play Error', 'Could not connect to Google Play store.');
        return;
    });
  }
  restore = async () => {
    this.setState({ loading: true });
    InAppUtils.restorePurchases(async (error, response) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
        return;
      } else if (response.length === 0) {
        InAppUtils.receiptData(async (error2, receiptData) => {
          if (error2) {
            this.setState({ loading: false });
            Alert.alert('itunes Error', 'Receipt not found.');
          } else {
            const validationData = await this.validate(receiptData);
            if (validationData.latest_receipt_info === undefined) {
              this.setState({ loading: false });
              Alert.alert('No Purchases to restore');
              return;
            }
            const sortedReceipts = validationData.latest_receipt_info.slice().sort(compare);
            const latestReceipt = sortedReceipts[0];
            if (latestReceipt && latestReceipt.expires_date_ms > Date.now()) {
              const uid = await AsyncStorage.getItem('uid');
              const userRef = db.collection('users').doc(uid);
              const data = {
                subscriptionInfo: {
                  expiry: latestReceipt.expires_date_ms,
                  originalTransactionId: latestReceipt.original_transaction_id,
                  originalPurchaseDate: latestReceipt.original_purchase_date_ms,
                  productId: latestReceipt.product_id,
                },
              };
              await userRef.set(data, { merge: true });
              userRef.get()
                .then(async (doc) => {
                  if (await doc.data().onboarded) {
                    this.setState({ loading: false });
                    Alert.alert('Restore Successful', 'Successfully restored your purchase.');
                    this.props.navigation.navigate('App');
                  } else {
                    this.setState({ loading: false });
                    Alert.alert('Restore Successful', 'Successfully restored your purchase.');
                    this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
                  }
                });
            } else if (latestReceipt && latestReceipt.expires_date_ms < Date.now()) {
              this.setState({ loading: false });
              Alert.alert('Expired', 'Your most recent subscription has expired');
            } else {
              this.setState({ loading: false });
              Alert.alert('No purchase information available');
            }
          }
        });
        return;
      }
      const sortedPurchases = response.slice().sort(compare);
      try {
        const validationData = await this.validate(sortedPurchases[0].transactionReceipt);
        if (validationData === undefined) {
          this.setState({ loading: false });
          Alert.alert('Receipt Validation Error');
          return;
        }
        if (validationData.latest_receipt_info && validationData.latest_receipt_info.expires_date > Date.now()) {
          const uid = await AsyncStorage.getItem('uid');
          const userRef = db.collection('users').doc(uid);
          const data = {
            subscriptionInfo: {
              receipt: sortedPurchases[0].transactionReceipt,
              expiry: validationData.latest_receipt_info.expires_date,
              originalTransactionId: validationData.latest_receipt_info.original_transaction_id,
              originalPurchaseDate: validationData.latest_receipt_info.original_purchase_date_ms,
              productId: validationData.latest_receipt_info.product_id,
            },
          };
          await userRef.set(data, { merge: true });
          userRef.get()
            .then(async (doc) => {
              if (await doc.data().onboarded) {
                this.setState({ loading: false });
                Alert.alert('Success', 'Successfully restored your purchase.');
                this.props.navigation.navigate('App');
              } else {
                this.setState({ loading: false });
                Alert.alert('Success', 'Successfully restored your purchase.');
                this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
              }
            });
        } else if (validationData.latest_receipt_info && validationData.latest_receipt_info.expires_date < Date.now()) {
          this.setState({ loading: false });
          Alert.alert('Expired', 'Your most recent subscription has expired');
        } else {
          this.setState({ loading: false });
          Alert.alert('No purchase information available');
        }
      } catch (err) {
        this.setState({ loading: false });
        Alert.alert('No current subscriptions to restore');
      }
    });
  }

  loadProducts = async () => {
    this.setState({ loading: true });        
    if (Platform.OS === 'ios') {
      this.loadProductIOS();
    }
    else if (Platform.OS === 'android') {
      alert("Platform.android")
      this.loadProductAND();
    }
  }

  loadProductAND = async () => {
    try {
      //await RNIap.prepare();
      await RNIap.getSubscriptions(itemSkus).then(product=>{
      Alert.alert("products");
      if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'loadProductAND',products.length, 
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.retryLoadProductsAND(),
            },
          ],
          { cancelable: false },
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ products: sortedProducts, loading: false });
      }

      }).catch(error=> {        
      this.setState({ loading: false });
      Alert.alert("loadProductAND error");
      Alert.alert('loadProductAND error', 'Unable to connect to the App Store', 'Please try again later');});        
     
    } catch(err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }

  loadProductIOS = async () => {
    await InAppUtils.loadProducts(identifiers, (error, products) => {      
      if (error) {
        this.setState({ loading: false });
        Alert.alert('Unable to connect to the App Store', 'Please try again later');
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.retryLoadProducts(),
            },
          ],
          { cancelable: false },
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ products: sortedProducts, loading: false });
      }
    });
  }
  loadDiscountedProducts = async () => {
    this.setState({ loading: true });
    Alert.alert('', 'Discounts applied');
    if (Platform.OS === 'ios') {
      this.loadDiscountedProductsIOS();
    }
    else if (Platform.OS === 'android') {
      alert("Platform.android")
      this.loadDiscountedProductsAND();
    }

  }
  loadDiscountedProductsAND = async () => {
    await RNIap.getSubscriptions(discountedIdentifiers).then(products => {
    if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.retryLoadDiscountedProducts(),
            },
          ],
          { cancelable: false },
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ discountedProducts: sortedProducts, loading: false });
      }
    }).catch(error=>{        
    this.setState({ loading: false });
    Alert.alert('Unable to connect to the App Store', 'Please try again later');});
  }
  loadDiscountedProductsIOS = async () => {
    await InAppUtils.loadProducts(discountedIdentifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert('Unable to connect to the App Store', 'Please try again later');
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.retryLoadDiscountedProductsAND(),
            },
          ],
          { cancelable: false },
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ discountedProducts: sortedProducts, loading: false });
      }
    });
  }
  retryLoadProducts = () => {
    this.setState({ loading: true });
    if (Platform.OS === 'ios') {
      this.retryLoadProductsIOS();
    }
    else if (Platform.OS === 'android') {
      alert("Platform.android")
      this.retryLoadProductsAND();
    }
  }
  retryLoadProductsAND = async () => {
    this.setState({ loading: true });
    await RNIap.getSubscriptions(identifiers).then(products => {
     if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.loadProductAND(),
            },
          ],
          { cancelable: false },
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ products: sortedProducts, loading: false });
      }
    }).catch(error=>{
      this.setState({ loading: false });
      Alert.alert('Unable to connect to the App Store', 'Please try again later');
    });
  }
  retryLoadProductsIOS = () => {
    InAppUtils.loadProducts(identifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert('Unable to connect to the App Store', 'Please try again later');
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.loadProductIOS(),
            },
          ],
          { cancelable: false },
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ products: sortedProducts, loading: false });
      }
    });
  }
  retryLoadDiscountedProducts = () => {
    this.setState({ loading: true });
    if (Platform.OS === 'ios') {
      this.retryLoadDiscountedProductsIOS();
    }
    else if (Platform.OS === 'android') {
      alert("Platform.android")
      this.retryLoadDiscountedProductsAND();
    }
  }
  retryLoadDiscountedProductsAND = async () => {
    this.setState({ loading: true });
    await RNIap.getSubscriptions(discountedIdentifiers).then( products => {
       if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.loadDiscountedProductsAND(),
            },
          ],
          { cancelable: false },
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ discountedProducts: sortedProducts, loading: false });
      }
    }).then(error =>{
      this.setState({ loading: false });
      Alert.alert('Unable to connect to the App Store', 'Please try again later');
    });
  }
  retryLoadDiscountedProductsIOS = () => {
    this.setState({ loading: true });
    InAppUtils.loadProducts(discountedIdentifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert('Unable to connect to the App Store', 'Please try again later');
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.loadDiscountedProducts(),
            },
          ],
          { cancelable: false },
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ discountedProducts: sortedProducts, loading: false });
      }
    });
  }
  purchaseProduct = async (productIdentifier, productPrice, productCurrencyCode) => {
    this.setState({ loading: true });
    Haptics.selectionAsync();
    if (productIdentifier === undefined) {
      Alert.alert('No subscription selected');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === 'ios') {
      await this.purchaseProductIdentifierIOS(productIdentifier,productPrice,productCurrencyCode);
    }
    else if (Platform.OS === 'android') {
      alert("Platform.android")
      this.retryLoadDiscountedProductsAND(productIdentifier,productPrice,productCurrencyCode);
    }    
  }

  purchaseProductIdentifierAND = async (productIdentifier, productPrice, productCurrencyCode) => {
     RNIap.initConnection((canMakePayments) => {
      if (!canMakePayments) {
        this.setState({ loading: false });
        Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
        return;
      }
      RNIap.requestPurchase(productIdentifier, async (error, response) => {
        if (error) {
          this.setState({ loading: false });
          Alert.alert('Purchase cancelled');
          return;
        }
        if (response && response.productIdentifier) {
          const validationData = await this.validate(response.transactionReceipt);
          if (validationData === undefined) {
            this.setState({ loading: false });
            Alert.alert('Receipt validation error');
            return;
          }
          const sortedInApp = validationData.receipt.in_app.slice().sort(compareInApp);
          const isValid = sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now();
          if (isValid === true) {
            const uid = await AsyncStorage.getItem('uid');
            const userRef = db.collection('users').doc(uid);
            const data = {
              subscriptionInfo: {
                receipt: response.transactionReceipt,
                expiry: sortedInApp[0].expires_date_ms,
                originalTransactionId: sortedInApp[0].original_transaction_id,
                originalPurchaseDate: sortedInApp[0].original_purchase_date_ms,
                productId: sortedInApp[0].product_id,
              },
            };
            await userRef.set(data, { merge: true });
            // Appsflyer event tracking - Start Free Trial
            const eventName = 'af_start_trial';
            const eventValues = {
              af_price: productPrice,
              af_currency: productCurrencyCode,
            };
            appsFlyer.trackEvent(eventName, eventValues);
            userRef.get()
              .then(async (doc) => {
                this.setState({ loading: false });
                if (await doc.data().onboarded) {
                  this.props.navigation.navigate('App');
                } else {
                  this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
                }
              });
          } else if (isValid === false) {
            this.setState({ loading: false });
            Alert.alert('Purchase Unsuccessful');
          } else {
            this.setState({ loading: false });
            Alert.alert('Something went wrong', `${isValid.message}`);
          }
        }
      });
    });
  }

  purchaseProductIdentifierIOS = async (productIdentifier, productPrice, productCurrencyCode) => {
    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        this.setState({ loading: false });
        Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
        return;
      }
      InAppUtils.purchaseProduct(productIdentifier, async (error, response) => {
        if (error) {
          this.setState({ loading: false });
          Alert.alert('Purchase cancelled');
          return;
        }
        if (response && response.productIdentifier) {
          const validationData = await this.validate(response.transactionReceipt);
          if (validationData === undefined) {
            this.setState({ loading: false });
            Alert.alert('Receipt validation error');
            return;
          }
          const sortedInApp = validationData.receipt.in_app.slice().sort(compareInApp);
          const isValid = sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now();
          if (isValid === true) {
            const uid = await AsyncStorage.getItem('uid');
            const userRef = db.collection('users').doc(uid);
            const data = {
              subscriptionInfo: {
                receipt: response.transactionReceipt,
                expiry: sortedInApp[0].expires_date_ms,
                originalTransactionId: sortedInApp[0].original_transaction_id,
                originalPurchaseDate: sortedInApp[0].original_purchase_date_ms,
                productId: sortedInApp[0].product_id,
              },
            };
            await userRef.set(data, { merge: true });
            // Appsflyer event tracking - Start Free Trial
            const eventName = 'af_start_trial';
            const eventValues = {
              af_price: productPrice,
              af_currency: productCurrencyCode,
            };
            appsFlyer.trackEvent(eventName, eventValues);
            userRef.get()
              .then(async (doc) => {
                this.setState({ loading: false });
                if (await doc.data().onboarded) {
                  this.props.navigation.navigate('App');
                } else {
                  this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
                }
              });
          } else if (isValid === false) {
            this.setState({ loading: false });
            Alert.alert('Purchase Unsuccessful');
          } else {
            this.setState({ loading: false });
            Alert.alert('Something went wrong', `${isValid.message}`);
          }
        }
      });
    });
  }

  purchaseDiscountedProduct = async (productIdentifier, productPrice, productCurrencyCode) => {
    this.setState({ loading: true });
    Haptics.selectionAsync();
    if (productIdentifier === undefined) {
      Alert.alert('No subscription selected');
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === 'ios') {
      await this.purchaseDiscountedProductIdentifierIOS(productIdentifier,productPrice,productCurrencyCode);
    }
    else if (Platform.OS === 'android') {
      alert("Platform.android")
      await this.purchaseDiscountedProductIdentifierAND(productIdentifier,productPrice,productCurrencyCode);
    } 

  }
  purchaseDiscountedProductIdentifierAND = async (productIdentifier, productPrice, productCurrencyCode) =>{
    RNIap.initConnection((canMakePayments) => {
      if (!canMakePayments) {
        this.setState({ loading: false });
        Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
        return;
      }
      RNIap.getProducts(discountedIdentifiers, (loadError) => {
        if (loadError) {
          this.setState({ loading: false });
          Alert.alert('Unable to connect to the App Store', 'Please try again later');
        }
        RNIap.requestPurchase(productIdentifier, async (error, response) => {
          if (error) {
            this.setState({ loading: false });
            Alert.alert('Purchase cancelled');
            return;
          }
          if (response && response.productIdentifier) {
            const validationData = await this.validate(response.transactionReceipt);
            if (validationData === undefined) {
              this.setState({ loading: false });
              Alert.alert('Receipt validation error');
              return;
            }
            const sortedInApp = validationData.receipt.in_app.slice().sort(compareInApp);
            const isValid = sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now();
            if (isValid === true) {
              const uid = await AsyncStorage.getItem('uid');
              const userRef = db.collection('users').doc(uid);
              const data = {
                subscriptionInfo: {
                  receipt: response.transactionReceipt,
                  expiry: sortedInApp[0].expires_date_ms,
                  originalTransactionId: sortedInApp[0].original_transaction_id,
                  originalPurchaseDate: sortedInApp[0].original_purchase_date_ms,
                  productId: sortedInApp[0].product_id,
                },
              };
              await userRef.set(data, { merge: true });
              // Appsflyer event tracking - Start Free Trial
              const eventName = 'af_start_trial';
              const eventValues = {
                af_price: productPrice,
                af_currency: productCurrencyCode,
              };
              appsFlyer.trackEvent(eventName, eventValues);
              userRef.get()
                .then(async (doc) => {
                  this.setState({ loading: false });
                  if (await doc.data().onboarded) {
                    this.props.navigation.navigate('App');
                  } else {
                    this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
                  }
                });
            } else if (isValid === false) {
              this.setState({ loading: false });
              Alert.alert('Purchase Unsuccessful');
            } else {
              this.setState({ loading: false });
              Alert.alert('Something went wrong', `${isValid.message}`);
            }
          }
        });
      });
    });
   }
 purchaseDiscountedProductIdentifierIOS = async (productIdentifier, productPrice, productCurrencyCode) =>{
  InAppUtils.canMakePayments((canMakePayments) => {
    if (!canMakePayments) {
      this.setState({ loading: false });
      Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
      return;
    }
    InAppUtils.loadProducts(discountedIdentifiers, (loadError) => {
      if (loadError) {
        this.setState({ loading: false });
        Alert.alert('Unable to connect to the App Store', 'Please try again later');
      }
      InAppUtils.purchaseProduct(productIdentifier, async (error, response) => {
        if (error) {
          this.setState({ loading: false });
          Alert.alert('Purchase cancelled');
          return;
        }
        if (response && response.productIdentifier) {
          const validationData = await this.validate(response.transactionReceipt);
          if (validationData === undefined) {
            this.setState({ loading: false });
            Alert.alert('Receipt validation error');
            return;
          }
          const sortedInApp = validationData.receipt.in_app.slice().sort(compareInApp);
          const isValid = sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now();
          if (isValid === true) {
            const uid = await AsyncStorage.getItem('uid');
            const userRef = db.collection('users').doc(uid);
            const data = {
              subscriptionInfo: {
                receipt: response.transactionReceipt,
                expiry: sortedInApp[0].expires_date_ms,
                originalTransactionId: sortedInApp[0].original_transaction_id,
                originalPurchaseDate: sortedInApp[0].original_purchase_date_ms,
                productId: sortedInApp[0].product_id,
              },
            };
            await userRef.set(data, { merge: true });
            // Appsflyer event tracking - Start Free Trial
            const eventName = 'af_start_trial';
            const eventValues = {
              af_price: productPrice,
              af_currency: productCurrencyCode,
            };
            appsFlyer.trackEvent(eventName, eventValues);
            userRef.get()
              .then(async (doc) => {
                this.setState({ loading: false });
                if (await doc.data().onboarded) {
                  this.props.navigation.navigate('App');
                } else {
                  this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
                }
              });
          } else if (isValid === false) {
            this.setState({ loading: false });
            Alert.alert('Purchase Unsuccessful');
          } else {
            this.setState({ loading: false });
            Alert.alert('Something went wrong', `${isValid.message}`);
          }
        }
      });
    });
  });
 }

  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(async (error) => {
      if (error.redirect) {
        const validationDataSandbox = await validateReceiptSandbox(receiptData);
        return validationDataSandbox;
      }
      return undefined;
    });
    return validationData;
  }
  render() {
    const {
      loading,
      products,
      discountedProducts,
      specialOffer,
    } = this.state;
    return (
      <React.Fragment>
        <View style={styles.container}>
          <ScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <ImageBackground
              source={require('../../../assets/images/subscription-screen-background.jpg')}
              style={styles.imageBackgroundContainer}
            >
              <View style={styles.headerContainer}>
                <Text style={styles.smallheaderText}>
                  {"YOU'RE ON YOUR WAY TO"}
                </Text>
                <Text style={styles.smallheaderText}>
                  GETTING SHREDDED!
                </Text>
                <Text style={styles.headerTextLine1}>
                  <Text style={styles.headerTextCursive}>
                    {'start  '}
                  </Text>
                  YOUR {specialOffer ? '1 MONTH' : '7 DAY'}
                </Text>
                <Text style={styles.headerTextLine2}>
                  FREE TRIAL TODAY!
                </Text>
              </View>
              <View style={styles.contentContainer}>
                <View style={styles.subscriptionTileRow}>
                  {
                    !specialOffer && products && products.map((product, index) => (
                      <SubscriptionTile
                        key={product.identifier}
                        primary={product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.monthly' || product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount'}
                        title={productTitleMap[index]}
                        price={product.priceString}
                        priceNumber={product.price}
                        currencyCode={product.currencyCode}
                        onPress={() => this.purchaseProduct(product.identifier, product.price, product.currencyCode)}
                        term={subscriptionPeriodMap[product.identifier]}
                      />
                    ))
                  }
                  {
                    specialOffer && discountedProducts && products && discountedProducts.map((product, index) => (
                      <SubscriptionTile
                        key={product.identifier}
                        primary={product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.monthly' || product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount'}
                        title={productTitleMap[index]}
                        price={product.priceString}
                        priceNumber={product.price}
                        currencyCode={product.currencyCode}
                        onPress={() => this.purchaseDiscountedProduct(product.identifier, product.price, product.currencyCode)}
                        term={subscriptionPeriodMap[product.identifier]}
                        comparisonPrice={
                          products && product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted' ?
                            `$${(products[0].price / 12).toFixed(2)}` :
                            products[1].priceString
                        }
                        isDiscounted={product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted' || product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount'}
                      />
                    ))
                  }
                </View>
              </View>
              <Icon
                name="chevron-up"
                size={8}
                color={colors.white}
                style={styles.chevronUp}
              />
              <View style={styles.disclaimerTextContainer}>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.subscriptionTermsTitle}>Subscription Terms: </Text>
                  {'By continuing, you accept our '}
                  <Text
                    onPress={() => this.openLink('https://fitazfk.com/pages/fitazfk-app-privacy-policy')}
                    style={styles.link}
                  >
                    Privacy Policy
                  </Text>
                  {' and '}
                  <Text
                    onPress={() => this.openLink('https://fitazfk.com/pages/fitazfk-app-terms-conditions')}
                    style={styles.link}
                  >
                    Terms and Conditions
                  </Text>
                  .
                  You also agree that an ongoing subscription to the FitazFK App (FitazFK Fitness & Nutrition) will be applied to your iTunes account at the end of your {specialOffer ? '1 month' : '7 day'} free trial.
                  Subscriptions will automatically renew and your account charged unless auto-renew is turned off at least 24-hours before the end of the current period.
                  Subscriptions may be managed by the user and auto-renewal may be turned off by going to the users Account Settings after purchase.
                  Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable.
                </Text>
              </View>
            </ImageBackground>
          </ScrollView>
        </View>
        {
          loading && (
            <NativeLoader />
          )
        }
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  imageBackgroundContainer: {
    height: (height > 800) ? height * 0.96 : height * 1.02,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContainer: {
    padding: 20,
  },
  smallheaderText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.black,
    textAlign: 'center',
  },
  headerTextCursive: {
    fontFamily: fonts.tuesdayNight,
    fontSize: 30,
    color: colors.black,
    textAlign: 'center',
  },
  headerTextLine1: {
    fontFamily: fonts.ultraItalic,
    fontSize: 22,
    color: colors.coral.standard,
    textAlign: 'center',
  },
  headerTextLine2: {
    fontFamily: fonts.ultraItalic,
    fontSize: 22,
    color: colors.coral.standard,
    textAlign: 'center',
    marginTop: -20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    width,
  },
  subscriptionTileRow: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  chevronUp: {
    alignSelf: 'center',
  },
  disclaimerTextContainer: {
    width,
    padding: 20,
    paddingTop: 10,
  },
  link: {
    color: colors.blue.standard,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  subscriptionTermsTitle: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.white,
  },
  disclaimerText: {
    fontFamily: fonts.standard,
    fontSize: 8,
    color: colors.white,
  },
});
