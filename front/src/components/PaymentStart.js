import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';
import styled from "styled-components";
import axios from 'axios';

import plans from '../params/plans.js';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  margin: 50px;
  text-align: center;
  font-size: 50px;
`;

const Main = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const PlanSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 40px;
`;

const PaymentSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const Resume = styled.p``;

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 50px;
  margin: 0 auto;
  border: 1px solid black;
  border-radius: 10px;

  &:hover {
    background-color: green;
    cursor: pointer;
  }
`;

class PaymentStart extends Component {
  constructor() {
    super();
    this.state = {
      pk: "",
      plan: ""
    };
  }

  componentDidMount = () => {
    this.setState({plan: this.props.location.state.planId});

    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/stripe/get_public_key`).then( res => {
      this.setState({
        pk: res.data.pk
      })
    }).catch( err => {
      console.log("WOUPS");
    })
  }

  displayPlans = () => {
    const allPlans = plans.map((plan, index) => (
      <option key={index} value={plan.id}>{plan.name}</option>
    ));
    return allPlans;
  }

  displayPrice = () => {
    const found = plans.findIndex( element => {
      return element.id === this.state.plan
    });
    return plans[found].price;
  }

  handleChange = (key, value) => {
    this.setState({[key]: value})
  }

  render() {
    if (!this.state.pk) {
      return null;
    } else {
      return(
        <Wrapper>
          <Title>Payment start page</Title>
          <Main>
            <PlanSection>
              <label htmlFor={`plan`}>Select a plan:</label>
              <select id={`plan`} name="plan" onChange={e => this.handleChange(e.target.name, e.target.value)} value={this.state.plan} >
                {this.displayPlans()}
              </select>
              <Resume>You will pay ${this.displayPrice()}.</Resume>
            </PlanSection>
            <PaymentSection>
              <StripeProvider apiKey={this.state.pk}>
                <div className="example">
                  <h1>React Stripe Elements Example</h1>
                  <Elements>
                    <CheckoutForm
                      setFlash={this.props.context.actions.setFlash}
                      planId={this.state.plan}
                      loggedUserId={this.props.context.loggedUserId}
                      needRedirect={this.props.location.state.needRedirect}
                      redirectToProject={this.props.location.state.redirectToProject}
                      updateStatus={this.props.context.actions.updateStatus}
                    />
                  </Elements>
                </div>
              </StripeProvider>
            </PaymentSection>
          </Main>
        </Wrapper>
      )
    }
  }
}


export default withRouter(PaymentStart);
