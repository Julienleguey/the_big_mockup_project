import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Consumer } from './Context';
import styled from "styled-components";


class SignIn extends Component {


  constructor() {
    super();
    this.state = {
      prevPage: "/",
      emailAddress: "",
      password: ""
    };
  }

  // if the user has been redirected to the sign in page, the location (s)he tried to access is stored
  // after (s)he successfully signed in, the user can be redirected to it
  componentDidMount() {
    if (this.props.location.state) {
      this.setState({ prevPage: this.props.location.state.from.pathname });
    }
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

    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            <Consumer>
              { context => {

                const signin = (e) => {
                  e.preventDefault();
                  // when the user signs in, the login method from context is called (cf /Context/index.js)
                  context.actions.login(this.state.emailAddress, this.state.password, true, this.state.prevPage);
                }


                if (context.emailAddress) {
                  return (
                    <div>
                      <p>You are logged in!</p>
                    </div>
                  );
                } else {
                  return (
                    <>
                      {context.isErrorSignIn?
                        <div>
                          <h2 className="validation--errors--label">Validation errors</h2>
                          <div className="validation-errors">
                            <p>{context.errorMessageSignIn}</p>
                          </div>
                        </div>
                      : null }

                      <form method="post" onSubmit={signin}>
                        <div>
                          <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleChange} />
                        </div>
                        <div>
                          <input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
                        </div>
                        <div className="grid-100 pad-bottom">
                          <button className="button" type="submit">Sign In</button>
                          <button className="button button-secondary" onClick={this.cancel}>Cancel</button>
                        </div>
                      </form>
                    </>
                  );
                }
              }}
            </Consumer>
          </div>
          <p>&nbsp;</p>
          <p>Don't have a user account? <Link to="/signup">Click here</Link> to sign up!</p>
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);
