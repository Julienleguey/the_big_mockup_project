import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
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

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;


class ResetPassword extends Component {

  state = {
    emailAddress: "",
    loaded: false,
    newPassword: "",
    confirmNewPassword: "",
    isError: false,
    errorMessage: ""
  }

  componentWillMount = () => {
    console.log(this.props.match.params.resetPasswordToken);
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/users/check_reset_token/${this.props.match.params.resetPasswordToken}`)
      .then( res => {
        console.log("c'est bon, tu peux passer!");
        console.log(res);
        this.setState({
          emailAddress: res.data.email,
          loaded: true
        });
      }).catch( err => {
        console.log("pas de basket!");
      })
  }

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

  changePassword = (e) => {
    e.preventDefault();
    console.log("let's update the password");

    //checking that the password contains at least 1 character and that the password and password confirmation match
    if (this.state.newPassword.length === 0) {
      this.setState({
        isError: true,
        errorMessage: "Password must contains at least 1 character!"
      });
    } else if (this.state.newPassword !== this.state.confirmNewPassword) {
      this.setState({
        isError: true,
        errorMessage: "Password and Confirm Password do not match!"
      });
    } else {
        // const token = localStorage.getItem('token');
        // if the passwords requirements are met, posting
        axios.put(`${process.env.REACT_APP_API_ENDPOINT}/users/reset_password`, {
          resetPasswordToken: this.props.match.params.resetPasswordToken,
          newPassword: this.state.newPassword
        }).then( res => {
          console.log("lets login now");
          console.log(res);
          this.props.context.actions.setFlash("success", "Your password was successfully updated!")
          this.props.context.actions.login(res.data.email, this.state.newPassword);
        }).catch(err => {
          console.log(err);
          this.setState({
            isError: true,
            errorMessage: err.response.data.message
          });
        })
    }
  }

  render() {
    const { context } = this.props;
    if (this.state.loaded) {
      return (
        <Wrapper>
          <Title>Reset Password</Title>
          <Section>
            <form method="post" onSubmit={this.changePassword}>
              <div>
                <label htmlFor="newPassword">New password: </label>
                <input id="newPassword" name="newPassword" type="password" className="" placeholder=" New password" value={this.state.newPassword} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="confirmNewPassword">Confirm new password: </label>
                <input id="confirmNewPassword" name="confirmNewPassword" type="password" className="" placeholder="Confirm New Password" value={this.state.confirmNewPassword} onChange={this.handleChange} />
              </div>
              { this.state.isError ? (
                <div>
                  <h2 className="validation--errors--label">Validation errors</h2>
                  <div className="validation-errors">
                    <p>{this.displayErrors()}</p>
                  </div>
                </div>
              ) : null }
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Save</button>
              </div>
            </form>

          </Section>
        </Wrapper>
      );
    } else {
      return (
        <Wrapper>
          <Title>Reset Password - you're not allowed here!</Title>
        </Wrapper>
      );
    }


  }
}

export default withRouter(ResetPassword);
