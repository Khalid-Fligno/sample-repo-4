const open = require('open');
const express = require('express');
var bodyParser = require('body-parser');
const { getSubscriptions } = require('./subscription.js');
const { getAndroidToken } = require('./android.js');
const { createShopifyWebhooks, shopifySubscriptionCreated, shopifySubscriptionUpdated, shopifySubscriptionDeleted, getShopifySubscriptions  } = require('./android.js');

const app = express();
var jsonParser = bodyParser.json();

app.get('/', (req, res) => {
    
    return res.status(200).send('<p>Welcome</p>');    
});
app.get('/android/token/', getAndroidToken);

app.post('/subscriptions/', jsonParser, getSubscriptions);


app.post('/subscriptions/shopify/create/webhooks', jsonParser, createShopifyWebhooks);

app.post('/subscriptions/shopify/created', jsonParser, shopifySubscriptionCreated);
app.post('/subscriptions/shopify/updated', jsonParser, shopifySubscriptionUpdated);
app.post('/subscriptions/shopify/deleted', jsonParser, shopifySubscriptionDeleted);
app.post('/subscriptions/getAll', jsonParser, getShopifySubscriptions);
app.post('/subscriptions/getAllProducts', jsonParser, getShopifyProducts);

app.listen(8100);