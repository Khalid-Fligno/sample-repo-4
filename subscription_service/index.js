const open = require('open');
const express = require('express');
var bodyParser = require('body-parser')
const { getSubscriptions } = require('./subscription.js')

const app = express();
var jsonParser = bodyParser.json();

app.get('/', (req, res) => {
    
    return res.status(200).send('<p>Welcome</p>');    
});

app.post('/subscriptions/', jsonParser, getSubscriptions);

app.listen(8100);