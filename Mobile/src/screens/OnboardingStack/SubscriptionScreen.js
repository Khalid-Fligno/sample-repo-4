import React from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import * as Haptics from "expo-haptics";
import appsFlyer from "react-native-appsflyer";
import { auth, db } from "../../../config/firebase";
import { firestore } from "firebase";

import {
  discountedIdentifiers,
  identifiers,
  transformIdentifiers,
  compareProducts,
  validateReceiptProduction,
  validateReceiptSandbox,
  compare,
  compareInApp,
  productPeriod,
  trialPeriod,
  savingPercentage,
  productAdditionalText,
  productTitle,
  lifeStyleIdentifiers
} from "../../../config/apple";
import { RestoreSubscriptions } from "../../utils/subscription";
import { getUserChallenge, getValidChallenges, createNewChallengeModel } from "../../utils//challenges";
import {
  androidIdentifiers,
  androidDiscountedIdentifiers,
  getAndroidToken,
  getAndroidSubscriptionDetails,
  replaceTestAndroidProduct,
  restoreAndroidPurchases,
} from "../../../config/android";
import SubscriptionTile from "../../components/Onboarding/SubscriptionTile";
import NativeLoader from "../../components/Shared/NativeLoader";
import Icon from "../../components/Shared/Icon";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import RNIap, {
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";
import CustomBtn from "../../components/Shared/CustomBtn";
import { containerPadding } from "../../styles/globalStyles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const productTitleMapIOS = {
  0: "Yearly ",
  1: "Monthly ",
};
const productTitleMapAndroid = {
  0: "Monthly ",
  1: "Yearly ",
};
const andriodSubscriptionTitleMap = {
  0: "year",
  1: "month",
};
const itemSkus = Platform.select({
  android: androidIdentifiers,
});
const discountedItemSku = Platform.select({
  android: androidDiscountedIdentifiers,
});
const { InAppUtils } = NativeModules;
const { width, height } = Dimensions.get("window");

let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class SubscriptionScreen extends React.PureComponent {
  constructor(props) {
    super(props);

    const preSelectedTransform = transformIdentifiers
      .find(i => i.challengeId == props.navigation.getParam("preselectedChallenge", undefined))

    this.state = {
      loading: false,
      products: undefined,
      discountedProducts: undefined,
      specialOffer: props.navigation.getParam("specialOffer", undefined),
      challengesOnly: props.navigation.getParam("challengesOnly", false),
      dismissOnSuccess: props.navigation.getParam("dismissOnSuccess", false),
      selectedId: preSelectedTransform?.identifier,
    };
  }

  componentDidMount = async () => {
    this.props.navigation.setParams({ 
      handleLogout: this.logout,
      handleCancel: () => this.props.navigation.dismiss()
    });
    await RNIap.initConnection();
    this.androidSubscriptions();
    if (this.state.specialOffer) {
      await this.loadDiscountedProducts();
      await this.loadProducts();
    } else {
      await this.loadProducts();
    }
  };

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
  };

  openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

  logout = () => {
    try {
      AsyncStorage.removeItem("uid");
      auth.signOut();
      this.props.navigation.navigate("Auth");
    } catch (err) {
      Alert.alert("Error logging out");
    }
  };

  convertToProduct = (products) => {
    const convertedProds = products.map((product) => {
      return {
        identifier: product.productId,
        primary: product.productId,
        priceString: product.localizedPrice,
        price: Number(product.price),
        currencyCode: product.currency,
      };
    });
    return convertedProds;
  };

  androidSubscriptions = () => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase?.transactionReceipt;

        if (receipt) {
          try {
            const ackResult = await finishTransaction(purchase).catch(() =>
              this.setState({ loading: false })
            );
            if (Platform.OS === "android") {
              this.handleAndroidPayment(purchase);
            }
          } catch (ackErr) {
            console.warn("ackErr", ackErr);
          }
        }
      }
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error) => {
        Alert.alert("purchase error", error.message);
      }
    );
  };
  // GRAND UNIFIED
  restore = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem("uid");
    db.collection("users")
      .doc(uid)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          if (await !doc.data().fitnessLevel) {
            await AsyncStorage.setItem("fitnessLevel", "1");
          } else {
            await AsyncStorage.setItem(
              "fitnessLevel",
              await doc.data().fitnessLevel.toString()
            );
          }
          const { subscriptionInfo = undefined, onboarded = false } =
            await doc.data();
          const restoreSubscriptions = new RestoreSubscriptions(this.props);

          if (!subscriptionInfo.platform) {
            subscriptionInfo.platform = "ios";
          }
          try {
            await restoreSubscriptions.restore(subscriptionInfo, onboarded);
          } catch (ex) {
            if (Platform.OS === "ios") {
              await this.restoreiOSPurchases(onboarded);
            } else if (Platform.OS === "android") {
              await restoreAndroidPurchases(this.props);
            }
          }
        }
      });
  };

  restoreiOSPurchases = async (onboarded) => {
    await InAppUtils.restorePurchases(async (error, response) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert("iTunes Error", "Could not connect to iTunes store.");
        return;
      } else if (response.length === 0) {
        await this.restoreReceipt();
        return;
      }
      this.restorePurchaseCommone(response);
    });
  };

  restoreReceipt = async () => {
    InAppUtils.receiptData(async (error2, receiptData) => {
      if (error2) {
        this.setState({ loading: false });
        Alert.alert("itunes Error", "Receipt not found.");
      } else {
        const validationData = await this.validate(receiptData);
        if (validationData.latest_receipt_info === undefined) {
          this.setState({ loading: false });
          Alert.alert("No Purchases to restore");
          return;
        }
        const sortedReceipts = validationData.latest_receipt_info
          .slice()
          .sort(compare);
        const latestReceipt = sortedReceipts[0];
        if (latestReceipt && latestReceipt.expires_date_ms > Date.now()) {
          const uid = await AsyncStorage.getItem("uid");
          const userRef = db.collection("users").doc(uid);
          const data = {
            subscriptionInfo: {
              expiry: latestReceipt.expires_date_ms,
              originalTransactionId: latestReceipt.original_transaction_id,
              originalPurchaseDate: latestReceipt.original_purchase_date_ms,
              productId: latestReceipt.product_id,
              platform: Platform.OS,
              blogsId: "lifestyleBlogs"
            },
          };
          await userRef.set(data, { merge: true });
          userRef.get().then(async (doc) => {
            if (await doc.data().onboarded) {
              this.setState({ loading: false });
              Alert.alert(
                "Restore Successful",
                "Successfully restored your purchase."
              );
              this.props.navigation.navigate("App");
            } else {
              this.setState({ loading: false });
              Alert.alert(
                "Restore Successful",
                "Successfully restored your purchase."
              );
              this.props.navigation.navigate("Onboarding1", {
                name: this.props.navigation.getParam("name", null),
              });
            }
          });
        } else if (
          latestReceipt &&
          latestReceipt.expires_date_ms < Date.now()
        ) {
          this.setState({ loading: false });
          Alert.alert("Expired", "Your most recent subscription has expired");
        } else {
          this.setState({ loading: false });
          Alert.alert("No purchase information available");
        }
      }
    });
  };

  restorePurchaseCommone = async (response) => {
    const sortedPurchases = response.slice().sort(compare);
    try {
      const validationData = await this.validate(
        sortedPurchases[0].transactionReceipt
      );
      if (validationData === undefined) {
        this.setState({ loading: false });
        Alert.alert("Receipt Validation Error");
        return;
      }
      const sortedInApp = validationData.receipt.in_app
        .slice()
        .sort(compareInApp);
      if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
        const uid = await AsyncStorage.getItem("uid");
        const userRef = db.collection("users").doc(uid);
        const data = {
          subscriptionInfo: {
            receipt: sortedPurchases[0].transactionReceipt,
            expiry: sortedInApp[0].expires_date_ms,
            originalTransactionId: sortedInApp[0].original_transaction_id,
            originalPurchaseDate: sortedInApp[0].original_purchase_date_ms,
            productId: sortedInApp[0].product_id,
            platform: Platform.OS,
            blogsId: "lifestyleBlogs"
          },
        };
        await userRef.set(data, { merge: true });
        userRef.get().then(async (doc) => {
          if (await doc.data().onboarded) {
            this.setState({ loading: false });
            Alert.alert("Success", "Successfully restored your purchase.");
            this.props.navigation.navigate("App");
          } else {
            this.setState({ loading: false });
            Alert.alert("Success", "Successfully restored your purchase.");
            this.props.navigation.navigate("Onboarding1", {
              name: this.props.navigation.getParam("name", null),
            });
          }
        });
      } else if (
        sortedInApp[0] &&
        sortedInApp[0].expires_date_ms < Date.now()
      ) {
        this.setState({ loading: false });
        Alert.alert("Expired", "Your most recent subscription has expired");
      } else {
        this.setState({ loading: false });
        Alert.alert("No purchase information available");
      }
    } catch (err) {
      this.setState({ loading: false });
      Alert.alert("No current subscriptions to restore");
    }
  };
  // GRAND UNIFIED
  restoreAndroidPurchases = async () => {
    this.setState({ loading: true });
    await restoreAndroidPurchases(this.props).catch(() =>
      this.setState({ loading: false })
    );
    this.setState({ loading: false });
  };

  loadProducts = async () => {
    this.setState({ loading: true });
    if (Platform.OS === "ios") {
      this.loadiOSProducts();
    } else if (Platform.OS === "android") {
      this.loadAndroidProducts();
    }
  };

  loadAndroidProducts = async () => {
    try {
      RNIap.getSubscriptions(itemSkus)
        .then((products) => {
          if (products.length == 0) {
            // IAP products not retrieved (App Store server down, etc.)
            this.setState({ loading: false });
            Alert.alert(
              "Unable to connect to the Play Store",
              "Please try again later",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Try Again",
                  onPress: () => this.retryLoadProductsAND(),
                },
              ],
              { cancelable: false }
            );
          } else {
            const sortedProducts = this.convertToProduct(
              products.slice().sort(compareProducts)
            );
            this.setState({ products: sortedProducts, loading: false });
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          Alert.alert(
            "Unable to connect to the Play Store",
            "Please try again later"
          );
        });
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }
  };

  loadiOSProducts = async () => {

    const {challengesOnly} = this.state
    const uid = await AsyncStorage.getItem("uid");
    const activeChallenges = await getValidChallenges(uid);
    const productIdentifiers = identifiers(
      activeChallenges.map(c => c.id), 
      challengesOnly ? lifeStyleIdentifiers.map(l => l.identifier) : [])

    await InAppUtils.loadProducts(productIdentifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later"
        );
      } else if (products.length == 0) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Try Again",
              onPress: () => this.retryLoadProducts(),
            },
          ],
          { cancelable: false }
        );
      } else {
        const sortedProducts = products.sort(compareProducts);

        //Split products into renewable and non-renewable ite
        const groupedProducts = sortedProducts.reduce((result, product) => { 
            if(lifeStyleIdentifiers.some(p => p.identifier == product.identifier)) {
              result.renewable.push(product)
            } else {
              result.nonRenewable.push(product)
            }
            return result
        }, {
          renewable: [],
          nonRenewable: []
        })

        this.setState({ 
          products: sortedProducts,
          groupedProducts: groupedProducts, 
          loading: false 
        })
      }
    });
  };

  loadDiscountedProducts = async () => {
    this.setState({ loading: true });
    Alert.alert("", "Discounts applied");
    if (Platform.OS === "ios") {
      this.loadDiscountediOSProducts();
    } else if (Platform.OS === "android") {
      this.loadAndroidDiscountedProducts();
    }
  };

  loadAndroidDiscountedProducts = async () => {
    RNIap.getSubscriptions(discountedItemSku)
      .then((products) => {
        if (products.length == 0) {
          // IAP products not retrieved (App Store server down, etc.)
          this.setState({ loading: false });
          Alert.alert(
            "Unable to connect to the Play Store",
            "Please try again later",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Try Again",
                onPress: () => this.retryLoadDiscountedProducts(),
              },
            ],
            { cancelable: false }
          );
        } else {
          const sortedProducts = this.convertToProduct(
            products.slice().sort(compareProducts)
          );
          this.setState({ discountedProducts: sortedProducts, loading: false });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the Play Store",
          "Please try again later"
        );
      });
  };

  loadDiscountediOSProducts = async () => {
    await InAppUtils.loadProducts(discountedIdentifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later"
        );
      } else if (products.length == 0) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Try Again",
              onPress: () => this.retryLoadDiscountedProductsAND(),
            },
          ],
          { cancelable: false }
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ discountedProducts: sortedProducts, loading: false });
      }
    });
  };

  retryLoadProducts = () => {
    this.setState({ loading: true });
    if (Platform.OS === "ios") {
      this.retryLoadiOSProducts();
    } else if (Platform.OS === "android") {
      this.loadAndroidProducts();
    }
  };

  retryLoadiOSProducts = async () => {

    const {challengesOnly} = this.state
    const uid = await AsyncStorage.getItem("uid");
    const activeChallenges = await getValidChallenges(uid);
    const productIdentifiers = identifiers(
      activeChallenges.map(c => c.id), 
      challengesOnly ? lifeStyleIdentifiers.map(l => l.identifier) : [])

    InAppUtils.loadProducts(productIdentifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later"
        );
      } else if (products.length == 0) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Try Again",
              onPress: () => this.loadiOSProducts(),
            },
          ],
          { cancelable: false }
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ products: sortedProducts, loading: false });
      }
    });
  };

  retryLoadDiscountedProducts = () => {
    this.setState({ loading: true });
    if (Platform.OS === "ios") {
      this.retryLoadDiscountediOSProducts();
    } else if (Platform.OS === "android") {
      this.loadAndroidDiscountedProducts();
    }
  };

  retryLoadDiscountediOSProducts = () => {
    this.setState({ loading: true });
    InAppUtils.loadProducts(discountedIdentifiers, (error, products) => {
      if (error) {
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later"
        );
      } else if (products.length == 0) {
        // IAP products not retrieved (App Store server down, etc.)
        this.setState({ loading: false });
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Try Again",
              onPress: () => this.loadDiscountedProducts(),
            },
          ],
          { cancelable: false }
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        this.setState({ discountedProducts: sortedProducts, loading: false });
      }
    });
  };

  purchaseProduct = async (
    productIdentifier,
    productPrice,
    productCurrencyCode
  ) => {
    this.setState({ loading: true });
    Haptics.selectionAsync();
    if (productIdentifier === undefined) {
      Alert.alert("No subscription selected");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "ios") {
      await this.iOSPurchaseProductIdentifier(
        productIdentifier,
        productPrice,
        productCurrencyCode
      );
    } else if (Platform.OS === "android") {
      RNIap.requestSubscription(productIdentifier);
    }
  };

  iOSPurchaseProductIdentifier = async (
    productIdentifier,
    productPrice,
    productCurrencyCode
  ) => {
    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        this.setState({ loading: false });
        Alert.alert(
          "Not Allowed",
          "This device is not allowed to make purchases. Please check restrictions on device"
        );
        return;
      }
      InAppUtils.purchaseProduct(productIdentifier, async (error, response) => {
        if (error) {
          this.setState({ loading: false });
          Alert.alert("Purchase cancelled");
          return;
        }

        const validationData = await this.validate(response.transactionReceipt)
        const inApppPurchase = validationData?.receipt?.in_app.find(r => r.transaction_id == response.transactionIdentifier)

        if (inApppPurchase === undefined) {
          this.setState({ loading: false });
          Alert.alert("Receipt validation error");
          return;
        }
        
        if(transformIdentifiers.some(t=> t.identifier == inApppPurchase.product_id)) {
          // If this is a transform product
          this.linkPurchasedChallengeToUser(inApppPurchase)
        } else if (lifeStyleIdentifiers.some(l => l.identifier == inApppPurchase.product_id) && inApppPurchase.expires_date_ms > Date.now()) {
          this.linkLifestyleSubscriptionToUser(response, inApppPurchase, productPrice, productCurrencyCode)
        } else {
          this.setState({ loading: false })
          Alert.alert("Purchase Unsuccessful")
        }
      });
    });
  };

  purchaseDiscountedProduct = async (
    productIdentifier,
    productPrice,
    productCurrencyCode
  ) => {
    this.setState({ loading: true });
    Haptics.selectionAsync();
    if (productIdentifier === undefined) {
      Alert.alert("No subscription selected");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "ios") {
      await this.iOSPurchaseDiscountedProductIdentifier(
        productIdentifier,
        productPrice,
        productCurrencyCode
      );
    } else if (Platform.OS === "android") {
      RNIap.requestSubscription(productIdentifier);
    }
  };

  iOSPurchaseDiscountedProductIdentifier = async (
    productIdentifier,
    productPrice,
    productCurrencyCode
  ) => {
    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        this.setState({ loading: false });
        Alert.alert(
          "Not Allowed",
          "This device is not allowed to make purchases. Please check restrictions on device"
        );
        return;
      }
      InAppUtils.loadProducts(discountedIdentifiers, (loadError) => {
        if (loadError) {
          this.setState({ loading: false });
          Alert.alert(
            "Unable to connect to the App Store",
            "Please try again later"
          );
        }
        InAppUtils.purchaseProduct(
          productIdentifier,
          async (error, response) => {
            if (error) {
              this.setState({ loading: false });
              Alert.alert("Purchase cancelled");
              return;
            }
            if (response && response.productIdentifier) {
              const validationData = await this.validate(
                response.transactionReceipt
              );
              if (validationData === undefined) {
                this.setState({ loading: false });
                Alert.alert("Receipt validation error");
                return;
              }
              const sortedInApp = validationData.receipt.in_app
                .slice()
                .sort(compareInApp);
              const isValid =
                sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now();
              if (isValid === true) {
                const uid = await AsyncStorage.getItem("uid");
                const userRef = db.collection("users").doc(uid);
                const data = {
                  subscriptionInfo: {
                    receipt: response.transactionReceipt,
                    expiry: sortedInApp[0].expires_date_ms,
                    originalTransactionId:
                      sortedInApp[0].original_transaction_id,
                    originalPurchaseDate:
                      sortedInApp[0].original_purchase_date_ms,
                    productId: sortedInApp[0].product_id,
                    platform: Platform.OS,
                    blogsId: "lifestyleBlogs"
                  },
                };
                await userRef.set(data, { merge: true });
                // Appsflyer event tracking - Start Free Trial
                const eventName = "af_start_trial";
                const eventValues = {
                  af_price: productPrice,
                  af_currency: productCurrencyCode,
                };
                appsFlyer.trackEvent(eventName, eventValues);
                userRef.get().then(async (doc) => {
                  this.setState({ loading: false });
                  if (await doc.data().onboarded) {
                    this.props.navigation.navigate("App");
                  } else {
                    this.props.navigation.navigate("Onboarding1", {
                      name: this.props.navigation.getParam("name", null),
                    });
                  }
                });
              } else if (isValid === false) {
                this.setState({ loading: false });
                Alert.alert("Purchase Unsuccessful");
              } else {
                this.setState({ loading: false });
                Alert.alert("Something went wrong", `${isValid.message}`);
              }
            }
          }
        );
      });
    });
  };

  linkLifestyleSubscriptionToUser = async (response, validated_in_app_recipet, productPrice, productCurrencyCode) => {
    const uid = await AsyncStorage.getItem("uid");
    const userRef = db.collection("users").doc(uid);
    const data = {
      subscriptionInfo: {
        receipt: response.transactionReceipt,
        expiry: validated_in_app_recipet.expires_date_ms,
        originalTransactionId: validated_in_app_recipet.original_transaction_id,
        originalPurchaseDate: validated_in_app_recipet.original_purchase_date_ms,
        productId: validated_in_app_recipet.product_id,
        platform: Platform.OS,
        blogsId: "lifestyleBlogs"
      },
    }
    await userRef.set(data, { merge: true });
    // Appsflyer event tracking - Start Free Trial
    const eventValues = {
      af_price: productPrice,
      af_currency: productCurrencyCode,
    }
    appsFlyer.trackEvent(
      "af_start_trial", 
      eventValues);
    
    userRef
      .get()
      .then(async (doc) => {
        this.setState({ loading: false });
        if (await doc.data().onboarded) {
          this.props.navigation.navigate("App");
        } else {
          this.props.navigation.navigate("Onboarding1", {
            name: this.props.navigation.getParam("name", null),
          });
        }
      })  
  }

  linkPurchasedChallengeToUser = async (validated_in_app_recipet) => {

        // Get a user reference
    const uid = await AsyncStorage.getItem("uid")
    const userRef = db.collection("users").doc(uid)

    const inAppPurchases = {
      originalTransactionId: validated_in_app_recipet.original_transaction_id,
      originalPurchaseDate: validated_in_app_recipet.original_purchase_date_ms,
      transactionId: validated_in_app_recipet.transaction_id,
      productId: validated_in_app_recipet.product_id,
      platform: Platform.OS
    }

    await userRef.update({inAppPurchases: firestore.FieldValue.arrayUnion(inAppPurchases) })
    
    // Helper function to go to next screen
    const goToNextScreen = async () => {
      const userDocument = await userRef.get()
      if(this.state.dismissOnSuccess) {
        this.props.navigation.dismiss()
      } if(userDocument.data().onboarded) {
        this.props.navigation.navigate("App");
      } else {
        this.props.navigation.navigate("Onboarding1", {
          name: this.props.navigation.getParam("name", null),
        })
      }
    }

    const { challengeId } = transformIdentifiers.find(t => t.identifier == validated_in_app_recipet.product_id)
    const userChallenge = await getUserChallenge(userRef, challengeId)
    
    // Check if this challenge has already been assigned to the given user
    // If they already have this challenge, ignore it for now
    if (userChallenge) {
      console.log("user already has challenge:", userChallenge.name);
      goToNextScreen()
      return
    }

    // Get a copy of the purchased challenge
    const challengeDetails = await db.collection("challenges")
      .doc(challengeId)
      .get()

    const newUserChallenge = createNewChallengeModel(challengeDetails.data())

    if(!newUserChallenge) {
      return
    }
    await userRef
      .collection('challenges')
      .doc(newUserChallenge.id)
      .set(newUserChallenge, { merge: true })

    goToNextScreen()
  }

  handleAndroidPayment = async (purchase) => {
    if (purchase.purchaseStateAndroid !== 1) {
      Alert.alert("Play Connect", "Transaction is not completed.");
      return;
    }
    const androidData = JSON.parse(purchase.dataAndroid);
    const access_token = await getAndroidToken();
    const purchaseDetails = await getAndroidSubscriptionDetails(
      androidData.packageName,
      purchase.productId,
      purchase.purchaseToken,
      access_token
    );
    const details = await purchaseDetails();

    if (details.error) {
      this.setState({ loading: false });
      Alert.alert(details.error.message);
      return;
    }

    const expiryDate = Number(details.expiryTimeMillis);
    const isValid = expiryDate > Date.now();

    if (isValid === true) {
      const uid = await AsyncStorage.getItem("uid");
      const userRef = db.collection("users").doc(uid);
      const data = {
        subscriptionInfo: {
          receipt: purchase.transactionReceipt,
          expiry: Number(details.expiryTimeMillis),
          originalTransactionId: purchase.transactionId,
          originalPurchaseDate: Number(androidData.purchaseTime),
          productId: replaceTestAndroidProduct(purchase.productId),
          platform: Platform.OS,
          blogsId: "lifestyleBlogs"
        },
      };
      await userRef.set(data, { merge: true });
      // Appsflyer event tracking - Start Free Trial
      const eventName = "af_start_trial";
      const eventValues = {
        af_price: details.priceAmountMicros / 1000000,
        af_currency: details.priceCurrencyCode,
      };
      appsFlyer.trackEvent(eventName, eventValues);
      userRef.get().then(async (doc) => {
        this.setState({ loading: false });
        if (await doc.data().onboarded) {
          this.props.navigation.navigate("App");
        } else {
          this.props.navigation.navigate("Onboarding1", {
            name: this.props.navigation.getParam("name", null),
          });
        }
      });
    } else if (isValid === false) {
      this.setState({ loading: false });
      Alert.alert("Purchase Unsuccessful");
    } else {
      this.setState({ loading: false });
      Alert.alert("Something went wrong", `${isValid.message}`);
    }
  };

  validate = async (receiptData) => {
    const validationData = await validateReceiptProduction(receiptData).catch(
      async (error) => {
        if (error.redirect) {
          const validationDataSandbox = await validateReceiptSandbox(
            receiptData
          );
          return validationDataSandbox;
        }
        return undefined;
      }
    );
    return validationData;
  };

  handleClick() {
    const {
      products,
      discountedProducts,
      specialOffer,
      selectedId,
    } = this.state;

    const product = products.find(p => p.identifier == selectedId)

    if (!specialOffer && product) {
      this.purchaseProduct(
        product.identifier,
        product.price,
        product.currencyCode
      );
    } else if (specialOffer && discountedProducts && product) {
      this.purchaseDiscountedProduct(
        product.identifier,
        product.price,
        product.currencyCode
      );
    } else {
      Alert.alert("Something went please try again...");
    }
  }

  render() {
    const {
      loading,
      groupedProducts,
      products,
      specialOffer,
      selectedId,
    } = this.state;

    const renderProducts = (products, heading, subHeading) => {
      if(products?.length <= 0) return null
      return (
        <View style={styles.subscriptionTileRow}>
          { heading && (<Text style={styles.productSectionHeader}>{heading}</Text>)}
          { subHeading && (<Text style={styles.productSectionSubheader}>{subHeading}</Text>) }
          { products &&
            products.map((product, index) => (
              <SubscriptionTile
                key={product.identifier}
                primary={true}
                title={ Platform.OS === "ios" ? productTitle(product.identifier) : productTitleMapAndroid[index] }
                price={product.priceString}
                priceNumber={product.price}
                currencyCode={product.currencyCode}
                currencySymbol={product.currencySymbol}
                onPress={() => this.setState({ selectedId: product.identifier })}
                selected={selectedId === product.identifier}
                term={
                  Platform.OS === "android"
                    ? andriodSubscriptionTitleMap[index]
                    : productPeriod(product.identifier)
                }
                trialPeriod={trialPeriod(product.identifier)}
                savingsPercent={savingPercentage(product.identifier)}
                additionalText={productAdditionalText(product.identifier)}
              />
            ))}
      </View>
      )
    }

    return (
      <React.Fragment>
        <View style={styles.container}>
          <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
            <ImageBackground
              source={require("../../../assets/images/OnBoardindImg/subscriptionBGV2.png")}
              style={styles.imageBackgroundContainer}
            >
              <View style={{ paddingHorizontal: 10 }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: fonts.bold
                  }}>
                    Become a happier, healthier you!
                </Text>
              </View>
            </ImageBackground>
            <View style={styles.contentContainer}>
              <Text
                style={{
                  fontFamily: fonts.GothamMedium,
                  fontSize: 12,
                  color: colors.grey.dark,
                  textAlign: "center",
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                Choose your payment option
              </Text>
      
              {!specialOffer&& groupedProducts && renderProducts(groupedProducts?.renewable,  "Auto-renewing products", "(include a free trial & auto-renew unless cancelled)" )}
              {!specialOffer && groupedProducts && renderProducts(groupedProducts?.nonRenewable, "One-off purchases", "(do not include free trials & do not auto-renew)") }
              {!specialOffer && !groupedProducts && renderProducts(products) }

            </View>
            <View>
              <CustomBtn
                customBtnStyle={{
                  marginHorizontal: containerPadding,
                  borderRadius: 50,
                  marginTop: 20,
                  marginBottom: 10,
                }}
                Title="Start"
                onPress={() => this.handleClick()}
              />
              <Icon
                name="chevron-up"
                size={8}
                color={colors.charcoal.dark}
                style={styles.chevronUp}
              />
              <View
                style={{
                  backgroundColor: 'black',
                  marginHorizontal: 15,
                  marginTop: 5
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: fonts.bold,
                    fontSize: 10,
                    margin: 8,
                  }}>
                  Please note the equipment you need for a Transform challenge will need to be purchased separately.
                </Text>
              </View>
              <View style={styles.disclaimerTextContainer}>
                <Text style={styles.disclaimerText}>
                  <Text style={styles.subscriptionTermsTitle}>
                    Subscription Terms:{" "}
                  </Text>
                  {"By continuing, you accept our "}
                  <Text
                    onPress={() =>
                      this.openLink(
                        "https://fitazfk.com/pages/fitazfk-app-privacy-policy"
                      )
                    }
                    style={styles.link}
                  >
                    Privacy Policy
                  </Text>
                  {" and "}
                  <Text
                    onPress={() =>
                      this.openLink(
                        "https://fitazfk.com/pages/fitazfk-app-terms-conditions"
                      )
                    }
                    style={styles.link}
                  >
                    Terms and Conditions
                  </Text>
                  . If you are purchasing one of our Auto-renewing products you also agree that an ongoing subscription to the Fitazfk app (Fitazfk Fitness & Nutrition) will be applied to your iTunes account at the end of your 7 day free trial. Subscriptions will automatically renew and your account charged unless auto-renew is turned off at least 24 hours before the end of the current billing period. Subscriptions to these auto-renewing products may be managed by the user and auto-renewal may be turned off by going to the user's Account Settings after purchase.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        {loading && <NativeLoader />}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.themeColor.themeBackgroundColor,
    alignItems: "center",
  },
  imageBackgroundContainer: {
    height: width / 2,
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    justifyContent: 'center'
  },
  opacityLayer: {

  },
  headerContainer: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingBottom: 15,
    paddingLeft: 25,
  },
  smallheaderText: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.black,
    textAlign: "center",
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 30,
    color: colors.offWhite,
    textAlign: "center",
  },
  headerText2: {
    fontSize: 30,
    marginTop: 0,
    fontWeight: "700",
    fontStyle: "italic",
    color: colors.themeColor.color,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    width,
  },
  subscriptionTileRow: {
    marginLeft: 10,
    paddingRight: 10,
    paddingBottom: 16
  },
  productSectionHeader: {
    marginLeft: 10,
    fontFamily: fonts.bold,
    fontSize: wp("4%"),
    textTransform: "uppercase"
  },
  productSectionSubheader: {
    marginLeft: 10,
    fontFamily: fonts.bold,
    fontSize: wp("2%"),
    textTransform: "uppercase"
  },
  chevronUp: {
    alignSelf: "center",
  },
  disclaimerTextContainer: {
    width,
    padding: 20,
    paddingTop: 10,
  },
  link: {
    color: colors.blue.standard,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
  },
  subscriptionTermsTitle: {
    fontFamily: fonts.bold,
    fontSize: 8,
    color: colors.black,
  },
  disclaimerText: {
    fontFamily: fonts.standard,
    fontSize: 8,
    color: colors.black,
  },
});
