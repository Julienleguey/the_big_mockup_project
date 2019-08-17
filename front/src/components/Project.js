import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Canvas from './Canvas';
import Flash from './Flash';
import axios from 'axios';
import DeviceSize from '../params/deviceSize.js';

// import images
import plus from '../images/add.svg';

const DoubleWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

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

const SaveButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 200px;
  background-color: grey;
  border: solid 1px black;
  color: white;
  font-size: 40px;
  margin: 0 auto;

  &:hover {
    cursor: pointer;
  }
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


const canvasDatas = {};

class Project extends Component {

  constructor() {
    super();
    this.state = {
      flash: false,
      type: "standard",
      message: "",
      name: "",
      os: "",
      device: "",
      canvas: []
    };
  }

  componentWillMount = () => {
    console.log(canvasDatas);
    const projectId = this.props.match.params.id;

    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');

    axios.get(`http://localhost:5000/projects/project/${projectId}`, {
      auth: {
        username: emailAddress,
        password: password
      }}).then( res => {
        console.log(res.data);
        this.setState({
          id: res.data.id,
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
    const canvas = this.state.canvas.map((canva, index) => {
      canvasDatas[`canva_${index}`] = {};
      return (
        <Canvas key={index} index={index} canva={canva} size={DeviceSize[this.state.device]} device={this.state.device} getCanvasDatas={this.getCanvasDatas}/>
      )
    });
    return canvas;
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  saveWork = () => {
    this.saveProject();
  }

  getCanvasDatas = (infos) => {
    canvasDatas[`canva_${infos.metadatas.index}`] = infos;
  }

  closeFlash = () => {
    this.setState({
      flash: false
    });
  }

  saveProject = () => {
    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');

    axios.put(`http://localhost:5000/projects/project/${this.state.id}`, {
      project: {
        name: this.state.name,
        os: this.state.os,
        device: this.state.device
      },
      canvas: canvasDatas
    }, {
      auth: {
        username: emailAddress,
        password: password
      }}).then( res => {
        console.log(res);
        this.setState({
          flash: true,
          type: "success",
          message: res.data
        })
      }).catch( err => {
        console.log(err.response);
        this.setState({
          flash: true,
          type: "error",
          message: err.response.data
        })
      });
  }

  render() {
    return(
      <DoubleWrapper>
        <Flash flash={this.state.flash} type={this.state.type} message={this.state.message}  closeFlash={this.closeFlash}/>
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
          <SaveButton onClick={ () => this.saveWork()}>SAVE</SaveButton>
          <Container>
            {this.displayCanvas()}
            <NewCanva>
              <img src={plus} alt="add a new canva" />
            </NewCanva>
          </Container>

        </Wrapper>
      </DoubleWrapper>
    );
  }
}



export default withRouter(Project);
