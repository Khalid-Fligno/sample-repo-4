import iapReceiptValidator from 'iap-receipt-validator';

const password = '4c613681bae44a4a956e11e6411d86fd'; // Shared Secret from iTunes connect

export const validateReceiptSandbox = iapReceiptValidator(password, false);

export const validateReceiptProduction = iapReceiptValidator(password, true);

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

export const compareProducts = (a, b) => {
  const purchaseA = a.price;
  const purchaseB = b.price;
  let comparison = 0;
  if (purchaseA > purchaseB) {
    comparison = -1;
  } else if (purchaseA < purchaseB) {
    comparison = 1;
  }
  return comparison;
};


export const identifiers = [
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly',
];

// export const foundationIdentifiers = [
//   'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation',
//   'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation',
// ];

export const discountedIdentifiers = [
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount',
];
