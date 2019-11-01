import React from 'react';
import { Link } from 'react-router-dom';
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

const Header = (props) => {
  const { context } = props;
  return (
    <Wrapper>
      <Left>
        <Link to="/">Home</Link>
        <Link to="/projects">Projects</Link>
      </Left>
      <Middle>
        <span>Welcome{context.isLogged ? ` ${context.firstName} ${context.lastName}` : ""}!</span>
      </Middle>
      <Right>
        <Link to="/pricing">Pricing</Link>
          <nav>
            { context.isLogged ?
              <Link to="/signout">Sign Out</Link>
              :
              <>
              <Link to="/login">Login</Link>
              </>
            }
            <Link to="/profile">Profile</Link>
          </nav>
      </Right>
    </Wrapper>
  )
};

export default Header;
