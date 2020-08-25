const { SubscriptionDetails, SubscriptionNotFoundError, SubscriptionExpiredError, UnknownError, UnableToRetriveSubscriptionError } = require('./models.js');
const productionHost = 'buy.itunes.apple.com';
const sandboxHost = 'sandbox.itunes.apple.com';
const password = '4c613681bae44a4a956e11e6411d86fd'; // Shared Secret from iTunes connect
const sandboxTesting = false;
const statusCodes = {
  [0]: { message: 'Active', valid: true, error: false },
  [21000]: { message: 'App store could not read', valid: false, error: true },
  [21002]: { message: 'Data was malformed', valid: false, error: true },
  [21003]: { message: 'Receipt not authenticated', valid: false, error: true },
  [21004]: { message: 'Shared secret does not match', valid: false, error: true },
  [21005]: { message: 'Receipt server unavailable', valid: false, error: true },
  [21006]: { message: 'Receipt valid but sub expired', valid: true, error: false },
  /**
   * special case for app review handling - forward any request that is intended for the Sandbox but was sent to
   * Production, this is what the app review team does
   */
  [21007]: { message: 'Sandbox receipt sent to Production environment', valid: false, error: true, redirect: true },
  [21008]: { message: 'Production receipt sent to Sandbox environment', valid: false, error: true },
};

const receiptRequest = (password, production = true) => {
  const endpoint = production ? productionHost : sandboxHost;
  const verifyUrl = `https://${endpoint}/verifyReceipt`;

  return async (receipt) => {
    const payload = {
      'receipt-data': receipt,
      password,
    };

    const options = {
      body: JSON.stringify(payload),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await fetch(verifyUrl, options);
    const body = await res.json();

    return body;
  };
}
exports.getAppleSubscriptions = async (receipt) => {
  const subscription = new SubscriptionDetails();
  const request = await receiptRequest(password, sandboxTesting);
  const receiptInfo = await request();
  if (receiptInfo.status !== 0 ) {
    switch (receiptInfo.status) {
      case 21000:
      case 21002:
      case 21003:
      case 21005:
      case 21007:
      case 21008:
        subscription.error = new UnableToRetriveSubscriptionError();
      case 21004:
        subscription.error = new SubscriptionNotFoundError();
      case 21006:
        //expired
        subscription.error = new SubscriptionExpiredError();
        break;
      default:
        subscription.error = new UnknownError();
        errorMessage = statusCodes[receiptInfo.status] ? statusCodes[receiptInfo.status].message : subscription.error.message
    }
    return subscription;
  }
  const sortedInApp = receiptInfo.receipt.in_app.slice().sort(dynamicSort('expires_date_ms'));
  if (sortedInApp[0] && sortedInApp[0].expires_date_ms > Date.now()) {
    //valid one
    subscription.expiry = sortedInApp[0].expires_date_ms;
    subscription.receipt = receiptInfo.latest_receipt;
    subscription.productId = existingSubscriptionInfo.productId;
    subscription.originalPurchaseDate = existingSubscriptionInfo.originalPurchaseDate;
    subscription.originalTransactionId = existingSubscriptionInfo.originalTransactionId;
    subscription.platform = 'ios';
    return subscription;
  } else if (sortedInApp[0] && sortedInApp[0].expires_date_ms < Date.now()) {
    //Expired if not prcessed by switch case
    subscription.error = new SubscriptionExpiredError();
    return subscription;
  } else {
    subscription.error = new UnknownError();
    return subscription;
  }
}