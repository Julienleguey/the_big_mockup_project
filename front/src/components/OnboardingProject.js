import React, { Component } from 'react';
import styled from "styled-components";
import { Redirect, Route } from 'react-router-dom';
import { Consumer } from './Context';
import axios from 'axios';
import Templates from '../params/templates.js';

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
  flex-wrap: wrap;
  width: 80%;
  margin-bottom: 24px;
`;

const Device = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  margin-bottom: 24px;
`;

const Template = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 80%;
  margin-bottom: 24px;
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

  &.active {
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
  height: 100px;
  margin-bottom: 80px;
`;

const os = ["ios", "android"];
const devices = [
  {value: "iphone_8_plus",
  name: "iPhone 8 plus"},
  {value: "iphone_xr",
  name: "iPhone XR"},
  {value: "iphone_x",
  name: "iPhone X Black"},
  {value: "ipad_2_portrait",
  name: "iPad 2 portrait"},
  {value: "ipad_3_portrait",
  name: "iPad 3 portrait"},
  {value: "pixel_3a_XL",
  name: "Pixel 3a XL"},
  {value: "nexus_7",
  name: "Nexus 7"},
  {value: "nexus_9",
  name: "Nexus 9"},
  {value: "nexus_10",
  name: "Nexus 10"},
  {value: "android_10_anonym",
  name: 'Android 10" anonym'}
];
const templates = Templates;

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

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value })
  };

  handleSubmit = (e, emailAddress, password) => {
    e.preventDefault();

    axios.post(`http://localhost:5000/projects/new`, {
      name: this.state.name,
      os: this.state.os,
      device: this.state.device,
      template: this.state.template
    }, {
      auth: {
        username: emailAddress,
        password: password
      },
    }).then( res => {
      console.log(res);
      console.log(res.data.id);
      window.location.replace("/projects");
    }).catch(err => {
      if (err.response.status === 500 ) {
        this.props.history.push("/error");
      } else {
        console.error(err);
      }
    })
  }



  displayOs = () => {
    const allOs = os.map( (wassaname, index) => (
      <Choice key={index} className={this.state.os === wassaname ? "active" : null} onClick={() => this.handleChange("os", wassaname)}>
        {wassaname}
      </Choice>
    ));
    return allOs;
  }

  displayDevices = () => {
    const allDevices = devices.map( (device, index) => (
      <Choice key={index} className={this.state.device === device.value ? "active" : null} onClick={() => this.handleChange("device", device.value)}>
        {device.name}
      </Choice>
    ));
    return allDevices;
  }

  displayTemplates = () => {
    const allTemplates = templates.map( (template, index) => (
      <Choice key={index} className={this.state.template === template.index ? "active" : null} onClick={() => this.handleChange("template", template.index)}>
        {template.name}
      </Choice>
    ));
    return allTemplates;
  }

  render() {
    return(
      <Wrapper>
        <DoubleWrapper>
          <Os>
            {this.displayOs()}
          </Os>
          <Device>
            {this.displayDevices()}
          </Device>
          <Template>
          {this.displayTemplates()}
          </Template>
          <Name>
            <Consumer>
              { context => {
                return(
                  <Form onSubmit={e => this.handleSubmit(e, context.emailAddress, context.password)}>
                    <Input id="name" type="text" name="name" value={this.state.name} onChange={this.handleInput}/>
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
