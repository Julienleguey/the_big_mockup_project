import React from 'react';
import {
  Route,
  Redirect
} from 'react-router-dom';
import { Consumer } from './Context';


// a private route used by the Projects and other components
// making sure the user is authenticated before accessing these components
// if the user is not authenticated, (s)he is redirected to the sign in page


const PrivateRoute = ({ component: Component, ...rest }) => {

  // est-ce qu'il ne faudrait pas commencer par vérifier que le user est signed in ici avant de continuer, plutôt que de mettre le test dans return() ?


  return(
    <Consumer>
      { context => {
        console.log(context);
        console.log(context.loggedUserId);
        // context.emailAddress is returned empty if the user type "http://localhost:3000/courses/[courses_id]/update", hence redirect to /signin
        // context.emailAddress is not returned empty if the user clicks on the "update" button
        // not using this: <Route {...rest} render={ props => context.emailAddress ? (
        if (context.loggedUserId) {
          console.log("logged in!");
        } else {
          console.log("not logged in, but still a little bit but, you know that's weird, right?");
        }


        return(
          <Route {...rest} render={ props => context.loggedUserId ? (
                <Component {...props} loggedUserId={context.loggedUserId}/>
              ) : (
                // if the user is redirected to /signin the location (s)he tried to access is passed to UserSignIn
                // in order for the user to be redirected to this specific location after (s)he successfully signed in
                <Redirect to={{ pathname: "/signin", state: { from: props.location }}} />
              )
            }
          />
        );
      }}
    </Consumer>
  );
}

export default PrivateRoute;
