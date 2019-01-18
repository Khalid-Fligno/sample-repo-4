import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  NativeModules,
  Alert,
  AsyncStorage,
  Linking,
  Image,
} from 'react-native';
import { Haptic } from 'expo';
import { auth, db } from '../../../config/firebase';
import {
  // identifiers,
  compareProducts,
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
const { width } = Dimensions.get('window');

const productTitleMap = {
  0: 'Yearly',
  1: 'Monthly',
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
    this.setState({ loading: true });
    InAppUtils.loadProducts(foundationIdentifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert('Could not load subscription products', 'Please try again later');
      }
      const sortedProducts = products.slice().sort(compareProducts);

      this.setState({ products: sortedProducts, subscriptionSelected: sortedProducts[0], loading: false });
    });
  }
  purchaseProduct = async (productIdentifier) => {
    Haptic.selection();
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
  render() {
    const {
      loading,
      products,
      subscriptionSelected,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <Image
            source={require('../../../assets/images/subscription-screen-header.jpg')}
            style={styles.headerImage}
          />
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Get Full Access
            </Text>
            <Text style={styles.subHeadingText}>
              Take advantage of our discounted foundation memberships now!
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.subscriptionTileRow}>
              {
                products && products.map((product, index) => (
                  <SubscriptionTile
                    key={product.identifier}
                    solid={product.identifier === 'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation'}
                    title={productTitleMap[index]}
                    price={product.priceString}
                    currencyCode={product.currencyCode}
                    onPress={() => this.purchaseProduct(product.identifier)}
                    active={subscriptionSelected === product}
                    term={subscriptionPeriodMap[product.identifier]}
                  />
                ))
              }
            </View>
          </View>
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
              You also agree that an ongoing subscription to the FitazFK App (FitazFK) will be applied to your iTunes account at the end of your 7-day free trial.
              Subscriptions will automatically renew and your account charged unless auto-renew is turned off at least 24-hours before the end of the current period.
              Subscriptions may be managed by the user and auto-renewal may be turned off by going to the users Account Settings after purchase.
              Any unused portion of a free trial period, if offered, will be forfeited when the user purchases a subscription to that publication, where applicable.
            </Text>
          </View>
        </View>
        {
          loading && (
            <Loader loading={loading} color={colors.coral.standard} />
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
  headerImage: {
    width,
    height: width / 2,
    resizeMode: 'cover',
  },
  headerContainer: {
    width,
    padding: 12,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.charcoal.darkest,
    marginBottom: 5,
  },
  subHeadingText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.darkest,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    width,
    height: 140,
  },
  subscriptionTileRow: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
  },
  disclaimerTextContainer: {
    flexShrink: 1,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 8,
  },
  link: {
    color: colors.blue.standard,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
  subscriptionTermsTitle: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  disclaimerText: {
    fontFamily: fonts.standard,
    fontSize: 8,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
});
