//Code to be run on client side
//Client-side helper functions

$(document).ready(function() {
  var amounts = document.getElementsByClassName("amount");

    //Iterate through all "amount" elements and convert from cents to dollars
    for (var i = 0; i < amounts.length; i++) {
      amount = amounts[i].getAttribute('data-amount') / 100;  
      amounts[i].innerHTML = amount.toFixed(2);
    }

  const stripe = Stripe('pk_test_51K901SIwifjzfksJfnhHKkOZ2sPyN3HjCmDbumMsCLMkU5Kg8lPEHo953G77TADyT8SRFhwxk1gYVu9wUirNMv4e00waYPuSsl');

  const options = {
    clientSecret: document.querySelector('#payment-form').dataset.secret,
  };

  //Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
  const elements = stripe.elements(options);

  //Create and mount the Payment Element
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  const form = document.getElementById('payment-form');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/success',
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (e.g., payment
      // details incomplete)
      const messageContainer = document.querySelector('#error-message');
      messageContainer.textContent = error.message;
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  });
});
