const { google } = require("googleapis");
const account = require("./service-account.json");
const {
  SubscriptionDetails,
  AndroidTokenNotValidError,
  SubscriptionNotFoundError,
  SubscriptionExpiredError,
  UnknownError,
  UnableToRetriveSubscriptionError,
} = require("./models.js");

const JWTClient = new google.auth.JWT(
  account.client_email,
  null,
  account.private_key,
  ["https://www.googleapis.com/auth/androidpublisher"]
);
exports.getAndroidToken = (req, res) => {
  JWTClient.getAccessToken((err, token) => {
    if (err) {
      return res.status(404).send("get access token failed");
    }
    return res.status(200).send(token);
  });
};
const getAndroidSubscriptionDetails = (
  packageName,
  subscriptionId,
  purchaseToken,
  accessToken
) => {
  const verifyUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${subscriptionId}/tokens/${purchaseToken}?access_token=${accessToken}`;
  return async (receipt) => {
    const options = {
      method: "GET",
    };

    const res = await fetch(verifyUrl, options);
    const body = await res.json();

    return body;
  };
};

const replaceTestAndroidProduct = (productId) => {
  return productId.replace(
    "com.fitazfkapp.fitazfkapp",
    "com.fitazfk.fitazfkapp"
  );
};

exports.getAndroidSubscriptions = async (existingSubscriptionInfo) => {
  const subscription = new SubscriptionDetails();

  try {
    const androidData = JSON.parse(existingSubscriptionInfo.receipt);

    var tokenResponse = await JWTClient.getAccessToken();
    if (tokenResponse == null) {
      subscription.error = new AndroidTokenNotValidError();
      return subscription;
    }
    const access_token = tokenResponse.token;

    const getPurchases = await getAndroidSubscriptionDetails(
      androidData.packageName,
      androidData.productId,
      androidData.purchaseToken,
      access_token
    );
    const purchaseDetails = await getPurchases();
    if (!purchaseDetails) {
      subscription.error = new SubscriptionNotFoundError();
      return subscription;
    }
    console.log(purchaseDetails);
    const expiryTime = Number(purchaseDetails.expiryTimeMillis);
    if (expiryTime > Date.now()) {
      subscription.expiry = expiryTime;
      subscription.receipt = existingSubscriptionInfo.receipt;
      subscription.productId = existingSubscriptionInfo.productId;
      subscription.originalPurchaseDate =
        existingSubscriptionInfo.originalPurchaseDate;
      subscription.originalTransactionId =
        existingSubscriptionInfo.originalTransactionId;
      subscription.platform = "android";
      return subscription;
    } else if (expiryTime < Date.now()) {
      //Expired
      subscription.error = new SubscriptionExpiredError();
      return subscription;
    } else {
      //unknown
      subscription.error = new UnknownError();
      return subscription;
    }
  } catch (err) {
    //Unable to retrieve
    subscription.error = new UnableToRetriveSubscriptionError();
    return subscription;
  }
};
