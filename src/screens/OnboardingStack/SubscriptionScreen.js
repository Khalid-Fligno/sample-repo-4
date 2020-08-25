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
import {
  RestoreSubscriptions
} from '../../utils/subscription';

import {
  androidIdentifiers,
  androidDiscountedIdentifiers,
  getAndroidToken,
  getAndroidSubscriptionDetails,
  replaceTestAndroidProduct,
  restoreAndroidPurchases
} from '../../../config/android';
import SubscriptionTile from '../../components/Onboarding/SubscriptionTile';
import NativeLoader from '../../components/Shared/NativeLoader';
import Icon from '../../components/Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import RNIap, {
  PurchaseError,
  finishTransaction,
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

const andriodSubscriptionTitleMap = {
  0: 'year',
  1: 'month',
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
  android: androidIdentifiers,
});
const discountedItemSku = Platform.select({ android: androidDiscountedIdentifiers });
const { InAppUtils } = NativeModules;
const { width, height } = Dimensions.get('window');

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

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

    await RNIap.initConnection();
    this.androidSubscriptions();
    this.props.navigation.setParams({ handleRestore: this.restore });
    this.props.navigation.setParams({ handleLogout: this.logout });
    if (this.state.specialOffer) {
      await this.loadDiscountedProducts();
      await this.loadProducts();
    } else {
      await this.loadProducts();
    }
  }
  componentWillUnmount = () => {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
    RNIap.endConnection();
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
  convertToProduct = (products) => {
    const convertedProds = products.map((product) => {
      return {
        identifier: product.productId,
        primary: product.productId,
        priceString: product.localizedPrice,
        price: Number(product.price),
        currencyCode: product.currency
      }
    });
    return convertedProds;
  }
  androidSubscriptions = () => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: InAppPurchase | SubscriptionPurchase) => {
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          try {
            const ackResult = await finishTransaction(purchase).catch(() => this.setState({ loading: false }));
            if (Platform.OS === 'android') {
              this.handleAndroidPayment(purchase);
            }
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        Alert.alert('purchase error', error.message);
      },
    );
  }
  // GRAND UNIFIED
  restore = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    db.collection('users').doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          if (await !doc.data().fitnessLevel) {
            await AsyncStorage.setItem('fitnessLevel', '1');
          } else {
            await AsyncStorage.setItem('fitnessLevel', await doc.data().fitnessLevel.toString());
          }
          const { subscriptionInfo = undefined, onboarded = false } = await doc.data();
          const restoreSubscriptions = new RestoreSubscriptions(this.props);
          if (!subscriptionInfo.platform) {
            subscriptionInfo.platform = 'ios';
          }
          if (Platform.OS !== subscriptionInfo.platform) {
            await restoreSubscriptions.restore(subscriptionInfo, onboarded);
          }
          else if (Platform.OS === 'ios') {
            this.restoreiOSPurchases();
          }
          else if (Platform.OS === 'android') {
            await this.restoreAndroidPurchases();
          }
        }
      });
    
  }
  restoreiOSPurchases = async () => {
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
              platform: Platform.OS,
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
  restorePurchaseCommone = async (response) => {
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
            platform: Platform.OS,
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
  restoreAndroidPurchases = async () => {
    this.setState({ loading: true });
    await restoreAndroidPurchases(this.props).catch(() => this.setState({ loading: false }));
    this.setState({ loading: false });
  }

  loadProducts = async () => {
    this.setState({ loading: true });
    if (Platform.OS === 'ios') {
      this.loadiOSProducts();
    }
    else if (Platform.OS === 'android') {
      this.loadAndroidProducts();
    }
  }

  loadAndroidProducts = async () => {
    try {
      RNIap.getSubscriptions(itemSkus).then(products => {
        if (products.length !== 2) {
          // IAP products not retrieved (App Store server down, etc.)
          this.setState({ loading: false });
          Alert.alert(
            'Unable to connect to the Play Store',
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
          const sortedProducts = this.convertToProduct(products.slice().sort(compareProducts));
          this.setState({ products: sortedProducts, loading: false });
        }

      }).catch(error => {
        this.setState({ loading: false });
        Alert.alert('Unable to connect to the App Store', 'Please try again later');
      });

    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }
  }

  loadiOSProducts = async () => {
    await InAppUtils.loadProducts(identifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        console.log(error);
        Alert.alert('Unable to connect to the App Store', 'Please try again later');
      } else if (products.length !== 2) {
        Alert.alert("product length is not two", 'Products');
        Alert.alert("total products received are ", products.length.toString() );
        console.log(products);
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
      this.loadDiscountediOSProducts();
    }
    else if (Platform.OS === 'android') {
      this.loadAndroidDiscountedProducts();
    }

  }

  loadAndroidDiscountedProducts = async () => {
    RNIap.getSubscriptions(discountedItemSku).then(products => {
      if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          'Unable to connect to the Play Store',
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
        const sortedProducts = this.convertToProduct(products.slice().sort(compareProducts));
        this.setState({ discountedProducts: sortedProducts, loading: false });
      }
    }).catch(error => {
      this.setState({ loading: false });
      Alert.alert('Unable to connect to the Play Store', 'Please try again later');
    });
  }

  loadDiscountediOSProducts = async () => {
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
      this.retryLoadiOSProducts();
    }
    else if (Platform.OS === 'android') {
      this.loadAndroidProducts();
    }
  }
  retryLoadiOSProducts = () => {
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
              onPress: () => this.loadiOSProducts(),
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
      this.retryLoadDiscountediOSProducts();
    }
    else if (Platform.OS === 'android') {
      this.loadAndroidDiscountedProducts();
    }
  }

  retryLoadDiscountediOSProducts = () => {
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
      await this.iOSPurchaseProductIdentifier(productIdentifier, productPrice, productCurrencyCode);
    }
    else if (Platform.OS === 'android') {
      RNIap.requestSubscription(productIdentifier);
    }
  }

  iOSPurchaseProductIdentifier = async (productIdentifier, productPrice, productCurrencyCode) => {
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
                platform: Platform.OS,
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
      await this.iOSPurchaseDiscountedProductIdentifier(productIdentifier, productPrice, productCurrencyCode);
    }
    else if (Platform.OS === 'android') {
      RNIap.requestSubscription(productIdentifier);
    }

  }

  iOSPurchaseDiscountedProductIdentifier = async (productIdentifier, productPrice, productCurrencyCode) => {
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
                  platform: Platform.OS,
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

  handleAndroidPayment = async (purchase) => {
    if (purchase.purchaseStateAndroid !== 1) {
      Alert.alert('Play Connect', 'Transaction is not completed.');
      return;
    }
    const androidData = JSON.parse(purchase.dataAndroid);
    const access_token = await getAndroidToken();
    const purchaseDetails = await getAndroidSubscriptionDetails(androidData.packageName, purchase.productId, purchase.purchaseToken, access_token);
    const details = await purchaseDetails();

    if (details.error) {
      this.setState({ loading: false });
      Alert.alert(details.error.message);
      return;
    }


    const expiryDate = Number(details.expiryTimeMillis);

    const isValid = expiryDate > Date.now();
    if (isValid === true) {
      const uid = await AsyncStorage.getItem('uid');
      const userRef = db.collection('users').doc(uid);
      const data = {
        subscriptionInfo: {
          receipt: purchase.transactionReceipt,
          expiry: Number(details.expiryTimeMillis),
          originalTransactionId: purchase.transactionId,
          originalPurchaseDate: Number(androidData.purchaseTime),
          productId: replaceTestAndroidProduct(purchase.productId),
          platform: Platform.OS,
        },
      };
      console.log(data.subscriptionInfo);
      await userRef.set(data, { merge: true });
      // Appsflyer event tracking - Start Free Trial
      const eventName = 'af_start_trial';
      const eventValues = {
        af_price: details.priceAmountMicros / 1000000,
        af_currency: details.priceCurrencyCode,
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
                        primary={product.identifier.indexOf('fitazfkapp.sub.fullaccess.monthly') > 0 || product.identifier.indexOf('fitazfkapp.sub.fullaccess.monthly.discount') > 0}
                        title={productTitleMap[index]}
                        price={product.priceString}
                        priceNumber={product.price}
                        currencyCode={product.currencyCode}
                        onPress={() => this.purchaseProduct(product.identifier, product.price, product.currencyCode)}
                        term={Platform.OS === 'android' ? andriodSubscriptionTitleMap[index] : subscriptionPeriodMap[product.identifier]}
                      />
                    ))
                  }
                  {
                    specialOffer && discountedProducts && products && discountedProducts.map((product, index) => (
                      <SubscriptionTile
                        key={product.identifier}
                        primary={product.identifier.indexOf('fitazfkapp.sub.fullaccess.monthly') > 0 || product.identifier.indexOf('fitazfkapp.sub.fullaccess.monthly.discount') > 0}
                        title={productTitleMap[index]}
                        price={product.priceString}
                        priceNumber={product.price}
                        currencyCode={product.currencyCode}
                        onPress={() => this.purchaseDiscountedProduct(product.identifier, product.price, product.currencyCode)}
                        term={Platform.OS === 'android' ? andriodSubscriptionTitleMap[index] : subscriptionPeriodMap[product.identifier]}
                        comparisonPrice={
                          products && (product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted' || product.identifier === 'com.fitazfkapp.fitazfkapp.sub.fullaccess.yearly.discounted') ?
                            `$${(products[0].price / 12).toFixed(2)}` :
                            products[1].priceString
                        }
                        isDiscounted={product.identifier.indexOf('fitazfkapp.sub.fullaccess.yearly.discounted') > 0 || product.identifier.indexOf('fitazfkapp.sub.fullaccess.monthly.discount') > 0}
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
    marginTop: Platform.OS === 'android' ? 0 : -20,
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
