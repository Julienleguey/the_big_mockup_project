const express = require('express');
const router = express.Router();
const User = require("../server/models").User;
const checkToken = require("./middlewares").checkToken;
const receiptEmail = require("./helpers/mailer").receiptEmail;

const public_key = process.env.STRIPE_PUBLIC_KEY;
const secret_key = process.env.STRIPE_SECRET_KEY;
const price_101 = process.env.PRICE_101;
const price_102 = process.env.PRICE_102;
const price_103 = process.env.PRICE_103;
const time_101 = process.env.TIME_101;
const time_102 = process.env.TIME_102;
const time_103 = process.env.TIME_103;

const stripe = require("stripe")(secret_key);

function setPlan(req, res, next) {
  if (req.body.planId === "101") {
    req.price = price_101;
    req.months = time_101;
    next();
  } else if (req.body.planId === "102") {
    req.price = price_102;
    req.months = time_102;
    next();
  } else if (req.body.planId === "103") {
    req.price = price_103;
    req.months = time_103;
    next();
  } else {
    err = new Error('The price is not correct!');
    err.status = 403;
    next(err);
  };
}

function setMetadata(req, res, next) {
  req.metadata = {
    firstName: req.currentUser.firstName,
    lastName: req.currentUser.lastName,
    userId: req.currentUser.id,
    months: req.months
  };
  next();
}

function updatePremiumEnd(user, monthsToAdd) {
  const now = new Date();
  const premiumUntil = new Date(user.premiumUntil);
  let then = new Date();
  const months = parseInt(monthsToAdd, 10);
  if (user.premiumUntil === null || premiumUntil < now) {
    then.setMonth(now.getMonth() + months);
  } else {
    then = premiumUntil;
    then.setMonth(then.getMonth() + months);
  }

  // return user.update({premiumUntil: then, status: "active"});
  user.update({premiumUntil: then, status: "active"});
}

const generate_payment_response = (intent, req, res) => {
  if (
    intent.status === 'requires_action' &&
    intent.next_action.type === 'use_stripe_sdk'
  ) {
    return {
      requires_action: true,
      payment_intent_client_secret: intent.client_secret
    };
  } else if (intent.status === 'succeeded') {
    User.findOne({ where: { email: req.currentUser.email } }).then( user => {
      if (user) {
        // return updatePremiumEnd(user, intent.metadata.months);
        updatePremiumEnd(user, intent.metadata.months);
        receiptEmail(user.email);
      }
    }).then( () => {
      return {success: true};
    }).catch( () => {
      return {
        error: "The payment succeded but it seems there was an error while updating your account. Please contact blabla@gmail.com."
      }
    });
  } else {
    return {
      error: 'Invalid PaymentIntent status'
    }
  }
};

router.get("/get_public_key", (req, res) => {
  const pk = {pk: public_key};
  res.json(pk);
})

router.post("/charge_sca", checkToken, setPlan, setMetadata, async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.create({
      payment_method: req.body.payment_method_id,
      amount: req.price,
      currency: 'eur',
      confirmation_method: 'manual',
      confirm: true,
      metadata: req.metadata
    });
    res.send(generate_payment_response(intent, req, res));
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/charge_confirm", checkToken, async (req, res) => {
  try {
    const intent = await stripe.paymentIntents.confirm(req.body.payment_intent_id);
    res.send(generate_payment_response(intent, req, res));
  } catch (err) {
    console.log("WOUPS, there was an error during confirmation");
    res.status(500).send(err);
  }
})

module.exports = router;
