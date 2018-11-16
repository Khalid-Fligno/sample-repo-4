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
} from 'react-native';
import { DotIndicator } from 'react-native-indicators';
import { identifiers, validateReceiptProduction, validateReceiptSandbox, compare } from '../../../config/apple';
import SubscriptionTile from '../../components/Onboarding/SubscriptionTile';
import Loader from '../../components/Shared/Loader';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { InAppUtils } = NativeModules;
const { width, height } = Dimensions.get('window');

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
    this.props.navigation.setParams({ restore: this.restore });
    this.loadProducts();
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
    InAppUtils.loadProducts(identifiers, (error, products) => {
      if (error) {
        Alert.alert('Could not load subscription products');
      }
      this.setState({ products, subscriptionSelected: products[1], loadingProducts: false });
    });
  }
  purchaseProduct = async (productIdentifier) => {
    this.setState({ loading: true });
    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        this.setState({ loading: false });
        Alert.alert('Not Allowed', 'This device is not allowed to make purchases. Please check restrictions on device');
      }
      InAppUtils.purchaseProduct(productIdentifier, async (error, response) => {
        if (error) {
          this.setState({ loading: false });
          Alert.alert('Something went wrong');
        }
        if (response && response.productIdentifier) {
          const validationData = await this.validate(response.transactionReceipt);
          if (validationData === undefined) {
            Alert.alert('Receipt validation error');
          }
          const isSubscribed = validationData.latest_receipt_info.expires_date > Date.now();
          if (isSubscribed === true) {
            this.setState({ loading: false });
            Alert.alert('Purchase Successful', `Your Transaction ID is ${response.transactionIdentifier}`);
            this.props.navigation.navigate('App');
          } else if (isSubscribed === false) {
            Alert.alert('Purchase Unsuccessful');
          } else {
            Alert.alert('Something went wrong', `${isSubscribed.message}`);
          }
        }
      });
    });
  }
  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(async (err) => {
      console.log(err);
      const validationDataSandbox = await validateReceiptSandbox(receiptData);
      return validationDataSandbox;
    });
    if (validationData) {
      return validationData;
    }
    return undefined;
  }
  toggleSubscriptionSelected = (subscriptionSelected) => {
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
              Subscribe now for a 7-day free trial!
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.subscriptionTileRow}>
              {
                products && products.map((product) => (
                  <SubscriptionTile
                    key={product.identifier}
                    title={product.title}
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
                  A <Text style={{ fontFamily: fonts.bold }}>{subscriptionSelected && `${subscriptionSelected.priceString} `}{subscriptionSelected && `${subscriptionSelected.currencyCode} `}{subscriptionSelected && `${subscriptionSelected.title.toLowerCase()} `}</Text>purchase will be applied to your iTunes account at the end of your 7-day free trial.
                </Text>
                <Text style={styles.disclaimerText}>
                  Subscriptions will automatically renew unless canceled within 24-hours before the end of the current period. You can cancel anytime with your iTunes account settings. Any unused portion of a free trial will be forfeited if you purchase a subscription.
                </Text>
                <Text style={styles.disclaimerText}>
                  For more information, see our [link to ToS] and [link to Privacy Policy].
                </Text>
              </View>
            </ScrollView>
          </View>
          <View style={styles.buttonContainer}>
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
          </View>
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
    paddingTop: 15,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 5,
  },
  subHeadingText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.light,
    marginLeft: 3,
  },
  contentContainer: {
    flexShrink: 1,
    justifyContent: 'center',
    width,
    height: 140,
    marginBottom: 10,
  },
  scrollViewContainer: {
    flexShrink: 1,
    width: width - 20,
    backgroundColor: colors.white,
    paddingRight: 5,
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
    paddingRight: 5,
  },
  disclaimerText: {
    fontFamily: fonts.standard,
    fontSize: 12,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  containerButton: {
    flexShrink: 1,
    justifyContent: 'flex-end',
    height: 70,
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
    shadowColor: colors.coral.standard,
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
