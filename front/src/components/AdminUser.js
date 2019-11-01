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

const ChangeEmail = styled.div``;

const ChangePassword = styled.div``;

const Status = styled.div`
  display: flex;
  flex-direction: column;
`;

const InvoicesList = styled.div``;

const Button = styled.div``;


class AdminUser extends Component {
  state = {
    user: "",
    emailAddress: "",
    newPassword: "",
    confirmNewPassword: "",
    isError: false,
    errorMessage: ""
  }

  componentDidMount = () => {
    console.log("admin user mounted");
    console.log(this.props.location.state.user);
    this.getUser(this.props.location.state.user.id);
  }

  getUser = id => {
    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/admin/user/${id}`, {
        headers: { Authorization: `obladi ${token}`}
      }).then( res => {
        console.log(res);
        this.setState({ user: res.data });
      }).catch( err => {
        console.log(err);
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
        const token = localStorage.getItem('token');
        // if the passwords requirements are met, posting
        axios.put(`${process.env.REACT_APP_API_ENDPOINT}/admin/change_password`, {
          userId: this.props.location.state.user.id,
          newPassword: this.state.newPassword
        }, {
          headers: { Authorization: `obladi ${token}`}
        }).then( res => {
          this.getUser(this.props.location.state.user.id);
          this.props.context.actions.setFlash("success", "The user's password was successfully updated!");
          this.setState({
            isError: false,
            errorMessage: ""
          });
        }).catch(err => {
          this.setState({
            isError: true,
            errorMessage: err.response.data.message
          });
        })
    }
  }

  updateProfile = (e) => {
    e.preventDefault();

    const newInfos = { email: this.state.emailAddress };

    const token = localStorage.getItem('token');
    axios.put(`${process.env.REACT_APP_API_ENDPOINT}/admin/update_profile/${this.props.location.state.user.id}`, newInfos, {
      headers: { Authorization: `obladi ${token}`}
    }).then( res => {
      this.getUser(this.props.location.state.user.id);
      this.props.context.actions.setFlash("success", "The profile's infos were successfully updated!");
    }).catch( err => {
      console.log(err);
    })
  }

  updateStatus = (status, period, extension) => {
    const token = localStorage.getItem('token');
    axios.put(`${process.env.REACT_APP_API_ENDPOINT}/admin/update_status/${this.props.location.state.user.id}`, {
      status: status,
      period: period,
      extension: extension
    }, {
      headers: { Authorization: `obladi ${token}`}
    }).then( res => {
      this.getUser(this.props.location.state.user.id);
      this.props.context.actions.setFlash("success", "The status was successfully updated!");
    }).catch( err => {
      console.log(err);
    })
  }

  render() {
    return(
      <Wrapper>
        <Title>Admin User</Title>
        <Main>
          <h1>{this.state.user.firstName} {this.state.user.lastName}</h1>
          <ChangeEmail>
            <p>Change the user email:</p>
            <form method="post" onSubmit={this.updateProfile}>
              <div>
                <label htmlFor="emailAddress">Email Address: </label>
                <input id="emailAddress" name="emailAddress" type="text" className="" placeholder="Email Address" value={this.state.emailAddress} onChange={this.handleChange} />
              </div>
              <div className="grid-100 pad-bottom">
                <button className="button" type="submit">Save</button>
              </div>
            </form>
          </ChangeEmail>
          <ChangePassword>
            <p>Change the user password:</p>
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
          </ChangePassword>
          <Status>
            <p>Status: {this.state.user.status}</p>
            <p>premiumUntil: {this.state.user.premiumUntil}</p>
            <Button onClick={() => {this.updateStatus("pre_suspended", "days", 0)}}>
              <p>pre-suspend user</p>
            </Button>
            <Button onClick={() => {this.updateStatus("active", "days", 3)}}>
              <p>add 3 days</p>
            </Button>
            <Button onClick={() => {this.updateStatus("active", "days", 7)}}>
              <p>add 7 days</p>
            </Button >
            <Button onClick={() => {this.updateStatus("active", "months", 1)}}>
              <p>add 1 month</p>
            </Button>
            <Button onClick={() => {this.updateStatus("active", "months", 6)}}>
              <p>add 6 months</p>
            </Button>
            <Button onClick={() => this.updateStatus("active", "months", 12)}>
              <p>add 1 year</p>
            </Button>
          </Status>
        </Main>
      </Wrapper>
    )
  }
}

// show a list of the invoices of the user
// send an email with the payment confirmation
// refund the user ?

export default AdminUser;
