import React from 'react';
import { Redirect } from 'react-router-dom';

const SignOut = ({context}) => {
  context.actions.signout();
  return (
    <Redirect to="/" />
  );
};

export default SignOut;
