//Code to be run on server-side

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config();
const stripe = require('stripe')('sk_test_51K901SIwifjzfksJSSNsR9t8og7ZlSY2O8sagDBjPUcJT0aC46AJzP8chkiDDprUQUno019dOimVkWtEItQfs57Z00yzPUxChV');

var app = express();

//View engine setup (Handlebars)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}));

//Home Route
app.get('/', function(req, res) {
  res.render('index');
});

//Checkout Route
app.get('/checkout', async function(req, res) {

  //Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
  let title, amount, error;

  switch (item) {
    case '1':
      title = "The Art of Doing Science and Engineering"
      amount = 2300      
      break;
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993"
      amount = 2500
      break;     
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source"
      amount = 2800  
      break;     
    default:
      //Included in layout view, feel free to assign error
      error = "No item selected"      
      break;
  }

  const intent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'usd',
    automatic_payment_methods: {enabled: true},
  });

  res.render('checkout', {
    title: title,
    amount: amount,
    error: error,
    client_secret: intent.client_secret
  });
});

//Success Route
app.get('/success', async function(req, res) {
  const uniqueIntent = req.query.payment_intent
  const paymentIntent = await stripe.paymentIntents.retrieve(uniqueIntent);
  
  res.render('success', {
    amount: paymentIntent.amount,
    paymentIntentId: paymentIntent.id
  });
});

//Start server
app.listen(3000, () => {
  console.log('Getting served on port 3000');
});