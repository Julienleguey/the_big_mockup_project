import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from "styled-components";

class SignIn extends Component {

  constructor() {
    super();
    this.state = {
      emailAddress: "",
      password: ""
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  render() {
    const { context } = this.props;
    return (
      <div className="bounds">
        <div className="grid-33 centered signin">
          <h1>Sign In</h1>
          <div>
            {this.props.isErrorSignIn ? (
              <div>
                <h2 className="validation--errors--label">Validation errors</h2>
                <div className="validation-errors">
                  <p>{this.props.errorMessageSignIn}</p>
                </div>
              </div>
            ) : null }

            <form method="post" onSubmit={ e => this.props.login(e, this.state.emailAddress, this.state.password)}>
              <div>
                <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleChange} />
              </div>
              <div>
                <input id="password" name="password" type="password" className="" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Sign In</button>
                <button className="button button-secondary" onClick={this.props.cancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);
