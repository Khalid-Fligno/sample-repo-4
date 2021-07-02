const hostUrl='https://3.10.57.182';
//const { auth, db } = require('./firebase');
const webhookUrl='https://api.rechargeapps.com/webhooks';
const productUrl='https://api.rechargeapps.com/products';
const chargesUrl='https://api.rechargeapps.com/charges';
const subscriptionUrl='https://api.rechargeapps.com/subscriptions';
var  admin  = require('./firebase');
const db= admin.firestore();
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
      const resWebHooks = await fetch(webhookUrl, options);      //getting webhook list here
      let registeredWebHooks = await resWebHooks.json();     
     registeredWebHooks=registeredWebHooks.webhooks;
     console.log("webhook list ",registeredWebHooks);
    let unRegisteredWeekHook=[];
    
    topics.forEach(topic => {
     const index= registeredWebHooks.findIndex(res1=> res1.topic === topic.webhook_url)
     if(index === -1){
        unRegisteredWeekHook.push(topic);
     }
    });
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
          //console.log("new Charge Info ",newChargeInfo);
    });
    res.status(200).send("Shopify Webhook successfully created");

}
//---------------------------subscription---------------------

// exports.createShopifySubscriptionWebhook = async(req, res) =>{ 
//   console.log("req.body.subscription",req.body.subscription);   
//     const request = req.body.subscription;    
//     const requestSuccess= await createUserChallengeAndSubscription(request); 
//     if(requestSuccess)
//         res.status(200).send("Purchase Shopify Subscription called successfully");
//     else 
//       res.status(200).send("have some problem in Shopify Subscription");    
// }

exports.createShopifySubscriptionWebhook = async(req, res) =>{ 
    const shopifyPurchasedItemList = req.body.line_items;    
    const customerEmail = req.body.email;    
    Promise.all(shopifyPurchasedItemList.map((res)=>{
      return new Promise(async (resolve,reject)=>{
                 createUserChallengeAndSubscription({
                  email:customerEmail,
                  product_title:res.title,
                  shopify_product_id:res.product_id
                }).then((res)=>{
                  console.log("response ",res)
                  resolve();
                }).catch((err)=>{
                  console.log(err);
                  resolve();
                }) 
             })
    }))
    .then((values) => {
      res.status(200).send("ok");
    })
    .catch((err)=>{
      console.log("error found",err);
      res.status(200).send('ok')
    });
}

exports.deleteShopifySubscriptionWebhook = async(req, res) =>{    
  const request = req.body.subscription;    
    await deleteWebhookUrl(request); 
    res.status(200).send("delete Shopify Subscription called successfully");
}
//Will get a user's subscription details from firebase DB
exports.shopifyChargesMigration = async(req, res) => {
  const minDate=moment(new Date(), 'YYYY-MM-DD').add(-11,'days').format('YYYY-MM-DD');
  const maxDate=moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
  const options = {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-recharge-access-token' : RECHARGE_API_KEY
        },
      };
    const resCharges = await fetch(`${chargesUrl}?date_min=${minDate}&date_max=${maxDate}`, options);      
    const shopifyCharges = await resCharges.json();
    // get all charges from shopifyCharges charges
    const charges =shopifyCharges.charges;
    charges.forEach(async(charge)=>{
      const request={};
      request.email=charge.email;
      request.product_title=charge.line_items[0].title;
      request.shopify_product_id=charge.line_items[0].shopify_product_id;
       const successRequest=  await createUserChallengeAndSubscription(request);
       if(successRequest)
        console.log(`${request.email} user subscribe to ${request.product_title} and successfully migrated`);
        else
        console.log(`${request.email} user has some problem in migration `);
    })

    res.status(200).send(shopifyCharges);
}
exports.shopifyLastCharges = async(req, res) => {
  const minDate=moment(new Date(), 'YYYY-MM-DD').add(-2,'days').format('YYYY-MM-DD')
  const maxDate=moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
  const options = {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-recharge-access-token' : RECHARGE_API_KEY
        },
      };
    const resCharges = await fetch(`${chargesUrl}?date_min=${minDate}&date_max=${maxDate}`, options);      
    const shopifyCharges = await resCharges.json();
    // get all charges from shopifyCharges charges
    const charges =shopifyCharges.charges;
    charges.forEach(async(charge)=>{
      if(charge.line_items[0] &&  charge.line_items[0].title && charge.line_items[0].title.includes("Challenge")){
        const request={};
        request.created_at=charge.created_at;
        request.email=charge.email;
        request.product_title=charge.line_items[0].title;
        request.shopify_product_id=charge.line_items[0].shopify_product_id;
        console.log(request);
      }
    })
    res.status(200).send(shopifyCharges);
}
exports.shopifyAllCharges = async(req, res) => {
  const minDate=moment(new Date('2020-11-15'), 'YYYY-MM-DD').format('YYYY-MM-DD')
  const maxDate=moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
  const options = {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-recharge-access-token' : RECHARGE_API_KEY
        },
      };
    const resCharges = await fetch(`${chargesUrl}?date_min=${minDate}&date_max=${maxDate}`, options);      
    const shopifyCharges = await resCharges.json();
    // get all charges from shopifyCharges charges
    let chargesResponse=[];
    const charges =shopifyCharges.charges;
    charges.forEach(async(charge)=>{
      if(charge.line_items[0] &&  charge.line_items[0].title && charge.line_items[0].title.includes("Challenge")){
        const request={};
        request.created_at=charge.created_at;
        request.email=charge.email;
        request.product_title=charge.line_items[0].title;
        request.shopify_product_id=charge.line_items[0].shopify_product_id;
        chargesResponse.push(request);
      }
    })
    res.status(200).send(chargesResponse);
}
exports.shopifyLastSubscriptions = async(req, res) => {
  const minDate=moment(new Date(), 'YYYY-MM-DD').add(-2,'days').format('YYYY-MM-DD')
  const maxDate=moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
  const options = {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-recharge-access-token' : RECHARGE_API_KEY
        },
      };
    const resCharges = await fetch(`${subscriptionUrl}?created_at_min=${minDate}&created_at_min=${maxDate}`, options);      
    const shopifyCharges = await resCharges.json();
    // get all charges from shopifyCharges charges
    const subscriptions =shopifyCharges.subscriptions;
      subscriptions.forEach(async(subscription)=>{
        if(subscription.product_title.includes("Challenge") || subscription.product_title.toLowerCase().includes("subscription")){
          const request={};
          request.created_at=subscription.created_at;
          request.email=subscription.email;
          request.product_title=subscription.product_title;
          request.shopify_product_id=subscription.shopify_product_id;
        console.log(request);
      }
    })
    res.status(200).send(shopifyCharges);
  };

exports.shopifyAllSubscriptions = async(req, res) => {
  const minDate=moment(new Date('2020-11-15'), 'YYYY-MM-DD').format('YYYY-MM-DD')
  const maxDate=moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD');
  const options = {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-recharge-access-token' : RECHARGE_API_KEY
        },
      };
    const resCharges = await fetch(`${subscriptionUrl}?created_at_min=${minDate}&created_at_min=${maxDate}`, options);      
    const shopifyCharges = await resCharges.json();
    // get all charges from shopifyCharges charges
    let chargesResponse=[];
    const subscriptions =shopifyCharges.subscriptions;
    subscriptions.forEach(async(subscription)=>{
      if(subscription.product_title.toLowerCase().includes("challenge") || subscription.product_title.toLowerCase().includes("subscription")){
        const request={};
        request.created_at=subscription.created_at;
        request.email=subscription.email;
        request.product_title=subscription.product_title;
        request.shopify_product_id=subscription.shopify_product_id;
        chargesResponse.push(request);
      }
    })
    res.status(200).send(chargesResponse);
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
res.status(200).send(registeredWebHooks.webhooks);
}

const createUserChallengeAndSubscription = async (req)=>{
      //check request contain Challenge work in product_title
      const challengeProductName=req.product_title;
      const challengeProductId=req.shopify_product_id;
      console.log(challengeProductId,challengeProductName,req.email)
      if(!challengeProductName.toLowerCase().includes("challenge") && !challengeProductName.toLowerCase().includes("subscription")){
        console.log("Not found...")
        return false;
      }
      // get user by email from firebase
      const user =await getUser(req.email);     
      // console.log(">>>",user) 
      // 1. if user not exist, create that user
      if(user === undefined ){
        console.log("User not found")
          const newUser={
              email:req.email,
              formShopify:true,
              onboarded: false,
              country:'unavailable',
              signUpDate: moment(new Date()).format('YYYY-MM-DD'),
              fitnessLevel: 1,
              id: uniqid(),
              shopifyProductId:req.shopify_product_id,         
          };
          // get the challage from line_items =>properties
          if(challengeProductName.toLowerCase().includes("challenge")){        
            newUser.challenge=true;  
          }else if (challengeProductName.toLowerCase().includes("subscription")){
            newUser.subscription=true;
          }
          addUser(newUser);   
      }
        if(challengeProductName.toLowerCase().includes("challenge")){  
          console.log("here/....",challengeProductId)
        if(user && user !== null)  {       
        const userChallenge= await getUserChallenge(user.id,challengeProductName,challengeProductId);
        if(userChallenge && userChallenge.name == challengeProductName)
          { 
            // console.log("user has challenge");
            return true
          }
        }
        // get product from line item collection
        // get workout challenge details by passing product_title  
        const challenge= await getChallengeDetails(challengeProductName,challengeProductId);
        // console.log(challenge)
        const userInfo=await getUser(req.email);
        if(challenge !=null){        
          const userChallenge=createNewChallenge(challenge);
          console.log(userChallenge)
          updateChallengesAgainstUser(userChallenge,userInfo.id);
        }
      }
      else if (challengeProductName.toLowerCase().includes("subscription") && user && user !== null){
          if(challengeProductId ==6122583326906){
            updateUserSubscription(sub3Monthly,user.id);
          } else if(challengeProductId ==6122583523514){
            updateUserSubscription(subYearly,user.id);
          } else if(challengeProductId ==6122583195834){
            updateUserSubscription(subMonthly,user.id);
          }else if(challengeProductId ==6129876664506){
            updateUserSubscription(subOneDay,user.id);
          }
      }
      return true;
}
const deleteWebhookUrl = async(req) => {
      // get user by email from firebase
      const user =await getUser(req.email);
      // 2. if user exist update that user
      if(user !== null){
       // get product from line item collection      
      const challenge= await getChallengeDetails(challengeProductName);
      //remove user challenges from collection      
      await db.collection('users').doc('uid').collection('challenges').doc(challenge.id).delete();
    }
}

const getUser = async(emailId) => {
    const userRef = await db.collection('users').where("email","==",emailId).get();
    if (userRef.size > 0) {
      return userRef.docs[0].data();
    }else{
      return undefined
    }   
}

const addUser = (userInfo) => {
    const userRef = db.collection('users').doc(userInfo.id);
    userRef.set(userInfo).then((state) => {
    })
    .catch((error) => {
      console.log("new user added error",error);
    });;
}
const updateUserById = (userInfo) => {
  const userRef = db.collection('users').doc(userInfo.id);
  userRef.set(userInfo, { merge: true });
}
const getUserChallenge = async(userId,name,challengeProductId)=>{
  console.log("???",String(challengeProductId))
  const snapshot=await db.collection('users').doc(userId).collection('challenges').where("shopifyProductId","==",String(challengeProductId))
  .get();
  console.log(snapshot.size)
  if (snapshot.size > 0) {
    console.log("????",snapshot.docs[0].data())
   return snapshot.docs[0].data();
} 
}
const getChallengeDetails = async(name,challengeProductId) => {
    const snapshot =await db.collection('challenges').where("shopifyProductId","==",String(challengeProductId))
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
const updateUserSubscription = (subscriptionData,userId) => {
  const user=db.collection('users').doc(userId);
  user.set(subscriptionData,{merge:true});
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
      "numberOfWeeks":data.numberOfWeeks,
      "imageUrl":data.imageUrl,
      "shopifyProductId":data.shopifyProductId,
      "createdAt":data.createdAt?data.createdAt:'',
      "productId":data.productId,
      "productReChargeId":data.shopifyProductId,
      "isSchedule":false
      }
      return challenge
}
const today=new Date();
  const oneDay=new Date(new Date().setDate(new Date().getDate()+1));
  const oneMonth=new Date(new Date().setMonth(new Date().getMonth()+1));
  const threeMonth=new Date(new Date().setMonth(new Date().getMonth()+3));
  const oneYear = new Date(new Date().setFullYear(new Date().getFullYear()+1));
  const subOneDay = { "subscriptionInfo":{
    "expiry":oneDay.getTime(),
    "originalPurchaseDate":new Date().getTime(),
    "productId":"6129876664506",
    "title":"App (1 Day Test Subscription)",
 }}
  const subMonthly = { "subscriptionInfo":{
    "expiry":oneMonth.getTime(),
    "originalPurchaseDate":new Date().getTime(),
    "productId":"6122583195834",
    "title":"App (1 Month Subscription)",
 }}
 const sub3Monthly = { "subscriptionInfo":{
  "expiry":threeMonth.getTime(),
  "originalPurchaseDate":new Date().getTime(),
  "productId":"6122583326906",
  "title":"App (3 Month Subscription)"
}}
 const subYearly = { "subscriptionInfo":{
  "expiry":oneYear.getTime(),
  "originalPurchaseDate":new Date().getTime(),
  "productId":"6122583523514",
  "title":"App (12 Month Subscription)"
}}

exports.getUserByEmail =(req,res)=>{
  var email = req.email;
  getUser("kuladip@bizminds.io").then(user=>{
    res.json(user);
  })
}