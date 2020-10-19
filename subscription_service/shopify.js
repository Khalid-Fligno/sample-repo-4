const hostUrl='http://b8e649638365.ngrok.io';
const { auth, db } = require('./firebase');
const webhookUrl='https://api.rechargeapps.com/webhooks';
const RECHARGE_API_KEY='defda21cce4018658e95ff12e4f494696b3c2bc2682ce0cc9025e892';

const getRegisteredWebHooks = (webhooks) => {
    const verifyUrl = webhookUrl;
    return async (hook) => {
      const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        };
      const res = await fetch(verifyUrl, options);
      const body = await res.json();
      return body;
    };
  }
  
exports.createShopifyWebhooks = (req, res) => {
    const topics = [
        {'name':  'charge/created', 'webhook_url': '/shopify/charge/created'},
        {'name':  'charge/updated', 'webhook_url': '/shopify/charge/updated'},
        {'name':  'charge/deleted', 'webhook_url': '/shopify/charge/deleted'},
    ];
    //life time call only once to create necessary webhooks
    //1. Get list of webhooks
    //const registeredWebHooks = await(getRegisteredWebHooks);
    const webhooks = [
        {
            "address": "https://request.in/foo",
            "id": 19451,
            "topic": "charge/created"
        },
        {
            "address": "https://request.in/foo",
            "id": 19453,
            "topic": "charge/created"
        }
    ];
    //unRegister web hooks
    let unRegisteredWeekHook=[];
    topics.forEach(topic => {
     const index= webhooks.findIndex(res => res.topic === topic.name)
     if(index === -1){
        unRegisteredWeekHook.push(topic);
     }
        
    });

    //2. if you didn't find related webhook create that
    unRegisteredWeekHook.forEach(unreg =>{ 
        const newSubscriptionInfoReq = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-recharge-access-token':RECHARGE_API_KEY,
            },
            body: JSON.stringify({
                "address": `${hostUrl} ${}`,
                "topic": "subscription/created"
            })
          });
          const newSubscriptionInfo = await newSubscriptionInfoReq.json();
          if (newSubscriptionInfo.error && newSubscriptionInfo.error.errorCode) {
            this.handleError(newSubscriptionInfo.error);
            return null;
          }        
    });

}

const getUser = (emailId) => {
    const userRef = db.collection('users').where("email","==",emailId);
    return userRef.get();
}

const updateUser = (userInfo) => {
    
}

const getChallangeDetails = (challangeName) => {
    return db.collection('challenges').where("name","==",challangeName).get();

}

//Webhook- update user collection in firebase
exports.shopifyChargeCreated = (req, res) =>{
    // get user by email from firebase
    // 1. if user not exist, create that user
    // 2. if user exist update that user

    // get workout challange details by passing product_title

    
}
//Webhook  
exports.shopifyChargeUpdated = (req, res) =>{
      //
}
//Webhook 
exports.shopifyChargeDeleted = (req, res) =>{
    //
}

// Wil lget a list of products from shopify account to be displayed on App
exports.getShopifyProducts= (req, res) => {
    //

}

//Will get a user's subscription details from firebase DB
exports.getShopifyCharges = (req, res) => {
    //

}

