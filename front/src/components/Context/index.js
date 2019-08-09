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
      loggedUserId: "",
      emailAddress: "",
      password: "",
      firstName: "",
      lastName: "",
      readyRedirect: false,
      prevPage: "/",
      errorMessageSignIn: "",
      isErrorSignIn: false
    };
  }

  // when mounting, the emailAddress and password of the signed in user are retrieved from localStorage
  // the user is signed in every time this component mount
  componentWillMount() {
    console.log("Context mounting");
    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');
    console.log(emailAddress);
    console.log(password);
    if (emailAddress) {
      console.log("okay, we have an email address, trying to sign in now");
      this.signin(emailAddress, password, false, "/");
    }
  }

  // sign in method
  // used after sign in, sign up, and every time this component mount
  signin = (emailAddress, password, readyRedirect, prevPage) => {
    axios.get(`http://localhost:5000/users`, {
      auth: {
        username: emailAddress,
        password: password
      }
    }).then( response => {
      console.log("okay, we got an answer, the user passed the test")
      this.setState({
        emailAddress: emailAddress,
        password: password,
        loggedUserId: response.data.id,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        readyRedirect: readyRedirect,
        prevPage: prevPage
      });
      // storing the user's credentials in localStorage
      localStorage.setItem('emailAddress', this.state.emailAddress);
      localStorage.setItem('password', this.state.password);
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
        loggedUserId: "",
        emailAddress: "",
        password: "",
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
        loggedUserId: this.state.loggedUserId,
        emailAddress: this.state.emailAddress,
        password: this.state.password,
        readyRedirect: this.state.readyRedirect,
        prevPage: this.state.prevPage,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        errorMessageSignIn: this.state.errorMessageSignIn,
        isErrorSignIn: this.state.isErrorSignIn,
        actions: {
          signin: this.signin,
          signout: this.signout
        }
      }}>
        { this.props.children }

      </UserContext.Provider>
    );
  }
}

export default withRouter(Provider);
export const Consumer = UserContext.Consumer;
// export const UserContextBis = UserContext;
