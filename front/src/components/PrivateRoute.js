import React from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';
import { Consumer } from './Context/Context';

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      { context => {
        if (!context.isLogged) {
          context.actions.setFlash("warning", "You must be logged in!");
        } else if (context.status !== "active") {
          context.actions.setFlash("warning", "You need a premium account to access to your projects!")
        }

        return (
          <Route {...rest} render={ props => !context.isLogged ? (
            <Redirect to={{ pathname: "/login", state: { from: props.location }}} />
          ) : context.status !== "active" ? (
                <Redirect to={{ pathname: "/pricing" }} />
              ) : (
                <Component {...props} loggedUserId={context.loggedUserId}/>
              )
            }
          />
        );
      }}
    </Consumer>
  );
}

export default PrivateRoute;
