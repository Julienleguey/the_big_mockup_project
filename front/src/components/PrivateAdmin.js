import React from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';
import { Consumer } from './Context/Context';

const PrivateAdmin = ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      { context => {
        if (context.emailAddress !== process.env.REACT_APP_ADMIN) {
          context.actions.setFlash("error", "Don't try that again or you will be banned!");
        }

        return (
          <Route {...rest} render={ props => context.emailAddress !== process.env.REACT_APP_ADMIN ? (
            <Redirect to={{ pathname: "/" }} />
          ) : (
                <Component {...props} />
              )
            }
          />
        );
      }}
    </Consumer>
  );
}

export default PrivateAdmin;
