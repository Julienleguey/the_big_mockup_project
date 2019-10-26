import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled from "styled-components";

import SignIn from './SignIn';
import SignUp from './SignUp';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 0;
`;

const ChoiceContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
`;

const Option = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 150px;
  padding: 8px 24px;
  border: 1px solid black;

  &:hover {
    cursor: pointer;
    background-color: lightgrey;
  }

  &.active {
    background-color: lightgrey;
  }
`;

const Text = styled.p``;

const Main = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
`;

const SignOption = styled.div`
  display: none;

  &.active {
    display: flex;
  }
`;

class SignContainer extends Component {

  state = {
    selected: "signin"
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value })
  };

  cancel = (e) => {
    e.preventDefault();
    this.props.history.push("/");
  }

  login = (e, emailAddress, password) => {
    e.preventDefault();
    const { context } = this.props;
    context.actions.login(emailAddress, password, true, this.state.prevPage).then( user => {
      console.log(user);
      console.log(context);
      // soit le user s'est logué sur la page de login et on le renvoie sur la page d'accueil
      // soit le user s'est logué depuis une privateRoute et on le renvoie vers la page à laquelle il tentait d'accéder
      if (this.props.location.state) {
        this.props.history.push(this.props.location.state.from.pathname);
      } else {
        this.props.history.push("/");
      }
    });
  }



  render() {
    const { context } = this.props;
    return (
      <Wrapper>
        <ChoiceContainer>
          <Option className={this.state.selected === "signin" ? "active" : null} onClick={() => this.handleChange("selected", "signin")}>
            <Text>login</Text>
          </Option>
          <Option className={this.state.selected === "signup" ? "active" : null} onClick={() => this.handleChange("selected", "signup")}>
            <Text>create an account</Text>
          </Option>
        </ChoiceContainer>
        <Main>
          <SignOption className={this.state.selected === "signin" ? "active" : null}>
            <SignIn
              emailAddress={context.emailAddress}
              isErrorSignIn={context.isErrorSignIn}
              errorMessageSignIn={context.errorMessageSignIn}
              cancel={this.cancel}
              login={this.login}
            />
          </SignOption>
          <SignOption className={this.state.selected === "signup" ? "active" : null}>
            <SignUp
              cancel={this.cancel}
              login={this.login}
            />
          </SignOption>
        </Main>
      </Wrapper>
    );
  }
}

export default withRouter(SignContainer);
