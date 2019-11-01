import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  form {
    margin: 0 auto;
  }
`;

const Title = styled.div`
  margin: 50px;
  text-align: center;
  font-size: 50px;
`;


class ForgotPassword extends Component {

  state = {
    emailAddress: ""
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  forgotPassword = (e) => {
    e.preventDefault();
    console.log("send me an email already!");
    axios.post(`${process.env.REACT_APP_API_ENDPOINT}/users/forgot_password`, {
      email: this.state.emailAddress
    }).then( res => {
      console.log("email sent");
      console.log(res);
      this.props.context.actions.setFlash("success", `An email was sent to ${this.state.emailAddress}`);
    }).catch( err => {
      console.log(err)
    })
  }


  render() {
    const { context } = this.props;
    return (
      <Wrapper>
        <Title>Forgot Password</Title>
        <form method="post" onSubmit={this.forgotPassword}>
          <div>
            <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleChange} />
          </div>
          <div className="grid-100 pad-bottom">
            <button className="button" type="submit">Send me an email</button>
          </div>
        </form>
      </Wrapper>
    );
  }
}

export default ForgotPassword;
