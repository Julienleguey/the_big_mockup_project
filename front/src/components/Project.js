import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Canvas from './Canvas';
import axios from 'axios';
import DeviceSize from '../params/deviceSize.js';

// import images
import plus from '../images/add.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  justify-content: center;
`;


const Title = styled.div`
  margin: 0 auto;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 200px;
  margin: 0 auto;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 300px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const NewCanva = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  background-color: lightgrey;
  border: dashed 2px darkgrey;
  border-radius: 50%;
`;


class Project extends Component {

  constructor() {
    super();
    this.state = {
      name: "",
      os: "",
      device: "",
      canvas: []
    };
  }

  componentWillMount = () => {
    const projectId = this.props.match.params.id;

    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');

    axios.get(`http://localhost:5000/projects/project/${projectId}`, {
      auth: {
        username: emailAddress,
        password: password
      }}).then( res => {
        this.setState({
          name: res.data.name,
          os: res.data.os,
          device: res.data.device,
          canvas: res.data.Canvas
        })
      }).then( () => {
        // console.log(this.state.name);
        // console.log(this.state.os);
        // console.log(this.state.device);
        // console.log(this.state.canvas);
      }).catch(err => {
        console.error(err);
      });
  }




  displayCanvas = () => {
    // const canvas = this.state.canvas.map((canva, index) => (
    //   <Canvas key={index} index={index} canva={canva} size={DeviceSize[this.state.device]} device={this.state.device}/>
    // ));
    const canvas = this.state.canvas.map((canva, index) => (
      <Canvas key={index} index={index} canva={canva} size={DeviceSize[this.state.device]} device={this.state.device}/>
    ));
    return canvas;


  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  render() {
    return(
      <Wrapper>
        <Title>
          <h2>{this.state.name}</h2>
        </Title>
        <FiltersContainer>
          <Filter>
            <label htmlFor="os">Select an OS:</label>
            <select id="os" name="os" onChange={e => this.handleChange(e)} value={this.state.os}>
              <option value="">Select an OS</option>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
            </select>
          </Filter>
          <Filter>
            <label htmlFor="device">Select a smartphone:</label>
            <select id="device" name="device" onChange={e => this.handleChange(e)} value={this.state.device}>
              <option value="">Select a device</option>
              <option value="iphone_8_plus">iPhone 8 plus</option>
              <option value="iphone_xr">iPhone XR</option>
              <option value="iphone_x">iPhone X Black</option>
              <option value="ipad_2_portrait">iPad 2 portrait</option>
              <option value="ipad_3_portrait">iPad 3 portrait</option>
              <option value="pixel_3a_XL">Pixel 3a XL</option>
              <option value="nexus_7">Nexus 7</option>
              <option value="nexus_9">Nexus 9</option>
              <option value="nexus_10">Nexus 10</option>
              <option value="android_10_anonym">Android 10" anonym</option>
            </select>
          </Filter>
        </FiltersContainer>
        <Container>
          {this.displayCanvas()}
          <NewCanva>
            <img src={plus} alt="add a new canva" />
          </NewCanva>
        </Container>

      </Wrapper>
    );
  }
}



export default withRouter(Project);
