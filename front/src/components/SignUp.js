import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from "styled-components";
import axios from 'axios';


class SignUp extends Component {

  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      confirmPassword: "",
      isError: false,
      errorMessage: ""
    };
  }

  // when the user change the text in the form, the state is updated with the corresponding input
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  // function to display the error messages
  displayErrors = () => {
    const errorsInArray = this.state.errorMessage;
    let errorsDisplayed = "";
    if (Array.isArray(errorsInArray)) {
      errorsDisplayed = errorsInArray.map(error => <li key={error.toString()}>{error}</li>);
    } else {
      errorsDisplayed = <li>{this.state.errorMessage}</li>;
    }
    return errorsDisplayed;
  }

  signup = (e) => {
    e.preventDefault();
    //checking that the password contains at least 1 character and that the password and password confirmation match
    if (this.state.password.length === 0) {
      this.setState({
        isError: true,
        errorMessage: "Password must contains at least 1 character!"
      });
    } else if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        isError: true,
        errorMessage: "Password and Confirm Password do not match!"
      });
    } else {
        // if the passwords requirements are met, creating a new user
        axios.post(`${process.env.REACT_APP_API_ENDPOINT}/users/new`, {
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.emailAddress,
          password: this.state.password
        }).then( res => {
          this.props.login(e, this.state.emailAddress, this.state.password);
        }).catch(err => {
          this.setState({
            isError: true,
            errorMessage: err.response.data.message
          });
        })
    }
  }

  render() {
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
            { this.state.isError ? (
              <div>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div className="validation-errors">
                  <p>{this.displayErrors()}</p>
                </div>
              </div>
            ) : null }
            <div>
              <form method="post" onSubmit={this.signup}>
                <div>
                  <input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} />
                </div>
                <div>
                  <input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} />
                </div>
                <div>
                  <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleChange} />
                </div>
                <div>
                  <input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
                </div>
                <div>
                  <input id="confirmPassword" name="confirmPassword" type="password" className="" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.handleChange} />
                </div>
                <div className="grid-100 pad-bottom">
                  <button className="button" type="submit">Sign Up</button>
                  <button className="button button-secondary" onClick={this.props.cancel}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
    );
  }
}


export default withRouter(SignUp);
