import React, { Component } from "react";
import styled from "styled-components";
import axios from 'axios';

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
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class Profile extends Component {
  state = {
    firstName: this.props.context.firstName,
    lastName: this.props.context.lastName,
    emailAddress: this.props.context.emailAddress,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    isError: false,
    errorMessage: ""
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

  // when the user change the text in the form, the state is updated with the corresponding input
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  updateProfile = (e) => {
    e.preventDefault();
    this.props.context.actions.updateUserInfo({firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.emailAddress});
  }

  changePassword = (e) => {
    e.preventDefault();

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
        axios.put(`${process.env.REACT_APP_API_ENDPOINT}/users/update_password/${this.props.context.loggedUserId}`, {
          email: this.props.context.emailAddress,
          password: this.state.currentPassword,
          newPassword: this.state.newPassword
        }, {
            // headers: { Authorization: `obladi ${token}`},

            auth: {
              username: this.props.context.emailAddress,
              password: this.state.currentPassword
            }

        }).then( res => {
          console.log("lets login now");
          this.props.context.actions.setFlash("success", "Your password was successfully updated!")
          this.props.context.actions.login(this.props.context.emailAddress, this.state.newPassword);
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
    return(
      <Wrapper>
        <Title>Profile</Title>
        <Main>
          <Section>
            <form method="post" onSubmit={this.updateProfile}>
              <div>
                <label htmlFor="firstName">First Name: </label>
                <input id="firstName" name="firstName" type="text" className="" placeholder="First Name" value={this.state.firstName} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="lastName">Last Name: </label>
                <input id="lastName" name="lastName" type="text" className="" placeholder="Last Name" value={this.state.lastName} onChange={this.handleChange} />
              </div>
              <div>
                <label htmlFor="emailAddress">Email Address: </label>
                <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleChange} />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Save</button>
              </div>
            </form>
          </Section>
          <Section>
            <form method="post" onSubmit={this.changePassword}>
              <div>
                <label htmlFor="currentPassword">Current password: </label>
                <input id="currentPassword" name="currentPassword" type="password" className="" placeholder="Current password" value={this.state.currentPassword} onChange={this.handleChange} />
              </div>
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
        </Main>
      </Wrapper>
    )
  }
}


export default Profile;
