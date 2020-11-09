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
 } = require('./shopify.js');

const app = express();
// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
var jsonParser = bodyParser.json();

app.get('/', (req, res) => {
    
    return res.status(200).send('<p>Welcome</p>');    
});
app.get('/android/token/', getAndroidToken);

app.post('/subscriptions/', jsonParser, getSubscriptions);


app.post('/shopify/charge/create/webhooks', jsonParser, createShopifyWebhooks);
app.post('/shopify/subscription/created', jsonParser, createShopifySubscriptionWebhook);
app.post('/shopify/subscription/deleted', jsonParser, deleteShopifySubscriptionWebhook);
app.post('/shopify/getChargesMigration', jsonParser, shopifyChargesMigration);
app.post('/shopify/getAllProducts', jsonParser, getShopifyProducts);
app.post('/shopify/getAlldWebHooks', jsonParser, getAllWebHooks);
app.post('/shopify/getLastdayCharges', jsonParser, shopifyLastCharges);
app.listen(8100);