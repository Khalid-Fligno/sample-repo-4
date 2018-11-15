import iapReceiptValidator from 'iap-receipt-validator';

const password = '4c613681bae44a4a956e11e6411d86fd'; // Shared Secret from iTunes connect
const isProduction = true; // true = prod, false = sandbox

export const validateReceipt = iapReceiptValidator(password, isProduction);

export const compare = (a, b) => {
  const purchaseA = a.transactionDate;
  const purchaseB = b.transactionDate;
  let comparison = 0;
  if (purchaseA > purchaseB) {
    comparison = -1;
  } else if (purchaseA < purchaseB) {
    comparison = 1;
  }
  return comparison;
};

export const compareExpiry = (a, b) => {
  const purchaseA = a.expires_date_ms;
  const purchaseB = b.expires_date_ms;
  let comparison = 0;
  if (purchaseA > purchaseB) {
    comparison = -1;
  } else if (purchaseA < purchaseB) {
    comparison = 1;
  }
  return comparison;
};

export const identifiers = [
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.quarterly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly',
];
