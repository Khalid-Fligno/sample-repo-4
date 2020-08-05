import iapReceiptValidator from 'iap-receipt-validator';

const password = '4c613681bae44a4a956e11e6411d86fd'; // Shared Secret from iTunes connect

export const validateReceiptSandboxAND = iapReceiptValidator(password, false);

export const validateReceiptProductionAND = iapReceiptValidator(password, true);

export const compareAND = (a, b) => {
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

// Grand unified receipt

export const compareInAppAND = (a, b) => {
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

export const compareProductsAND = (a, b) => {
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


export const identifiersAND = [
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.yearly',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.monthly',
];

// export const foundationIdentifiers = [
//   'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation',
//   'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation',
// ];

export const discountedIdentifiersAND = [
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.yearly.discounted',
  'com.fitazfkapp.fitazfkapp.sub.fullaccess.monthly.discount',
];
