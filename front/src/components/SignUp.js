import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Consumer } from './Context';
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


  // method for the cancel button (redirect to the default page)
  cancel = (e) => {
    e.preventDefault();
    this.props.history.push("/");
  }



  render() {

    return(
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign Up</h1>
            <Consumer>
              { context => {

                const signup = (e) => {
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
                      axios.post(`http://localhost:5000/users/new`, {
                        firstName: this.state.firstName,
                        lastName: this.state.lastName,
                        email: this.state.emailAddress,
                        password: this.state.password
                      }).then( response => {
                        context.actions.signin(this.state.emailAddress, this.state.password);
                      }).catch(error => {
                        if (error.response.status === 500 ) {
                          this.props.history.push("/error");
                        } else {
                          // displaying error messages sent by the server while creating a new user
                          // firstName, lastName and emailAddress are required
                          // the server also checks that the emailAddress is not already used and it's a correct emailAddress
                          this.setState({
                            isError: true,
                            errorMessage: error.response.data.message
                          });
                        }
                      })
                    }
                  }

                  // function to display the error messages
                  const displayErrors = () => {
                    const errorsInArray = this.state.errorMessage;
                    let errorsDisplayed = "";
                    if (Array.isArray(errorsInArray)) {
                      errorsDisplayed = errorsInArray.map(error => <li key={error.toString()}>{error}</li>);
                    } else {
                      errorsDisplayed = <li>{this.state.errorMessage}</li>;
                    }
                    return errorsDisplayed;
                  }

                  if (context.emailAddress) {
                    return(
                      <div>
                        <p>You are logged in!</p>
                      </div>
                    );
                  } else {
                    return(
                          <>
                          {this.state.isError ?

                            <div>
                              <h2 className="validation--errors--label">Validation errors</h2>
                              <div className="validation-errors">
                                <p>{displayErrors()}</p>
                              </div>
                            </div>

                          : null }
                          <div>
                            <form method="post" onSubmit={signup}>
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
                                <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
                              </div>
                            </form>
                          </div>
                          <p>&nbsp;</p>
                          <p>Already have a user account? <Link to="/signin">Click here</Link> to sign in!</p>
                          </>
                      );
                    }
                }
              }
            </Consumer>
          </div>
        </div>
    );
  }
}


export default withRouter(SignUp);
