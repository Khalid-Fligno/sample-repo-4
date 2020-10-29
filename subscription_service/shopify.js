const hostUrl='http://3.8.209.87:8100';
const { auth, db } = require('./firebase');
const webhookUrl='https://api.rechargeapps.com/webhooks';
const productUrl='https://api.rechargeapps.com/products';
const chargesUrl='https://api.rechargeapps.com/charges';
const subscriptionUrl='https://api.rechargeapps.com/subscriptions';
const RECHARGE_API_KEY='defda21cce4018658e95ff12e4f494696b3c2bc2682ce0cc9025e892';
let moment = require('moment');
let uniqid = require('uniqid');
const { json } = require('body-parser');
const getRegisteredWebHooks = () => {
    return async (webHooks) => {
      const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-recharge-access-token' : RECHARGE_API_KEY
          },
        };
      const res = await fetch(webhookUrl, options);      
      const body = await res.json();
      return body;
    };
  }
  
exports.createShopifyWebhooks = async (req, res)  => {
    const topics = [
        {'name':  'subscription/created', 'webhook_url': '/shopify/subscription/created'},
        {'name':  'subscription/deleted', 'webhook_url': '/shopify/subscription/deleted'},
    ];
    //life time call only once to create necessary webhooks
    //1. Get list of webhooks
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-recharge-access-token' : RECHARGE_API_KEY
          },
        };
      const resWebHooks = await fetch(webhookUrl, options);      
      let registeredWebHooks = await resWebHooks.json();     
     registeredWebHooks=registeredWebHooks.webhooks;
     console.log("webhook list ",registeredWebHooks);
    let unRegisteredWeekHook=[];
    
    topics.forEach(topic => {
     const index= registeredWebHooks.findIndex(res1=> res1.topic === topic.name)
     console.log("index",index);
     if(index === -1){
        unRegisteredWeekHook.push(topic);
     }
    });
    
    console.log("befor foreach unRegisteredWeekHook ",unRegisteredWeekHook)
    //2. if you didn't find related webhook create that
    unRegisteredWeekHook.forEach(async (unreg) =>{ 
        const newChargeReq = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-recharge-access-token':RECHARGE_API_KEY,
            },
            body: JSON.stringify({
                "address": `${hostUrl}${unreg.webhook_url}`,
                "topic": `${unreg.name}`
            })
          });
          const newChargeInfo = await newChargeReq.json();
          console.log("new Charge Info ",newChargeInfo);
    });
    res.status(200).send("Shopify Webhook successfully created");

}
//---------------------------subscription---------------------

exports.createShopifySubscriptionWebhook = async(req, res) =>{    
    const request = req.body.subscription;    
    const requestSuccess= await createUserAndChallenge(request); 
    if(requestSuccess)
        res.status(200).send("Purchase Shopify Subscription called successfully");
    else 
      res.status(200).send("have some problem in Shopify Subscription");    
}
exports.deleteShopifySubscriptionWebhook = async(req, res) =>{    
  const request = req.body.subscription;    
    await deleteWebhookUrl(request); 
    res.status(200).send("delete Shopify Subscription called successfully");
}
//Will get a user's subscription details from firebase DB
exports.shopifyChargesMigration = async(req, res) => {
  const options = {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-recharge-access-token' : RECHARGE_API_KEY
        },
      };
    const resCharges = await fetch(`${chargesUrl}?date_min=${req.params.date_min}&date_max=${req.params.date_max}`, options);      
    const shopifyCharges = await resCharges.json();
    // get all charges from shopifyCharges charges
    const charges =shopifyCharges.charges;
    charges.forEach(async(charge)=>{
      const request={};
      request.email=charge.email;
      request.product_title=charge.line_items[0].title;
      request.shopify_product_id=charge.line_items[0].shopify_product_id;
       const successRequest=  await createUserAndChallenge(request);
       if(successRequest)
        console.log(`${request.email} user subscribe to ${request.product_title} and successfully migrated`);
        else
        console.log(`${request.email} user has some problem in migration `);
    })

    res.status(200).send(shopifyCharges);
}
// Will get a list of products from shopify account to be displayed on App
exports.getShopifyProducts= async(req, res) => {    
  const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-recharge-access-token' : RECHARGE_API_KEY
      },
    };
  const resProducts = await fetch(productUrl, options);      
  const shopifyProducts = await resProducts.json();
  console.log("shopifyProducts",shopifyProducts);
  res.status(200).send(shopifyProducts);   
}
exports.getAllWebHooks = async(req, res) => {
  const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'x-recharge-access-token' : RECHARGE_API_KEY
      },
    };
  const resWebHooks = await fetch(webhookUrl, options);      
  const registeredWebHooks = await resWebHooks.json();
  //return body;
console.log('registeredWebHooks',registeredWebHooks.webhooks);
res.status(200).send(registeredWebHooks.webhooks);
}

const createUserAndChallenge= async (req)=>{
      console.log("request",req);
      //check request contain Challenge work in product_title
      const challengeProductName=req.product_title;
      if(!challengeProductName.includes("Challenge")){
        return false;
      }

      // get user by email from firebase
      const user =await getUser(req.email);     
      // 1. if user not exist, create that user
      if(user === undefined ){
          const newUser={
              email:req.email,
              challenge:true, 
              onboarded: false,
              country:'unavailable',
              signUpDate: moment(new Date()).format('YYYY-MM-DD'),
              fitnessLevel: 1,
              id: uniqid(),          
          };
          // get the challage from line_items =>properties
          console.log("newUser",newUser);
          addUser(newUser);   
      }

      // get product from line item collection
      console.log("challengeShopifyProductId",req.shopify_product_id);
      // get workout challange details by passing product_title      
      const challenge= await getChallengeDetails(challengeProductName);
      console.log("challenge",challenge);
      const userInfo=await getUser(req.email);
      console.log("userInfo",userInfo);
      if(challenge !=null){        
          const userChallenge=createNewChallenge(challenge)
          updateChallengesAgainstUser(userChallenge,userInfo.id);
          console.log("updateChallengesAgainstUser");
      }
      return true;
}
const deleteWebhookUrl = async(req) => {
      // get user by email from firebase
      console.log("delete Webhook request",req);
      const user =await getUser(req.email);
      console.log("user",user);
      // 2. if user exist update that user
      if(user !== null){
       // get product from line item collection      
      const challenge= await getChallengeDetails(challengeProductName);
      console.log("challenge",challenge);
      //remove user challenges from collection      
      await db.collection('users').doc('uid').collection('challenges').doc(challenge.id).delete();
    }
}

const getUser = async(emailId) => {
    const userRef = await db.collection('users').where("email","==",emailId).get();
    if (userRef.size > 0) {
      return userRef.docs[0].data();
  }   
}

const addUser = (userInfo) => {
  console.log("update user",userInfo);
    const userRef = db.collection('users').doc(userInfo.id);
    userRef.set(userInfo).then((state) => {
      console.log("new user added",state);
    })
    .catch((error) => {
      console.log("new user added error",error);
    });;
}
const updateUserById = (userInfo) => {
  const userRef = db.collection('users').doc(userInfo.id);
  userRef.set(userInfo, { merge: true });
}

const getChallengeDetails = async(challengeName) => {
    const snapshot =await db.collection('challenges').where("name","==",challengeName)
     .get();
     if (snapshot.size > 0) {
      return snapshot.docs[0].data();
  }   
}
const getChallengeDetailByProductId = async(challengeProductId) => {
  
  const snapshot =await db.collection('challenges').where("shopifyProductId","==",challengeProductId)
   .get();
   if (snapshot.size > 0) {
    return snapshot.docs[0].data();
}   
}

const updateChallengesAgainstUser = (challengeData,userId)=>{
    const challenge = db.collection('users').doc(userId).collection('challenges').doc(challengeData.id);
    challenge.set(challengeData,{merge:true})
}
const updateChallenges = (challengeData)=>{
    const challenge = db.collection('challenges').doc(challengeData.id);
    challenge.set(challengeData,{merge:true})
}
const createNewChallenge=(data)=>{
    const phases = data.phases.map((res)=>{
        return (
          {
            "name":res.name,
            "displayName":res.displayName,
            "startDate":moment(new Date(), 'YYYY-MM-DD').add(res.startDay-1,'days').format('YYYY-MM-DD'),
            "endDate":moment(new Date(), 'YYYY-MM-DD').add(res.endDay-1,'days').format('YYYY-MM-DD'),
            "startDay":res.startDay,
            "endDay":res.endDay,
            "pdfUrl":res.pdfUrl            
          }
        )
      })
    const challenge = {
      "name":data.name,
      "displayName":data.displayName,
      "id":data.id,
      "tag":data.tag,
      "startDate":moment(new Date()).format('YYYY-MM-DD'), 
      "endDate":moment(new Date(), 'YYYY-MM-DD').add(data.numberOfDays-1,'days').format('YYYY-MM-DD'),
      "status":data.status?data.status:"InActive",
      "phases":phases,
      "workouts":[],
      "onBoardingInfo":{},
      "currentProgressInfo":{},
      "createdOn":data.createdOn?data.createdOn:moment(new Date()).format('YYYY-MM-DD'),
      "numberOfDays":data.numberOfDays,
      "imageUrl":data.imageUrl,
      "shopifyProductId":data.shopifyProductId,
      "createdAt":data.createdAt,
      "productId":data.productId,
      "productReChargeId":data.productReChargeId
      }
      return challenge
}


