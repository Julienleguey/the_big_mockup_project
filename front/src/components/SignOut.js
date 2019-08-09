import React from 'react';
import { Consumer } from './Context';

// doesn't return a page, just here to sign out the user
const SignOut = () => (
  <Consumer>
    { context => {
      // when the user signs out, the signout method from context is called (cf /Context/index.js)
      context.actions.signout();
    }}
  </Consumer>
);

export default SignOut;
