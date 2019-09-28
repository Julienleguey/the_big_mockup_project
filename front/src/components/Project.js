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
      userId: "",
      projectId: "",
      name: "",
      os: "",
      device: "",
      canvas: []
    };
  }

  componentWillMount = () => {
    this.getProject();
  }

  getProject = () => {
    const projectId = this.props.location.state.projectId;

    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');

    axios.get(`http://localhost:5000/projects/project/${projectId}`, {
      auth: {
        username: emailAddress,
        password: password
      }}).then( res => {
        console.log(res.data);
        this.setState({
          userId: this.props.location.state.userId,
          projectId: this.props.location.state.projectId,
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

  reloadProject = () => {
    this.getProject();
  }

  displayCanvas = () => {
    const canvas = this.state.canvas.map((canva, index) => {
      canvasDatas[`canva_${index}`] = {};
      return (
        <Canvas
          key={index}
          index={index}
          canva={canva}
          size={DeviceSize[this.state.device]}
          device={this.state.device}
          getCanvasDatas={this.getCanvasDatas}
          userId={this.state.userId}
          deleteCanva={this.deleteCanva}
        />
      )
    });
    return canvas;
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  setFlash = (type, msg) => {
    this.setState({
      flash: true,
      type: type,
      message: msg
    })
  }

  saveWork = () => {
    this.saveProject();
  }

  getCanvasDatas = (infos) => {
    canvasDatas[`canva_${infos.metadatas.index}`] = infos;
    console.log(canvasDatas);
  }

  closeFlash = () => {
    this.setState({
      flash: false
    });
  }

  saveScreenshotTest = () => {
    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');

    const temp = [];

    for (let [key, value] of Object.entries(canvasDatas)) {
      temp.push(value);
    }

    const FormData = require('form-data');
    const data = new FormData();

    temp.forEach( (canva) => {
      data.append('screenshots', canva.screenshot)
    });

    const projbla = {
      name: this.state.name,
      os: this.state.os,
      device: this.state.device
    };

    const metas = {
      userId: this.state.userId,
      projectId: this.state.projectId
    }

    // data.append('project', new Blob([projbla],{type:'application/json'}));
    data.append("project", JSON.stringify(projbla));
    data.append('canvas', JSON.stringify(canvasDatas));
    data.append('metas', JSON.stringify(metas));

    axios.post(`http://localhost:5000/projects/test`, data,
      {
        auth: {
        username: emailAddress,
        password: password
      }},
      {
        headers: {'Content-Type': 'multipart/form-data' }
      }
    ).then( res => {
        this.setState({
          flash: true,
          type: "success",
          message: res.data
        });
        this.reloadProject();
      }).catch( err => {
        console.log(err);
        // this.setState({
        //   flash: true,
        //   type: "error",
        //   message: err.response.data
        // })
      });
  }

  addNewCanva = () => {
    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');

    axios.post(`http://localhost:5000/canvas/new`, {
      projectId: this.state.projectId,
      template: 1
    }, {
      auth: {
        username: emailAddress,
        password: password
      },
    }).then( res => {
      this.setState({
        canvas: this.state.canvas.concat(res.data),
        flash: true,
        type: "success",
        message: "Mockup added!"
      })
    }).catch(err => {
      this.setState({
        flash: true,
        type: "error",
        message: "Something went wrong! Please save your changes and reload the page."
      })
    })

  }


  deleteCanva = (canvaId, screenshotUrl) => {
    const data = {
      userId: this.state.userId,
      projectId: this.state.projectId,
      screenshotUrl: screenshotUrl
    };

    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');

    axios.delete(`http://localhost:5000/canvas/delete/${canvaId}`,
      { params: data,
        auth: {
        username: emailAddress,
        password: password
      }}
    ).then( res => {
        let canvaToDelete = {};
        this.state.canvas.find(canva => {
          if (canva.id === canvaId) {
            console.log(canva);
            canvaToDelete = canva;
          }
        })

        const filteredArray = this.state.canvas.filter(canvaToKeep => canvaToKeep !== canvaToDelete);
        console.log(filteredArray);
        this.setState({
          canvas: filteredArray
        })

        this.setFlash("success", "The mockup was successfully deleted!");
        // this.reloadProject();
        // on ne reload surtout pas ! On le vire du state !
      }).catch( err => {
        console.error(err);
        // this.setState({
        //   flash: true,
        //   type: "error",
        //   message: err.response.data
        // })
      });
  }


  render() {
    return(
      <DoubleWrapper>
        <Flash flash={this.state.flash} type={this.state.type} message={this.state.message} closeFlash={this.closeFlash}/>
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
          {/* <SaveButton onClick={ () => this.saveWork()}>SAVE</SaveButton> */}
          <SaveButton onClick={ () => this.saveScreenshotTest()}>SAVE SCREENSHOTS</SaveButton>
          <Container>
            {this.displayCanvas()}
            <NewCanva onClick={() => this.addNewCanva()}>
              <img src={plus} alt="add a new canva" />
            </NewCanva>
          </Container>

        </Wrapper>
      </DoubleWrapper>
    );
  }
}



export default withRouter(Project);
