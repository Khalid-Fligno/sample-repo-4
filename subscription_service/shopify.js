exports.createShopifyWebhooks = (req, res) => {
    const topics = [
        {'name':  'subscription/created', 'webhook_url': ''},
        {'name':  'subscription/updated', 'webhook_url': ''},
        {'name':  'subscription/deleted', 'webhook_url': ''},
    ];
    //life time call only once to create necessary webhooks
    //1. Get list of webhooks
    //2. if you didn't find related webhook create that
}

const getUser = (emailId) => {
    //return user instance
}

const updateUser = (userInfo) => {
    // update in firebase
}

const getChallangeDetails = (challangeName) => {

}

//Webhook- update user collection in firebase
exports.shopifySubscriptionCreated = (req, res) =>{
    // get user by email from firebase
    // 1. if user not exist, create that user
    // 2. if user exist update that user

    // get workout challange details by passing product_title

    
}
//Webhook  
exports.shopifySubscriptionUpdated = (req, res) =>{
      
}
//Webhook 
exports.shopifySubscriptionDeleted = (req, res) =>{
    
}

// Wil lget a list of products from shopify account to be displayed on App
exports.getShopifyProducts= (req, res) => {

}

//Will get a user's subscription details from firebase DB
exports.getShopifySubscriptions = (req, res) => {

}

