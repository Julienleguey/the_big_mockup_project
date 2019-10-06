import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
const UserContext = React.createContext();

/*
Using the React Context API to store the user credentials
readyRedirect and prevPage are used to redirect the user after (s)he successfully signed in
errorMessageSignIn and isErrorSignIn are used to display error messages when the user tries to sign in (cf UserSignIn.js)
*/


class Provider extends Component {

  constructor() {
    super();
    this.state = {
      isLogged: false,
      loggedUserId: "",
      emailAddress: "",
      firstName: "",
      lastName: "",
      readyRedirect: false,
      prevPage: "/",
      errorMessageSignIn: "",
      isErrorSignIn: false
    };
  }

  // when mounting, the token is retrieved from localStorage
  // the user is signed in every time this component mount
  componentWillMount() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("okay, we have a token, trying to sign in now");
      this.signWithToken(token);
    }
  }


  // used only when the app is launched
  signWithToken = (token) => {
    axios.get(`http://localhost:5000/users/signwithtoken`, {
        headers: { Authorization: `obladi ${token}`}
      }).then( res => {
        console.log(res);
        this.setState({
          isLogged: true,
          loggedUserId: res.data.user.id,
          emailAddress: res.data.user.email,
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName
        });
      }).catch(error => {
        console.error(error);
      });
  }


  // login to create a token and put it in localStorage ("signup" and "signin" actions)
  login = (emailAddress, password, readyRedirect, prevPage) => {
    axios.get(`http://localhost:5000/users/login`, {
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
        readyRedirect: readyRedirect,
        prevPage: prevPage
      });
      // storing the token in the local storage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('loggedUserId', this.state.loggedUserId);
    }).then( () => {
      // if the user just signed in (using UserSignIn.j), (s)he is redirected to the previous page
      // or the page (s)he tried to go to but had to be signed in to do that (i.e. /courses/create)
      if (this.state.readyRedirect) {
        if (this.state.prevPage === "/") {
          this.props.history.goBack();
        } else {
          this.props.history.push(this.state.prevPage);
        }
      }
    }).catch(error => {
      if (error.response.status === 500) {
        this.props.history.push("/error");
      } else {
        // used by UserSignIn to display the error messages (incorrect email or password)
        this.setState({
          errorMessageSignIn: error.response.data.message,
          isErrorSignIn: true
        });
      }
    });
  }

  // signing out method, cleans the user credentials (in state and localStorage)
  signout = () => {
    Promise.resolve()
      .then( () => {
      this.setState({
        isLogged: false,
        loggedUserId: "",
        emailAddress: "",
        firstName: "",
        lastName: "",
        readyRedirect: false,
        prevPage: "/",
        errorMessageSignIn: "",
        isErrorSignIn: false
      });
      localStorage.clear();
    }).then( () => {
      this.props.history.push("/");
    })
  }

  render() {
    return(
      <UserContext.Provider value={{
        isLogged: this.state.isLogged,
        loggedUserId: this.state.loggedUserId,
        emailAddress: this.state.emailAddress,
        readyRedirect: this.state.readyRedirect,
        prevPage: this.state.prevPage,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        errorMessageSignIn: this.state.errorMessageSignIn,
        isErrorSignIn: this.state.isErrorSignIn,
        actions: {
          signout: this.signout,
          login: this.login
        }
      }}>
        { this.props.children }

      </UserContext.Provider>
    );
  }
}

export default withRouter(Provider);
export const Consumer = UserContext.Consumer;
