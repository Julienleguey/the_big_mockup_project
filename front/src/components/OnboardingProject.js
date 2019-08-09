import React, { Component } from 'react';
import styled from "styled-components";
import { Redirect, Route } from 'react-router-dom';
import { Consumer } from './Context';
import axios from 'axios';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const DoubleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Os = styled.div`
  display: flex;
  flex-direction: row;
`;

const Device = styled.div`
  display: flex;
  flex-direction: row;
`;

const Template = styled.div`
  display: flex;
  flex-direction: row;
`;

const Name = styled.div`
  display: flex;
  justify-content: center;
`;

const Choice = styled.div`
  width: 200px;
  height: 100px;
  background-color: lightgrey;
  margin: 10px;

  &:hover {
    cursor: pointer;
  }

  &.focusOS, &.focusDevice, &.focusTemplate {
    background-color: darkgrey;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 300px;
  height: 50px;
`;

const Button = styled.button`
  margin-top: 16px;
`;

class Onboarding extends Component {

  constructor() {
    super();
    this.state = {
      os: "",
      device: "",
      template: "",
      name: ""
    };
  }

  focusOS = (e, os) => {
    if (document.querySelector(".focusOS")) {
      document.querySelector(".focusOS").classList.remove("focusOS");
    }
    e.target.classList.add("focusOS");
    this.setState({
      os: os
    });
  }

  focusDevice = (e, device) => {
    if (document.querySelector(".focusDevice")) {
      document.querySelector(".focusDevice").classList.remove("focusDevice");
    }
    e.target.classList.add("focusDevice");
    this.setState({
      device: device
    });
  }

  focusTemplate = (e, template) => {
    if (document.querySelector(".focusTemplate")) {
      document.querySelector(".focusTemplate").classList.remove("focusTemplate");
    }
    e.target.classList.add("focusTemplate");
    this.setState({
      template: template
    });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  handleSubmit = (e, emailAddress, password) => {
    e.preventDefault();
    console.log(this.state);

    axios.post(`http://localhost:5000/projects/new`, {
      name: this.state.name,
      os: this.state.os
    }, {
      auth: {
        username: emailAddress,
        password: password
      },
    }).then( res => {
      console.log(res);
      console.log(res.data.id);
      // <Route path={`/projects/${res.data.id}`} render={ () => <Project /> } />
    }).catch(err => {
      if (err.response.status === 500 ) {
        this.props.history.push("/error");
      } else {
        console.error(err);
      }
    })
  }

  render() {
    return(
      <Wrapper>
        <DoubleWrapper>
          <Os>
            <Choice onClick={e => this.focusOS(e, "ios")}>
              iOS
            </Choice>
            <Choice onClick={e => this.focusOS(e, "android")}>
              Android
            </Choice>
          </Os>
          <Device>
            <Choice onClick={e => this.focusDevice(e, "iphone_xr")}>
              iPhone XR
            </Choice>
            <Choice onClick={e => this.focusDevice(e, "iphone_8_plus")}>
              iPhone 8 Plus
            </Choice>
          </Device>
          <Template>
            <Choice onClick={e => this.focusTemplate(e, "top")}>
              Top
            </Choice>
            <Choice onClick={e => this.focusTemplate(e, "middle")}>
              Middle
            </Choice>
            <Choice onClick={e => this.focusTemplate(e, "bottom")}>
              Bottom
            </Choice>
          </Template>
          <Name>
            <Consumer>
              { context => {
                return(
                  <Form onSubmit={e => this.handleSubmit(e, context.emailAddress, context.password)}>
                    <Input id="name" type="text" name="name" value={this.state.name} onChange={this.handleChange}/>
                    <Button className="button" type="submit">Create project</Button>
                  </Form>
                )}}
            </Consumer>
          </Name>
        </DoubleWrapper>
      </Wrapper>
    );
  }
}



export default Onboarding;
