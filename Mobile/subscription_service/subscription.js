const { getAndroidSubscriptions } = require('./android.js');
const { getAppleSubscriptions } = require('./apple.js');
const { auth, db } = require('./firebase');
const { SubscriptionDetails, ErrorDetails, UserNotFoundError, SubscriptionNotFoundError } = require('./models.js');

exports.getSubscriptions = async (req, res) => {
  console.log("subscription calling");
  const subscriptionInfo = req.body;
  if (subscriptionInfo === undefined) {
    //Not Subscribed yet on any platform
    const subscription = new SubscriptionDetails();
    subscription.error = new SubscriptionNotFoundError();    
    return res.status(200).send(subscription);
  } else if (subscriptionInfo.expiry < Date.now()) {
    //Subscription is expired restore the subscription details
    const subscription = subscriptionInfo.platform === 'android' ? await getAndroidSubscriptions(subscriptionInfo) : await getAppleSubscriptions(subscriptionInfo);
    
    return res.status(200).send(subscription);
  } else if (subscriptionInfo.expiry > Date.now()) {
    //Subscription is still valid
    const subscription = new SubscriptionDetails();
    subscription.expiry = subscriptionInfo.expiry;
    subscription.receipt = subscriptionInfo.receipt;
    subscription.productId = subscriptionInfo.productId;
    subscription.originalPurchaseDate = subscriptionInfo.originalPurchaseDate;
    subscription.originalTransactionId = subscriptionInfo.originalTransactionId;
    // RECEIPT STILL VALID
    return res.status(200).send(subscription);
  }
}