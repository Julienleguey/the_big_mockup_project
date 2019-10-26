import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {CardElement, injectStripe} from 'react-stripe-elements';
import axios from 'axios';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleServerResponse = this.handleServerResponse.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }

  async submit(ev) {
    const {paymentMethod} = await this.props.stripe.createPaymentMethod('card', {});
    const token = localStorage.getItem("token");

    const data = JSON.stringify({
      payment_method_id: paymentMethod.id,
      planId: this.props.planId
    });

    await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/stripe/charge_sca`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `obladi ${token}`
      }
    }).then( res => {
      this.handleServerResponse(res);
    }).catch( err => {
      this.handlePaymentError();
    })

  }

  async handleServerResponse(res) {
    if (res.error) {
      // Show error from server on payment form
      console.log("THERE WAS AN ERROR DURING THE PAYMENT!");
      this.handlePaymentError();
    } else if (res.data.requires_action) {
      // Use Stripe.js to handle required card action
      console.log("AN ACTION IS REQUIRED!");
      await this.handleAction(res);
    } else {
      // Show success message
      this.handlePaymentSuccess();
    }
  }

  async handleAction(res) {
    const token = localStorage.getItem("token");

    const {
      error: errorAction,
      paymentIntent
    } = await this.props.stripe.handleCardAction(
      res.data.payment_intent_client_secret
    );

    if (errorAction) {
      console.log("ERROR ACTION");
      // Show error from Stripe.js in payment form
      this.handlePaymentError();
    } else {

      const data = JSON.stringify({ payment_intent_id: paymentIntent.id });

      await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/stripe/charge_confirm`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `obladi ${token}`
        }
      }).then( res => {
        this.handleServerResponse(res);
      }).catch( err => {
        this.handlePaymentError();
      })
    }
  }

  handlePaymentError = () => {
    this.props.setFlash("error", "Something went wrong with the payment. Please try again.")
  }

  handlePaymentSuccess = () => {
    this.props.updateStatus("active");
    this.props.setFlash("success", "Congrats! It worked!");

    if (this.props.needRedirect) {
      this.props.history.push({pathname: `/project`, state: { userId: this.props.loggedUserId, projectId: this.props.redirectToProject } });
    } else {
      this.props.history.push("/");
    }

  }

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        <button onClick={this.submit}>Purchase</button>
      </div>
    );
  }
}

export default injectStripe(withRouter(CheckoutForm));
