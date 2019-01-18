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
  TouchableOpacity,
  AsyncStorage,
  Linking,
} from 'react-native';
import { Haptic } from 'expo';
import { DotIndicator } from 'react-native-indicators';
import { auth, db } from '../../../config/firebase';
import {
  // identifiers,
  foundationIdentifiers,
  validateReceiptProduction,
  validateReceiptSandbox,
  compare,
} from '../../../config/apple';
import SubscriptionTile from '../../components/Onboarding/SubscriptionTile';
import Loader from '../../components/Shared/Loader';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { InAppUtils } = NativeModules;
const { width, height } = Dimensions.get('window');

const productTitleMap = {
  0: 'Monthly',
  1: 'Quarterly',
  2: 'Yearly',
};

const subscriptionPeriodMap = {
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation': 'monthly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.quarterly.foundation': 'quarterly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation': 'yearly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly': 'monthly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.quarterly': 'quarterly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly': 'yearly',
};

export default class SubscriptionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadingProducts: false,
      loading: false,
      products: undefined,
      subscriptionSelected: undefined,
    };
  }
  componentDidMount() {
    this.props.navigation.setParams({ handleRestore: this.restore });
    this.props.navigation.setParams({ handleLogout: this.logout });
    this.loadProducts();
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
          this.setState({ loading: false });
          Alert.alert('No Purchases to restore');
          return;
        }
        const sortedPurchases = response.slice().sort(compare);
        try {
          const validationData = await this.validate(sortedPurchases[0].transactionReceipt);
          if (validationData === undefined) {
            Alert.alert('Receipt Validation Error');
          }
          if (validationData.latest_receipt_info && validationData.latest_receipt_info.expires_date > Date.now()) {
            this.setState({ loading: false });
            Alert.alert('Restore Successful', 'Successfully restored your purchase.');
            this.props.navigation.navigate('App');
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
  loadProducts = () => {
    this.setState({ loadingProducts: true });
    InAppUtils.loadProducts(foundationIdentifiers, (error, products) => {
      if (error) {
        this.setState({ loadingProducts: false });
        Alert.alert('Could not load subscription products', 'Please try again later');
      }
      this.setState({ products, subscriptionSelected: products[1], loadingProducts: false });
    });
  }
  purchaseProduct = async (productIdentifier) => {
    if (productIdentifier === undefined) {
      this.setState({ loading: false });
      Alert.alert('No subscription selected');
      return;
    }
    Haptic.impact(Haptic.ImpactFeedbackStyle.Light);
    this.setState({ loading: true });
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
                originalTransationId: validationData.latest_receipt_info.original_transaction_id,
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
  toggleSubscriptionSelected = (subscriptionSelected) => {
    Haptic.selection();
    this.setState({ subscriptionSelected });
  }
  render() {
    const {
      loadingProducts,
      loading,
      products,
      subscriptionSelected,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Subscription
            </Text>
            <Text style={styles.subHeadingText}>
              Subscribe now for a 7-day free trial PLUS discounted foundation member rates!
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.subscriptionTileRow}>
              {
                products && products.map((product, index) => (
                  <SubscriptionTile
                    key={product.identifier}
                    title={productTitleMap[index]}
                    price={product.priceString}
                    currencyCode={product.currencyCode}
                    onPress={() => this.toggleSubscriptionSelected(product)}
                    active={subscriptionSelected === product}
                  />
                ))
              }
            </View>
          </View>
          <View style={styles.scrollViewContainer}>
            <ScrollView>
              <View style={styles.disclaimerTextContainer}>
                <Text style={styles.disclaimerText}>
                  A
                  <Text style={{ fontFamily: fonts.bold }}>
                    {subscriptionSelected && ` ${subscriptionSelected.priceString} `}
                    {subscriptionSelected && `${subscriptionSelected.currencyCode} `}
                    {subscriptionSelected && `${subscriptionPeriodMap[subscriptionSelected.identifier]} `}
                  </Text>
                  purchase for an ongoing subscription to the FitazFK App (FitazFK) will be applied to your iTunes account at the end of your 7-day free trial.
                </Text>
                <Text style={styles.disclaimerText}>
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
                  {'.'}
                </Text>
                <Text style={styles.disclaimerText}>
                  In agreeing to the Terms and Conditions of the FitazFK App (FitazFK), you agree that:
                </Text>
                <Text style={styles.disclaimerText}>
                  • The subscription automatically renews unless auto-renew is turned off at least 24-hours before the end of the current period.
                </Text>
                <Text style={styles.disclaimerText}>
                  • Account will be charged for renewal within 24-hours prior to the end of the current period, and identify the cost of the renewal.
                </Text>
                <Text style={styles.disclaimerText}>
                  • You can cancel anytime with your iTunes account settings.
                </Text>
                <Text style={styles.disclaimerText}>
                  • Subscriptions may be managed by the user and auto-renewal may be turned off by going to the users Account Settings after purchase.
                </Text>
                <Text style={styles.disclaimerText}>
                  • Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable.
                </Text>
              </View>
            </ScrollView>
          </View>
          <TouchableOpacity
            onPress={() => this.purchaseProduct(subscriptionSelected.identifier)}
            style={styles.button}
          >
            {
              loading ? (
                <DotIndicator
                  color={colors.white}
                  count={3}
                  size={6}
                />
              ) : (
                <Text style={styles.buttonText}>
                  CONTINUE
                </Text>
              )
            }
          </TouchableOpacity>
          <Loader
            loading={loadingProducts}
            color={colors.coral.standard}
          />
        </View>
        {
          loading && (
            <View style={styles.overlay} />
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
  headerContainer: {
    flexShrink: 1,
    width,
    padding: 10,
    paddingBottom: 0,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
  },
  subHeadingText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginLeft: 2,
  },
  contentContainer: {
    flexShrink: 1,
    justifyContent: 'center',
    width,
    height: 140,
    marginBottom: 5,
  },
  scrollViewContainer: {
    flex: 1,
    width: width - 20,
    backgroundColor: colors.white,
    borderColor: colors.grey.light,
    borderWidth: 1,
    borderRadius: 4,
  },
  subscriptionTileRow: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
  },
  disclaimerTextContainer: {
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 8,
  },
  link: {
    color: colors.blue.standard,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  disclaimerText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    margin: 10,
    width: width - 20,
    borderRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    backgroundColor: colors.coral.standard,
    shadowColor: colors.charcoal.standard,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 16,
    marginTop: 3,
  },
  overlay: {
    position: 'absolute',
    height,
    width,
    backgroundColor: colors.black,
    opacity: 0.6,
  },
});
