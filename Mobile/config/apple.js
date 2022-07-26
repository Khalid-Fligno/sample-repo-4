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

// Grand unified receipt

export const compareInApp = (a, b) => {
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

export const compareProducts = (a, b) => {
  // Order of products rules:
  // Product type order - [Lifestyle, Transform]
  // If Lifestle, order by subscription price
  // If Transform, order by level

  const allProducts = [a, b];
  if(allProducts.every(p => lifeStyleIdentifiers.some(l => l.identifier == p.identifier))) {
    return a.price < b.price
  } else if(allProducts.every(p => transformIdentifiers.includes(p.identifier))) {
    return transformIdentifiers.indexOf(a.identifier) < transformIdentifiers.indexOf(b.identifier)
  } else if (lifeStyleIdentifiers.some(l => l.identifier == a.identifier)) {
    return -1
  } else {
    return 1
  }
}

export const lifeStyleIdentifiers = [
  { 
    identifier : 'com.fitazfk.fitazfkapp.sub.fullaccess.yearly', 
    period: "yearly", 
    trialPeriod: "7 day", 
    savingsPercent : "40",
    title: "Lifestyle Access Yearly"
  },
  { 
    identifier : 'com.fitazfk.fitazfkapp.sub.fullaccess.monthly', 
    period: "monthly", 
    trialPeriod: "7 day",
    title: "Lifestyle Access Monthly"
  }
]

export const transformIdentifiers = [
  { 
    identifier : 'com.fitazfk.fitazfkapp.sub.transform.level1', 
    challengeId: '88969d13-fd11-4fde-966e-df1270fb97dd',
    period: "6 month access", 
    title: "Transform Lvl 1 (No Equipment)",
    additionalText: "Includes 6 month lifestyle subscription"
  },
  { 
    identifier : 'com.fitazfk.fitazfkapp.sub.transform.level2', 
    challengeId: '7798f53c-f613-435d-b94b-b67f1f43b51b', 
    period: "6 month access",
    title: "Transform Lvl 2 (No Equipment)",
    additionalText: "Includes 6 month lifestyle subscription"
  },
  { 
    identifier : 'com.fitazfk.fitazfkapp.sub.transform.level3', 
    challengeId: '0d48d056-2623-4201-b25a-3f1d78083dba', 
    period: "6 month access", 
    title: "Transform Lvl 3 (No Equipment)",
    additionalText: "Includes 6 month lifestyle subscription"
  }
]

export const discountedIdentifiers = [
  'com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted',
  'com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount',
];

const subscriptionPeriodMap = {
  "com.fitazfk.fitazfkapp.sub.fullaccess.monthly.discount": "monthly",
  "com.fitazfk.fitazfkapp.sub.fullaccess.yearly.discounted": "yearly",
  "com.fitazfk.fitazfkapp.sub.fullaccess.monthly.foundation": "monthly",
  "com.fitazfk.fitazfkapp.sub.fullaccess.yearly.foundation": "yearly",
  ...Object.fromEntries(
    [transformIdentifiers, lifeStyleIdentifiers]
      .flatMap(i => i)
      .map(i => [i.identifier, i.period])
    )
};

export const productPeriod = (identifier) => {
  return subscriptionPeriodMap[identifier]
}

export const trialPeriod = (identifier) => {
  return [lifeStyleIdentifiers, transformIdentifiers]
    .flatMap(i => i)
    .find(i => i.identifier == identifier)
    ?.trialPeriod
}

export const savingPercentage = (identifier) => {
  return [lifeStyleIdentifiers, transformIdentifiers]
    .flatMap(i => i)
    .find(i => i.identifier == identifier)
    ?.savingsPercent
}

export const productAdditionalText = (identifier) => {
  return [lifeStyleIdentifiers, transformIdentifiers]
  .flatMap(i => i)
  .find(i => i.identifier == identifier)
  ?.additionalText
}

export const productTitle = (identifier) => {
  return [lifeStyleIdentifiers, transformIdentifiers]
  .flatMap(i => i)
  .find(i => i.identifier == identifier)
  ?.title
}

export const identifiers = (excludeChallengesIdentifiers = [], excludeLifestyleIdentifiers = []) => {
  return [
    transformIdentifiers.filter(i => !excludeChallengesIdentifiers.includes(i.challengeId)),
    lifeStyleIdentifiers.filter(i => !excludeLifestyleIdentifiers.includes(i.identifier))
  ]
  .flatMap(i => i.map(identifier => identifier.identifier))
}