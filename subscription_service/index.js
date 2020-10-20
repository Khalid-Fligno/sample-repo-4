const open = require('open');
const express = require('express');
var bodyParser = require('body-parser');
const { getSubscriptions } = require('./subscription.js');
const { getAndroidToken } = require('./android.js');
const { 
    createShopifyWebhooks
    , shopifyChargeCreated
    , shopifyChargeUpdated
    , shopifyChargeDeleted
    , shopifyChargesPaid
    , getShopifyCharges
    , getShopifyProducts 
    , getShopifyProductsAndUpdate
    , getAllWebHooks
 } = require('./shopify.js');

const app = express();
var jsonParser = bodyParser.json();

app.get('/', (req, res) => {
    
    return res.status(200).send('<p>Welcome</p>');    
});
app.get('/android/token/', getAndroidToken);

app.post('/subscriptions/', jsonParser, getSubscriptions);


app.post('/shopify/charge/create/webhooks', jsonParser, createShopifyWebhooks);
app.post('/shopify/charge/created', jsonParser, shopifyChargeCreated);
app.post('/shopify/charge/updated', jsonParser, shopifyChargeUpdated);
app.post('/shopify/charge/deleted', jsonParser, shopifyChargeDeleted);
app.post('/shopify/charge/paid', jsonParser, shopifyChargesPaid);
app.post('/shopify/getCharges', jsonParser, getShopifyCharges);
app.post('/shopify/getAllProducts', jsonParser, getShopifyProducts);
app.post('/shopify/getAllProductsUpdate', jsonParser, getShopifyProductsAndUpdate);
app.post('/shopify/getAlldWebHooks', jsonParser, getAllWebHooks);
app.listen(8100);