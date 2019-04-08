import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  NativeModules,
  Alert,
  AsyncStorage,
  Linking,
  ImageBackground,
} from 'react-native';
import { Haptic } from 'expo';
import { auth, db } from '../../../config/firebase';
import {
  // foundationIdentifiers,
  identifiers,
  compareProducts,
  validateReceiptProduction,
  validateReceiptSandbox,
  compare,
} from '../../../config/apple';
import SubscriptionTile from '../../components/Onboarding/SubscriptionTile';
import NativeLoader from '../../components/Shared/NativeLoader';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { InAppUtils } = NativeModules;
const { width } = Dimensions.get('window');

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

const productTitleMap = {
  0: 'MONTHLY',
  1: 'YEARLY',
};

const subscriptionPeriodMap = {
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation': 'monthly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation': 'yearly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly': 'monthly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly': 'yearly',
};

export default class SubscriptionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      products: undefined,
    };
  }
  componentDidMount = async () => {
    this.props.navigation.setParams({ handleRestore: this.restore });
    this.props.navigation.setParams({ handleLogout: this.logout });
    await this.loadProducts();
  }
  openLink = (url) => {
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
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
  restore = async () => {
    this.setState({ loading: true });
    InAppUtils.restorePurchases(async (error, response) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
      } else {
        if (response.length === 0) {
          // this.setState({ loading: false });
          // Alert.alert('No Purchases to restore');
          // return;
          InAppUtils.receiptData(async (error2, receiptData) => {
            if (error2) {
              this.setState({ loading: false });
              Alert.alert('itunes Error', 'Receipt not found.');
            } else {
              const validationData = await this.validate(receiptData);
              if (validationData.latest_receipt_info === undefined) {
                this.setState({ loading: false });
                Alert.alert('No Purchases to restore');
              }
              const sortedReceipts = validationData.latest_receipt_info.slice().sort(compare);
              const latestReceipt = sortedReceipts[0];
              // if (latestReceipt.product_id === 'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation') {
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
              // }
            }
          });
        }
        const sortedPurchases = response.slice().sort(compare);
        try {
          const validationData = await this.validate(sortedPurchases[0].transactionReceipt);
          if (validationData === undefined) {
            this.setState({ loading: false });
            Alert.alert('Receipt Validation Error');
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
      }
    });
  }
  loadProducts = async () => {
    this.setState({ loading: true });
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
        // Alert.alert('Unable to connect to the App Store', 'Please try again later');
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ products: sortedProducts, loading: false });
      }
    });
  }
  retryLoadProducts = () => {
    this.setState({ loading: true });
    InAppUtils.loadProducts(identifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert('Unable to connect to the App Store', 'Please try again later');
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        // Alert.alert('Unable to connect to the App Store', 'Please try again later');
        Alert.alert(
          'Unable to connect to the App Store',
          'Please try again later',
          [
            {
              text: 'Cancel', style: 'cancel',
            },
            {
              text: 'Try Again',
              onPress: () => this.loadProducts(),
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
  purchaseProduct = async (productIdentifier) => {
    this.setState({ loading: true });
    Haptic.selection();
    if (productIdentifier === undefined) {
      Alert.alert('No subscription selected');
      return;
    }
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        this.setState({ loading: false });
        Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
      }
      InAppUtils.purchaseProduct(productIdentifier, async (error, response) => {
        if (error) {
          this.setState({ loading: false });
          Alert.alert('Purchase cancelled');
        }
        if (response && response.productIdentifier) {
          const validationData = await this.validate(response.transactionReceipt);
          if (validationData === undefined) {
            this.setState({ loading: false });
            Alert.alert('Receipt validation error');
          }
          const isValid = validationData.latest_receipt_info.expires_date > Date.now();
          if (isValid === true) {
            const uid = await AsyncStorage.getItem('uid');
            const userRef = db.collection('users').doc(uid);
            const data = {
              subscriptionInfo: {
                expiry: validationData.latest_receipt_info.expires_date,
                originalTransactionId: validationData.latest_receipt_info.original_transaction_id,
                originalPurchaseDate: validationData.latest_receipt_info.original_purchase_date_ms,
                productId: validationData.latest_receipt_info.product_id,
                receipt: response.transactionReceipt,
              },
            };
            await userRef.set(data, { merge: true });
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
  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(async () => {
      const validationDataSandbox = await validateReceiptSandbox(receiptData);
      return validationDataSandbox;
    });
    if (validationData) {
      return validationData;
    }
    return undefined;
  }
  render() {
    const {
      loading,
      products,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../../../assets/images/subscription-screen-background.jpg')}
          style={styles.flexContainer}
        >
          <View style={styles.opacityOverlay}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                START YOUR 7 DAY FREE TRIAL TODAY!
              </Text>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.subscriptionTileRow}>
                {
                  products && products.map((product, index) => (
                    <SubscriptionTile
                      key={product.identifier}
                      primary={product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.yearly'}
                      title={productTitleMap[index]}
                      price={product.priceString}
                      currencyCode={product.currencyCode}
                      onPress={() => this.purchaseProduct(product.identifier)}
                      term={subscriptionPeriodMap[product.identifier]}
                    />
                  ))
                }
              </View>
            </View>
            <View style={styles.disclaimerTextContainer}>
              <ScrollView contentContainerStyle={styles.disclaimerScrollContainer}>
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
                  You also agree that an ongoing subscription to the FitazFK App (FitazFK) will be applied to your iTunes account at the end of your 7-day free trial.
                  Subscriptions will automatically renew and your account charged unless auto-renew is turned off at least 24-hours before the end of the current period.
                  Subscriptions may be managed by the user and auto-renewal may be turned off by going to the users Account Settings after purchase.
                  Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable.
                </Text>
              </ScrollView>
            </View>
          </View>
        </ImageBackground>
        {
          loading && (
            <NativeLoader />
          )
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offWhite,
  },
  opacityOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.transparentBlackMid,
  },
  headerContainer: {
    padding: 10,
    shadowColor: colors.black,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.white,
    textAlign: 'center',
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    width,
  },
  subscriptionTileRow: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  disclaimerTextContainer: {
    backgroundColor: colors.transparentBlackLight,
    borderRadius: 3,
    margin: 10,
    maxHeight: 110,
  },
  disclaimerScrollContainer: {
    padding: 10,
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
