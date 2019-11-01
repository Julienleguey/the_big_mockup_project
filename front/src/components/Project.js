import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import Canvas from './Canvas';
import axios from 'axios';
import DeviceSize from '../params/deviceSize.js';
import NeedPremiumModal from './NeedPremiumModal.js';

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

class Project extends Component {

  constructor() {
    super();
    this.state = {
      userId: "",
      projectId: "",
      name: "",
      os: "",
      device: "",
      canvas: []
    };
  }

  componentDidMount = () => {
    this.getProject();
  }

  getProject = () => {
    const projectId = this.props.location.state.projectId;

    if (projectId) {
      const token = localStorage.getItem("token");
      axios.get(`${process.env.REACT_APP_API_ENDPOINT}/projects/project/${projectId}`, {
        headers: { Authorization: `obladi ${token}`}
      }).then( res => {
          const canvas = res.data.Canvas;
          const images = [];
          canvas.forEach( canva => {
            images.push(this.loadSavedScreenshot(canva.screenshotURL));
          })

          Promise.all(images).then( values => {
            canvas.forEach( (canva, index) => {
              canva.screenshot = values[index];
            })
          }).then( () => {
            this.setState({
              userId: this.props.location.state.userId,
              projectId: this.props.location.state.projectId,
              name: res.data.name,
              os: res.data.os,
              device: res.data.device,
              canvas: canvas
            })
          })
        }).catch(err => {
          this.props.context.actions.setFlash("error", "An error occured. Please refresh the page or try to go to the Projects page.");
        });
    }
  }

  loadSavedScreenshot = (screenshotURL) => {
    return new Promise((resolve, reject) => {
      if (screenshotURL !== "") {
        axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}${screenshotURL}`,
          { responseType: 'arraybuffer' },
        )
        .then(response => {
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          );
          const truc = `data:image/png;base64,${base64}`;
          const trucBlob = this.base64ImageToBlob(truc);
          const trucFile = new File([trucBlob], "machin.png");
          resolve(trucFile);
         });
      } else {
        resolve("");
      }
    });
  }

  base64ImageToBlob = (str) => {
    // extract content type and base64 payload from original string
    var pos = str.indexOf(';base64,');
    var type = str.substring(5, pos);
    var b64 = str.substr(pos + 8);

    // decode base64
    var imageContent = atob(b64);

    // create an ArrayBuffer and a view (as unsigned 8-bit)
    var buffer = new ArrayBuffer(imageContent.length);
    var view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for(var n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }

    // convert ArrayBuffer to Blob
    var blob = new Blob([buffer], { type: type });

    return blob;
  }

  reloadProject = () => {
    this.getProject();
  }

  displayCanvas = () => {
    const canvas = this.state.canvas.map((canva, index) => {
      // canvasDatas[`canva_${index}`] = {};
      return (
        <Canvas
          key={index}
          index={index}
          canva={canva}
          size={DeviceSize[this.state.device]}
          device={this.state.device}
          userId={this.state.userId}
          deleteCanva={this.deleteCanva}
          handleChangeCanvas={this.handleChangeCanvas}
        />
      )
    });
    return canvas;
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  handleChangeCanvas = (canvaId, key, value) => {
    this.setState(prevState => ({
      canvas: prevState.canvas.map(
        el => el.id === canvaId? { ...el, [key]: value }: el
      )
    }))
  }

  tryingToSave = () => {
    if (this.props.context.status === "active") {
      this.saveProject();
    } else {
      this.openModal("needPremium");
    }
  }

  openModal = (modalName) => {
    this.setState({
      modal: modalName
    });
  }

  closeModal = () => {
    this.setState({
      modal: ""
    });
  }

  saveProject = () => {
    const canvasDatas = [];
    this.state.canvas.forEach( (canva, index) => {
      const canvaDatasFormatted = {
        metadatas: {
          index: index,
          canvasId: canva.id
        },
        datas: {
          template: canva.template,
          backgroundColor: canva.backgroundColor,
          titleContent: canva.titleContent,
          titleSize: canva.titleSize,
          titleFont: canva.titleFont,
          titleColor: canva.titleColor,
          subtitleContent: canva.subtitleContent,
          subtitleSize: canva.subtitleSize,
          subtitleFont: canva.subtitleFont,
          subtitleColor: canva.subtitleColor,
          screenshotURL: canva.screenshotURL
        },
        screenshot: canva.screenshot
      };
      canvasDatas.push(canvaDatasFormatted);
    });


    const token = localStorage.getItem("token");

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

    data.append("project", JSON.stringify(projbla));
    data.append('canvas', JSON.stringify(canvasDatas));
    data.append('metas', JSON.stringify(metas));

    axios.post(`${process.env.REACT_APP_API_ENDPOINT}/projects/save`, data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `obladi ${token}`
        }
      }
    ).then( res => {
        this.props.context.actions.setFlash("success", res.data);
        this.reloadProject();
      }).catch( err => {
        console.log(err);
        this.props.context.actions.setFlash("error", "An error occured while saving the project. Please try again.");
      });
  }

  addNewCanva = () => {
    const token = localStorage.getItem("token");

    axios.post(`${process.env.REACT_APP_API_ENDPOINT}/canvas/new`, {
      projectId: this.state.projectId,
      template: 1
    }, {
      headers: { Authorization: `obladi ${token}`}
    }).then( res => {
      this.setState({
        canvas: this.state.canvas.concat(res.data)
      });
      this.props.context.actions.setFlash("success", "Mockup added");
    }).catch(err => {
      this.props.context.actions.setFlash("error", "Something went wrong! Please save your changes and reload the page.");
    })

  }

  deleteCanva = (canvaId, screenshotUrl) => {
    const data = {
      userId: this.state.userId,
      projectId: this.state.projectId,
      screenshotUrl: screenshotUrl
    };

    const token = localStorage.getItem("token");

    axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/canvas/delete/${canvaId}`, {
        params: data,
        headers: { Authorization: `obladi ${token}`}
      }).then( res => {
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

        this.props.context.actions.setFlash("success", "The mockup was successfully deleted!");
      }).catch( err => {
        console.error(err);
      });
  }


  render() {
    return(
      <DoubleWrapper>
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
          {/* <SaveButton onClick={ () => this.saveProject()}>SAVE</SaveButton> */}
          <SaveButton onClick={this.tryingToSave}>SAVE</SaveButton>
          <Container>
            {this.displayCanvas()}
            <NewCanva onClick={() => this.addNewCanva()}>
              <img src={plus} alt="add a new canva" />
            </NewCanva>
          </Container>

        </Wrapper>
        <NeedPremiumModal
          isOpen={this.state.modal === "needPremium" ? true : false}
          closeModal={this.closeModal}
          setFlash={this.props.context.actions.setFlash}
          projectId={this.state.projectId}
        />
      </DoubleWrapper>
    );
  }
}



export default withRouter(Project);
