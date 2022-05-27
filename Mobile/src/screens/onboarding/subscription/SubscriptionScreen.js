import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  NativeModules,
  Alert,
  Linking,
  ImageBackground,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import appsFlyer from "react-native-appsflyer";
import { auth, db } from "../../../config/firebase";
import {
  discountedIdentifiers,
  identifiers,
  compareProducts,
  validateReceiptProduction,
  validateReceiptSandbox,
  compareInApp,
} from "../../../config/apple";
import SubscriptionTile from "../../../components/Onboarding/SubscriptionTile";
import NativeLoader from "../../../components/Shared/NativeLoader";
import Icon from "../../../components/Shared/Icon";
import colors from "../../../styles/colors";
import RNIap, {
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from "react-native-iap";
import CustomBtn from "../../../components/Shared/CustomBtn";
import { containerPadding } from "../../../styles/globalStyles";
import { ONBOARDINGIMG } from "../../../library/images/onBoardingImg/onBoardingImg";
import { styles } from "./style";
import { useStorage } from '../../../hook/storage'

export const SubscriptionScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState(undefined)
  const [discountedProducts, setDiscountedProducts] = useState(undefined)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const InAppUtils = NativeModules;
  const specialOffer = navigation.getParam("specialOffer", undefined)
  const productTitleMapIOS = {
    0: "Yearly ",
    1: "Monthly ",
  };
  const productTitleMapAndroid = {
    0: "Monthly ",
    1: "Yearly ",
  };
  const subscriptionPeriodMap = {
    "com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount": "month",
    "com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted": "year",
    "com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation": "month",
    "com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation": "year",
    "com.fitazfk.fitazfkapp.sub.fullaccess.monthly": "month",
    "com.fitazfk.fitazfkapp.sub.fullaccess.yearly": "year",
  };
  const andriodSubscriptionTitleMap = {
    0: "year",
    1: "month",
  };

  const openLink = (url) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(url);
  };

  const logout = () => {
    try {
      useStorage.removeItem("uid");
      auth.signOut();
      navigation.navigate("Auth");
    } catch (err) {
      console.log("Error logging out: ", err)
    }
  };

  const convertToProduct = (products) => {
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

  const androidSubscriptions = async () => {
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        const receipt = purchase.transactionReceipt;

        if (receipt) {
          try {
            await finishTransaction(purchase)
              .catch(() => setLoading(false));

            if (Platform.OS === "android") {
              handleAndroidPayment(purchase);
            }
          } catch (err) {
            Alert.alert("purchase error", error.message);
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

  const validate = async (receiptData) => {
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

  const iOSPurchaseProductIdentifier = async (
    productIdentifier,
    productPrice,
    productCurrencyCode
  ) => {
    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        setLoading(false)
        Alert.alert(
          "Not Allowed",
          "This device is not allowed to make purchases. Please check restrictions on device"
        );
        return;
      }
      InAppUtils.purchaseProduct(productIdentifier, async (error, response) => {
        if (error) {
          setLoading(false)
          Alert.alert("Purchase cancelled");
          return;
        }

        if (response && response.productIdentifier) {
          const validationData = await validate(
            response.transactionReceipt
          );
          if (validationData === undefined) {
            setLoading(false)
            Alert.alert("Receipt validation error");
            return;
          }
          const sortedInApp = validationData.receipt.in_app
            .slice()
            .sort(compareInApp);
          const isValid =
            sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now();
          if (isValid === true) {
            const uid = await useStorage.getItem("uid");
            const userRef = db.collection("users").doc(uid);
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
            const eventName = "af_start_trial";
            const eventValues = {
              af_price: productPrice,
              af_currency: productCurrencyCode,
            };
            appsFlyer.trackEvent(eventName, eventValues);
            userRef.get().then(async (doc) => {
              setLoading(false)
              if (await doc.data().onboarded) {
                navigation.navigate("App");
              } else {
                navigation.navigate("Onboarding1", {
                  name: navigation.getParam("name", null),
                });
              }
            });
          } else if (isValid === false) {
            setLoading(false)
            Alert.alert("Purchase Unsuccessful");
          } else {
            setLoading(false)
            Alert.alert("Something went wrong", `${isValid.message}`);
          }
        }
      });
    });
  };

  const purchaseProduct = async (
    productIdentifier,
    productPrice,
    productCurrencyCode
  ) => {
    setLoading(true)
    Haptics.selectionAsync();
    if (productIdentifier === undefined) {
      Alert.alert("No subscription selected");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "ios") {
      await iOSPurchaseProductIdentifier(
        productIdentifier,
        productPrice,
        productCurrencyCode
      );
    } else if (Platform.OS === "android") {
      RNIap.requestSubscription(productIdentifier);
    }
  };

  const iOSPurchaseDiscountedProductIdentifier = async (
    productIdentifier,
    productPrice,
    productCurrencyCode
  ) => {
    InAppUtils.canMakePayments((canMakePayments) => {
      if (!canMakePayments) {
        setLoading(false)
        Alert.alert(
          "Not Allowed",
          "This device is not allowed to make purchases. Please check restrictions on device"
        );
        return;
      }
      InAppUtils.loadProducts(discountedIdentifiers, (loadError) => {
        if (loadError) {
          setLoading(false)
          Alert.alert(
            "Unable to connect to the App Store",
            "Please try again later"
          );
        }
        InAppUtils.purchaseProduct(
          productIdentifier,
          async (error, response) => {
            if (error) {
              setLoading(false)
              Alert.alert("Purchase cancelled");
              return;
            }
            if (response && response.productIdentifier) {
              const validationData = await validate(
                response.transactionReceipt
              );
              if (validationData === undefined) {
                setLoading(false)
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
                  setLoading(false)
                  if (await doc.data().onboarded) {
                    navigation.navigate("App");
                  } else {
                    navigation.navigate("Onboarding1", {
                      name: navigation.getParam("name", null),
                    });
                  }
                });
              } else if (isValid === false) {
                setLoading(false)
                Alert.alert("Purchase Unsuccessful");
              } else {
                setLoading(false)
                Alert.alert("Something went wrong", `${isValid.message}`);
              }
            }
          }
        );
      });
    });
  };

  const retryLoadProducts = () => {
    setLoading(true)
    if (Platform.OS === "ios") {
      retryLoadiOSProducts();
    } else if (Platform.OS === "android") {
      loadAndroidProducts();
    }
  };

  const retryLoadiOSProducts = () => {
    InAppUtils.loadProducts(identifiers, (error, products) => {
      if (error) {
        setLoading(false)
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later"
        );
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        setLoading(false)
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
              onPress: () => loadiOSProducts(),
            },
          ],
          { cancelable: false }
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        setProducts(sortedProducts)
        setLoading(false)
      }
    });
  };

  const retryLoadDiscountedProducts = () => {
    setLoading(true)
    if (Platform.OS === "ios") {
      retryLoadDiscountediOSProducts();
    } else if (Platform.OS === "android") {
      loadAndroidDiscountedProducts();
    }
  };

  const retryLoadDiscountediOSProducts = () => {
    setLoading(true)
    InAppUtils.loadProducts(discountedIdentifiers, (error, products) => {
      if (error) {
        setLoading(false)
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later"
        );
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        setLoading(false)
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
              onPress: () => loadDiscountedProducts(),
            },
          ],
          { cancelable: false }
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        setDiscountedProducts(sortedProducts)
        setLoading(false)
      }
    });
  };

  const loadDiscountedProducts = async () => {
    setLoading(true)
    Alert.alert("", "Discounts applied");
    if (Platform.OS === "ios") {
      loadDiscountediOSProducts();
    } else if (Platform.OS === "android") {
      loadAndroidDiscountedProducts();
    }
  };

  const loadAndroidDiscountedProducts = async () => {
    RNIap.getSubscriptions(discountedItemSku)
      .then((products) => {
        if (products.length !== 2) {
          // IAP products not retrieved (App Store server down, etc.)
          setLoading(false)
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
                onPress: () => retryLoadDiscountedProducts(),
              },
            ],
            { cancelable: false }
          );
        } else {
          const sortedProducts = convertToProduct(products.slice().sort(compareProducts));
          setDiscountedProducts(sortedProducts)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        Alert.alert(
          "Unable to connect to the Play Store",
          "Please try again later"
        );
      });
  };

  const loadDiscountediOSProducts = async () => {
    await InAppUtils.loadProducts(discountedIdentifiers, (error, products) => {
      if (error) {
        setLoading(false)
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later"
        );
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        setLoading(false)
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
              onPress: () => retryLoadDiscountedProducts(),
            },
          ],
          { cancelable: false }
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        setDiscountedProducts(sortedProducts)
        setLoading(false)      }
    });
  };

  const purchaseDiscountedProduct = async (
    productIdentifier,
    productPrice,
    productCurrencyCode
  ) => {
    setLoading(true)
    Haptics.selectionAsync();
    if (productIdentifier === undefined) {
      Alert.alert("No subscription selected");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (Platform.OS === "ios") {
      await iOSPurchaseDiscountedProductIdentifier(
        productIdentifier,
        productPrice,
        productCurrencyCode
      );
    } else if (Platform.OS === "android") {
      RNIap.requestSubscription(productIdentifier);
    }
  };

  const loadProducts = async () => {
    setLoading(true)
    if (Platform.OS === "ios") {
      loadiOSProducts();
    } else if (Platform.OS === "android") {
      loadAndroidProducts();
    }
  };

  const loadAndroidProducts = async () => {
    try {
      RNIap.getSubscriptions(itemSkus)
        .then((products) => {
          if (products.length !== 2) {
            // IAP products not retrieved (App Store server down, etc.)
            setLoading(false)
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
                  onPress: () => retryLoadProducts(),
                },
              ],
              { cancelable: false }
            );
          } else {
            const sortedProducts = convertToProduct(
              products.slice().sort(compareProducts)
            );
            setProducts(sortedProducts)
            setLoading(false)
          }
        })
        .catch((error) => {
          setLoading(false)
          Alert.alert(
            "Unable to connect to the Play Store",
            "Please try again later"
          );
        });
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }
  };

  const loadiOSProducts = async () => {
    await InAppUtils.loadProducts(identifiers, (error, products) => {
      if (error) {
        setLoading(false)
        Alert.alert(
          "Unable to connect to the App Store",
          "Please try again later"
        );
      } else if (products.length !== 2) {
        // IAP products not retrieved (App Store server down, etc.)
        setLoading(false)
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
              onPress: () => retryLoadProducts(),
            },
          ],
          { cancelable: false }
        );
      } else {
        const sortedProducts = products.slice().sort(compareProducts);
        setProducts(sortedProducts)
        setLoading(false)
      }
    });
  };

  const handleClick = () => {
    if (!specialOffer && products) {
      purchaseProduct(
        products[selectedIndex].identifier,
        products[selectedIndex].price,
        products[selectedIndex].currencyCode
      );
    } else if (specialOffer && discountedProducts && products) {
      purchaseDiscountedProduct(
        products[selectedIndex].identifier,
        products[selectedIndex].price,
        products[selectedIndex].currencyCode
      );
    } else {
      console.log("Something went please try again...")
    }
  }

  useEffect(() => {
    navigation.setParams({ handleLogout: logout });
  }, [])

  useEffect(() => {
    async () => {
      await RNIap.initConnection();
    }
  }, [])

  useEffect(() => {
    androidSubscriptions();
  }, [])

  useEffect(() => {
    async () => {
      if (specialOffer) {
        await loadDiscountedProducts();
        await loadProducts();
      } else {
        await loadProducts();
      }
    }
  }, [])
  console.log("products: ", products)
  return (
    <React.Fragment>
      <View style={styles.container}>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
          <ImageBackground
            source={ONBOARDINGIMG.SUBSCRIPTIONBG}
            style={styles.imageBackgroundContainer}
          >
            <View style={styles.headerContainer}>
            </View>
          </ImageBackground>
          <View style={styles.contentContainer}>
            <Text style={styles.paymentOptionText}>
              Choose your payment option
            </Text>
            <View style={styles.subscriptionTileRow}>
              {!specialOffer &&
                products &&
                products.map((product, index) => (
                  <SubscriptionTile
                    key={product.identifier}
                    primary={
                      product.identifier.indexOf(
                        "fitazfkapp.sub.fullaccess.monthly"
                      ) > 0 ||
                      product.identifier.indexOf(
                        "fitazfkapp.sub.fullaccess.monthly.discount"
                      ) > 0
                    }
                    title={
                      Platform.OS === "ios"
                        ? productTitleMapIOS[index]
                        : productTitleMapAndroid[index]
                    }
                    price={product.priceString}
                    priceNumber={product.price}
                    currencyCode={product.currencyCode}
                    currencySymbol={product.currencySymbol}
                    onPress={() => setSelectedIndex(index)}
                    selected={selectedIndex === index}
                    term={
                      Platform.OS === "android"
                        ? andriodSubscriptionTitleMap[index]
                        : subscriptionPeriodMap[product.identifier]
                    }
                  />
                ))}
            </View>
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
              onPress={() => handleClick()}
            />
            <Icon
              name="chevron-up"
              size={8}
              color={colors.charcoal.dark}
              style={styles.chevronUp}
            />
            <View style={styles.disclaimerTextContainer}>
              <Text style={styles.disclaimerText}>
                <Text style={styles.subscriptionTermsTitle}>
                  Subscription Terms:{" "}
                </Text>
                {"By continuing, you accept our "}
                <Text
                  onPress={() =>
                    openLink(
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
                    openLink(
                      "https://fitazfk.com/pages/fitazfk-app-terms-conditions"
                    )
                  }
                  style={styles.link}
                >
                  Terms and Conditions
                </Text>
                . You also agree that an ongoing subscription to the FitazFK
                App (FitazFK Fitness & Nutrition) will be applied to your
                iTunes account at the end of your{" "}
                {specialOffer ? "1 month" : "7 day"} free trial. Subscriptions
                will automatically renew and your account charged unless
                auto-renew is turned off at least 24-hours before the end of
                the current period. Subscriptions may be managed by the user
                and auto-renewal may be turned off by going to the users
                Account Settings after purchase. Any unused portion of a free
                trial period, if offered, will be forfeited when the user
                purchases a subscription to that publication, where
                applicable.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
      {loading && <NativeLoader />}
    </React.Fragment>
  );
}