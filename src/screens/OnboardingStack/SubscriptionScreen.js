import React from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  NativeModules,
  Alert,
  AsyncStorage,
  Linking,
  ImageBackground,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import appsFlyer from 'react-native-appsflyer';
import { auth, db } from '../../../config/firebase';
import {
  // foundationIdentifiers,
  discountedIdentifiers,
  identifiers,
  compareProducts,
  validateReceiptProduction,
  validateReceiptSandbox,
  compare,
  // compareInApp,
} from '../../../config/apple';
import SubscriptionTile from '../../components/Onboarding/SubscriptionTile';
import NativeLoader from '../../components/Shared/NativeLoader';
import Icon from '../../components/Shared/Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

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
const productTitleMap = {
  0: 'YEARLY - ',
  1: '7 DAY FREE TRIAL',
};

const subscriptionPeriodMap = {
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount': 'month',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted': 'year',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation': 'month',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation': 'year',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly': 'month',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly': 'year',
};

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
  restore = async () => {
    this.setState({ loading: true });
    InAppUtils.restorePurchases(async (error, response) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert('iTunes Error', 'Could not connect to iTunes store.');
        return;
      } else if (response.length === 0) {
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
              return;
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

        // Start grand unified logic

        //     const sortedInApp = validationData.receipt.in_app.slice().sort(compareInApp);
        //     if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
        //       const uid = await AsyncStorage.getItem('uid');
        //       const userRef = db.collection('users').doc(uid);
        //       const data = {
        //         subscriptionInfo: {
        //           receipt: sortedPurchases[0].transactionReceipt,
        //           expiry: sortedInApp[0].expires_date_ms,
        //           originalTransactionId: sortedInApp[0].original_transaction_id,
        //           originalPurchaseDate: sortedInApp[0].original_purchase_date_ms,
        //           productId: sortedInApp[0].product_id,
        //         },
        //       };
        //       await userRef.set(data, { merge: true });
        //       userRef.get()
        //         .then(async (doc) => {
        //           if (await doc.data().onboarded) {
        //             this.setState({ loading: false });
        //             Alert.alert('Success', 'Successfully restored your purchase.');
        //             this.props.navigation.navigate('App');
        //           } else {
        //             this.setState({ loading: false });
        //             Alert.alert('Success', 'Successfully restored your purchase.');
        //             this.props.navigation.navigate('Onboarding1', { name: this.props.navigation.getParam('name', null) });
        //           }
        //         });
        //     } else if (sortedInApp[0] && sortedInApp[0].expires_date_ms < Date.now()) {
        //       this.setState({ loading: false });
        //       Alert.alert('Expired', 'Your most recent subscription has expired');
        //     } else {
        //       this.setState({ loading: false });
        //       Alert.alert('No purchase information available');
        //     }
        //   } catch (err) {
        //     this.setState({ loading: false });
        //     Alert.alert('No current subscriptions to restore');
        //   }
        // });

        // End grand unified logic

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
  loadDiscountedProducts = async () => {
    this.setState({ loading: true });
    Alert.alert('', 'Discounts applied');
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
              onPress: () => this.retryLoadDiscountedProducts(),
            },
          ],
          { cancelable: false },
        );
        // Alert.alert('Unable to connect to the App Store', 'Please try again later');
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ discountedProducts: sortedProducts, loading: false });
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
  retryLoadDiscountedProducts = () => {
    this.setState({ loading: true });
    InAppUtils.loadProducts(discountedIdentifiers, (error, products) => {
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
    if (validationData) {
      return validationData;
    }
    return undefined;
  }
  render() {
    const {
      loading,
      products,
      discountedProducts,
      specialOffer,
    } = this.state;
    return (
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
                YOUR 7-DAY
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
                You also agree that an ongoing subscription to the FitazFK App (FitazFK Fitness & Nutrition) will be applied to your iTunes account at the end of your 7-day free trial.
                Subscriptions will automatically renew and your account charged unless auto-renew is turned off at least 24-hours before the end of the current period.
                Subscriptions may be managed by the user and auto-renewal may be turned off by going to the users Account Settings after purchase.
                Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable.
              </Text>
            </View>
          </ImageBackground>
        </ScrollView>
        {
          loading && (
            <NativeLoader />
          )
        }
      </View>
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
