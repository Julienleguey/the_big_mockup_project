import React from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';
import { Consumer } from './Context/Context';

const PrivateAccess = ({ component: Component, ...rest }) => {
  const restrainedToken = localStorage.getItem("restrainedToken");
  console.log("RESTRAINED TOKEN: ", restrainedToken);
  const tokenDate = new Date(restrainedToken);
  tokenDate.setDate(tokenDate.getDate() + 1);
  const now = new Date();

  if (tokenDate < now) {
    localStorage.removeItem("restrainedToken");
  }

  return (
    <Route {...rest} render={ props => !restrainedToken ? (
      <Redirect to={{ pathname: "/restrained" }} />
    ) : (
      <Component {...props} />
    ) } />
  );
}

export default PrivateAccess;
