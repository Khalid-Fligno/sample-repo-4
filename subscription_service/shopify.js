const hostUrl='https://797423777430.ngrok.io';
const { auth, db } = require('./firebase');
const webhookUrl='https://api.rechargeapps.com/webhooks';
const productUrl='https://api.rechargeapps.com/products';
const chargesUrl='https://api.rechargeapps.com/charges';
const RECHARGE_API_KEY='defda21cce4018658e95ff12e4f494696b3c2bc2682ce0cc9025e892';

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
        {'name':  'charge/created', 'webhook_url': '/shopify/charge/created'},
        {'name':  'charge/updated', 'webhook_url': '/shopify/charge/updated'},
        {'name':  'charge/deleted', 'webhook_url': '/shopify/charge/deleted'},
        {'name':  'charge/paid', 'webhook_url': '/shopify/charge/paid'},
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
    res.status(200).send("Shopify Webhook sucessfully created");

}

//Webhook- update user collection in firebase
exports.shopifyChargeCreated = async(req, res) =>{

    console.log("shopifyChargeCreated is called");
    // get user by email from firebase
    const user =await getUser(res.email);
    // 1. if user not exist, create that user
    if(user === null){
        const newUser={
            firstName:res.first_name,
            lastName:res.last_name,
            email:res.email,
            chargeId:res.id,
            challenge:true,            
        }
        // get the challage from line_items =>properties
        updateUser(newUser);       
    }
    // 2. if user exist update that user
    if(user !== null){
        const user={
            chargeId:res.id,
        }
        updateUser(newUser);
    }
    // get product from line item collection
    const challengeProductName=res.line_items[0].properties[0].name;
    if(challengeProductName ==null){
        challengeProductName="FitazFK 8 Week Challenge";
    }
    // get workout challange details by passing product_title
    const challenge= await getChallengeDetails(challengeProductName);
    const userInfo=await getUser(res.email);
    if(challenge !=null){
        const userChallenge=createNewChallenge(challenge)
        updateChallengesAgainstUser(userChallenge,userInfo.id);
    }
    
}
//webhook 
exports.shopifyChargesPaid = (req,res) =>{
  shopifyChargeCreated(req,res);
}
//Webhook  
exports.shopifyChargeUpdated = (req, res) =>{
      //same as shopifyChargeCreated
      shopifyChargeCreated(req,res);
}
//Webhook 
exports.shopifyChargeDeleted = async(req, res) =>{

    // get user by email from firebase
    const user =await getUser(res.email);
    // 2. if user exist update that user
    if(user !== null){
     // get product from line item collection
    const challengeProductName=res.line_items[0].properties[0].name;
    const challenge= await getChallengeDetails(challengeProductName);
    //remove user challenges from collection
    
    await db.collection('users').doc(user.uid).collection('challenges').doc(challenge.id).set(data, (error) => {
        if (error) {
          user.delete().then(() => {
            this.setState({ loading: false });
            Alert.alert('Sign up could not be completed', 'Please try again');
          });
        }
      });
    }

}

// Wil lget a list of products from shopify account to be displayed on App
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
    return shopifyProducts;   
  
}
// Will get a list of products from shopify account to be displayed on App
// get shopify product and update to the existing firebase collection
exports.getShopifyProductsAndUpdate= async(req, res) => {    
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
        // get shopify product and update to the existing firebase collection
        console.log("shopifyProducts",shopifyProducts);
        if(shopifyProducts != null){
            shopifyProducts.products.forEach(async (prod) =>{
                const challengeDetails= await getChallengeDetails(prod.title);
                console.log("outer challengeDetails",challengeDetails);
                if(challengeDetails!=null && !challengeDetails.hasOwnProperty(shopifyProductId)){
                    challengeDetails.shopifyProductId=prod.shopify_product_id;
                    challengeDetails.createdAt= prod.created_at;
                    challengeDetails.productId= prod.product_id;
                    challengeDetails.productReChargeId=prod.id;
                    updateChallenges(challengeDetails);
                }
            });
        }    
}

//Will get a user's subscription details from firebase DB
exports.getShopifyCharges = async(req, res) => {
    //
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-recharge-access-token' : RECHARGE_API_KEY
          },
        };
      const resCharges = await fetch(chargesUrl, options);      
      const shopifyCharges = await resCharges.json();
      console.log("shopifyCharges",shopifyCharges);
      return shopifyCharges;  
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
    return registeredWebHooks;
}
const getUser = async(emailId) => {
    const userRef = await db.collection('users').where("email","==",emailId).get();
    if (userRef.size > 0) {
      return userRef.docs[0].data();
  }   
}

const updateUser = (userInfo) => {
    const userRef = db.collection('users');
    userRef.set(data, { merge: true });
}

const getChallengeDetails = async(challengeName) => {
    let challengeDetail;
    const snapshot =await db.collection('challenges').where("name","==",challengeName)
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
            "endDay":res.endDay
          }
        )
      })
    const challenge = {
        "name":data.name,
        "displayName":data.displayName,
        "id":data.id,
        "startDate":moment(new Date()).format('YYYY-MM-DD'), 
        "endDate":moment(new Date(), 'YYYY-MM-DD').add(data.numberOfDays-1,'days').format('YYYY-MM-DD'),
        "status":"InActive",
        "phases":phases,
        "shopifyProductId":data.shopifyProductId,
        "createdAt":data.createdAt,
        "productId":data.productId,
        "productReChargeId":data.productReChargeId
      }
      return challenge
}

