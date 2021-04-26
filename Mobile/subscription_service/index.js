const open = require('open');
const express = require('express');
var bodyParser = require('body-parser');
const { getSubscriptions } = require('./subscription.js');
const { getAndroidToken } = require('./android.js');
const { 
      createShopifyWebhooks
    , createShopifySubscriptionWebhook
    , deleteShopifySubscriptionWebhook
    , shopifyChargesMigration
    , getShopifyProducts 
    , getAllWebHooks
    , shopifyLastCharges
    , shopifyAllCharges
    , shopifyAllSubscriptions
    , shopifyLastSubscriptions,
    getUserByEmail
 } = require('./shopify.js');
const adminRouter = require('./adminApi.js');
var cors = require('cors')
const app = express();
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

var jsonParser = bodyParser.json();

app.get('/', (req, res) => {
    
    return res.status(200).send('<p>Welcome</p>');    
});
app.get('/android/token/', getAndroidToken);

app.post('/subscriptions/', jsonParser, getSubscriptions);

app.get('/getUser',jsonParser,getUserByEmail)

app.post('/shopify/charge/create/webhooks', jsonParser, createShopifyWebhooks);
app.post('/shopify/subscription/created', jsonParser, createShopifySubscriptionWebhook);
app.post('/shopify/subscription/deleted', jsonParser, deleteShopifySubscriptionWebhook);
app.get('/shopify/getChargesMigration', jsonParser, shopifyChargesMigration);
app.get('/shopify/getAllProducts', jsonParser, getShopifyProducts);
app.get('/shopify/getAllWebHooks', jsonParser, getAllWebHooks);
app.get('/shopify/getAllCharges', jsonParser, shopifyAllCharges);
app.get('/shopify/getLast2DayCharges', jsonParser, shopifyLastCharges);
app.get('/shopify/getAllSubscriptions', jsonParser, shopifyAllSubscriptions);
app.get('/shopify/getLast2DaySubscriptions', jsonParser, shopifyLastSubscriptions);

//admin Api
app.use('/admin',adminRouter );
app.listen(3000);