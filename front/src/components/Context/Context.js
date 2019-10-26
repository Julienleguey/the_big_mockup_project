import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
const UserContext = React.createContext();


export class Provider extends Component {

  constructor() {
    super();
    this.state = {
      appReady: false,
      isLogged: false,
      loggedUserId: "",
      emailAddress: "",
      firstName: "",
      lastName: "",
      status: "",
      flashOpen: false,
      flashType: "standard",
      flashMsg: "",
      errorMessageSignIn: "",
      isErrorSignIn: false
    };
  }

  // when mounting, the token is retrieved from localStorage
  // the user is signed in every time this component mount (when the app start, on refresh, while using href)
  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      this.signWithToken(token);
    } else {
      this.setState({appReady: true});
    }
  }

  // used only when the app is launched
  signWithToken = async (token) => {
    await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/users/signwithtoken`, {
        headers: { Authorization: `obladi ${token}`}
      }).then( res => {
        this.setState({
          isLogged: true,
          loggedUserId: res.data.user.id,
          emailAddress: res.data.user.email,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          status: res.data.user.status,
          appReady: true
        });
      }).catch(err => {
        this.setState({appReady: true});
      });
  }

  // login to create a token and put it in localStorage ("signup" and "signin" actions)
  login = async (emailAddress, password) => {
    const user = await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/users/login`, {
      auth: {
        username: emailAddress,
        password: password
      }
    }).then( res => {
      this.setState({
        isLogged: true,
        loggedUserId: res.data.user.id,
        emailAddress: res.data.user.email,
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
        status: res.data.user.status,
        errorMessageSignIn: "",
        isErrorSignIn: false
      });
      // storing the token in the local storage
      localStorage.setItem('token', res.data.token);
      return res.data.user;
    }).catch(err => {
      if (err.response.status === 500) {
        this.props.history.push("/error");
      } else {
        // used by UserSignIn to display the error messages (incorrect email or password)
        this.setState({
          errorMessageSignIn: err.response.data.message,
          isErrorSignIn: true
        });
      }
    });

    if (user) {
      return user;
    }
  }

  // signing out method, cleans the user credentials (in state and localStorage)
  signout = () => {
    this.setState({
      isLogged: false,
      loggedUserId: "",
      emailAddress: "",
      firstName: "",
      lastName: "",
      status: "",
      errorMessageSignIn: "",
      isErrorSignIn: false
    });
    localStorage.clear();
  }

  // update the status of the user if it's "active" or "testing"
  updateStatus = (newStatus) => {
    this.setState({
      status: newStatus
    });
  }

  // method to open the flash
  setFlash = (type, msg) => {
    this.setState({
      flashOpen: true,
      flashType: type,
      flashMsg: msg
    })
  }

  // method to close the flash
  closeFlash = () => {
    this.setState({
      flashOpen: false,
      flashType: "standard",
      flashMsg: ""
    })
  }

  render() {
    if (this.state.appReady) {
      return(
        <UserContext.Provider value={{
          isLogged: this.state.isLogged,
          loggedUserId: this.state.loggedUserId,
          emailAddress: this.state.emailAddress,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          status: this.state.status,
          flashOpen: this.state.flashOpen,
          flashType: this.state.flashType,
          flashMsg: this.state.flashMsg,
          errorMessageSignIn: this.state.errorMessageSignIn,
          isErrorSignIn: this.state.isErrorSignIn,
          actions: {
            signout: this.signout,
            login: this.login,
            setRedirect: this.setRedirect,
            updateStatus: this.updateStatus,
            setFlash: this.setFlash,
            closeFlash: this.closeFlash
          }
        }}>
          { this.props.children }

        </UserContext.Provider>
      );
    } else {
      return null;
    }
  }
}

export const Consumer = UserContext.Consumer;

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <UserContext.Consumer>
      {context => <Component {...props} context={context} /> }
      </UserContext.Consumer>
    );
  }
}
