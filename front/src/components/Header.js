import React from 'react';
import { Link } from 'react-router-dom';
import { Consumer } from './Context';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid grey;
  padding: 0 20px;
`;

const Left = styled.div`
  display: flex;
`;

const Middle = styled.div`
  display:flex;
`;

const Right = styled.div`
  display: flex;
`;

// Header displayed through all the app
// contains a button to redirect to the default page and a signin/signout button
const Header = () => (

  <Wrapper>
    <Left>
      <Link to="/">Home</Link>
      <Link to="/projects">Projects</Link>
    </Left>
    <Middle>
      <Consumer>
        { context => (
          <span>Welcome{context.emailAddress === "" ? "" : ` ${context.firstName} ${context.lastName}` }!</span>
        )}
      </Consumer>
    </Middle>
    <Right>
      <Consumer>
        { context => (
          <nav>
            { context.emailAddress !== "" ?
            <Link className="signout" to="/signout">Sign Out</Link>
            :
            <>
            <Link className="signin" to="/signin">Sign In</Link>
            <Link className="signup" to="/signup">Sign Up</Link>
            </>
          }
          </nav>
        )}
      </Consumer>
    </Right>
  </Wrapper>

);

export default Header;
