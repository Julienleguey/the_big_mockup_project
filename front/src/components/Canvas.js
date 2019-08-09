import React, { Component } from 'react';
import styled from 'styled-components';

import CanvasSizes from '../params/canvasSizes.js';
import DeviceSize from '../params/deviceSize.js';
import TextSizes from '../params/textSizes.js';
import Templates from '../params/templates.js';

import Mockup from '../mockups/iphone_xr.png';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 20px;
  border: 1px solid black;
`;

const CanvaContainer = styled.div`
  border: 1px solid red;

  canvas {
    /*  dimension of the canvas to display are canvas' dimension / 4 */
    &.iphone55 {
      width: 310px;
      height: 552px;
    }

    &.iphone65 {
      width: 310px;
      height: 672px;
    }

    &.android6 {
      width: 325px;
      height: 635px;
    }

    &.ipad_portrait {
      width: 512px;
      height: 683px;
    }

    &.nexus_7 {
      width: 375px;
      height: 587px;
    }

    &.nexus_9 {
      width: 500px;
      height: 725px;
    }

    &.nexus_10 {
      width: 550px;
      height: 785px;
    }

    &.android_10_anonym {
      width: 550px;
      height: 818px;
    }
  }
`;


const Settings = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextArea = styled.textarea`
  resize: vertical;
`;

const DlContainer = styled.a`
  display: flex;
  margin: 20px 0;
  justify-content: center;

  button {
    height: 70px;
    width: 200px;
    border: 2px solid red;
    border-radius: 2%;
  }
`;

const colorsList = ["#000000", "#c0c0c0", "#808080", "#ffffff", "#800000", "#ff0000", "#800080", "#ff00ff", "#008000", "#00ff00", "#808000", "#ffff00", "#000080", "#0000ff", "#008080", "#00ffff"]
const fontsList = ["Arial", "Arial Black", "Courier", "Garamond", "Georgia", "Helvetica", "Impact", "Tahoma", "Times", "Trebuchet MS", "Verdana"];

let device = "";
let number = "";

let canvaWidth = 0;
let canvaHeight = 0;
let marginSides = 0;
let maxWidth = 0;

let deviceWidth = 0;
let deviceHeight = 0;
let deviceWidthStart = 0;
let deviceHeightStart = 0;
let deviceWidthEnd = 0;
let deviceHeightEnd = 0;

let screenshotWidthStart = 0;
let screenshotHeightStart = 0;
let screenshotWidthEnd = 0;
let screenshotHeightEnd = 0;

let textStart = 0;
let titleStart = 0;
let subtitleStart = 0;
let titleSplited = [];
let subtitleSplited = [];
let countTitleLines = 0;
let countSubtitleLines = 0;
let titleSize = 0;
let titleToTitle = 0;
let subtitleSize = 0;
let subtitleToSubtitle = 0;
let spacingToDevice = 0;
let spacingToText = 0;
let spaceFilledByTitle = 0;
let spaceFilledBySubtitle = 0;

class Canvas extends Component {

  constructor() {
    super();
    this.state = {
      device: "",
      template: "",
      number: "",
      newScreenshot: false,
      screenshotPresent: false,
      screenshot: "",
      backgroundColor: "",
      titleContent: "",
      titleSize: "",
      titleColor: "",
      titleFont: "",
      subtitleContent: "",
      subtitleSize: "",
      subtitleColor: "",
      subtitleFont: ""
    };
  }

  componentWillMount = () => {
    // ici, il faudra faire un if pour soit prendre les valeurs en db, soit des valeurs par défaut
    this.setState({
      device: this.props.device,
      template: "1",
      number: this.props.index + 1,
      backgroundColor: "#0f63c2",
      titleSize: "medium",
      subtitleSize: "medium",
      titleColor: "#ffffff",
      subtitleColor: "#ffffff",
    });
  }

  componentDidMount = () => {

    const screenshot = new Image();

    this.createCanvas();

    // ici, il faudra faire un if pour soit prendre les valeurs en db, soit des valeurs par défaut
    this.setState({
      screenshot: screenshot
    });

  }

  componentDidUpdate = () => {
    this.createCanvas();
  }

  // componentWillUpdate = () => {
  //   console.log("it's gonna update");
  // }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value});
  }

  getCanvaSize = () => {
    canvaWidth = CanvasSizes[DeviceSize[this.props.device].canva].width;
    canvaHeight = CanvasSizes[DeviceSize[this.props.device].canva].height;

    marginSides = 50;
    maxWidth = canvaWidth - marginSides * 2;

    deviceWidth = DeviceSize[this.props.device].width;
    deviceHeight = DeviceSize[this.props.device].height;

    deviceHeightStart = 0;

    if (Templates[this.state.template].device) {
      screenshotWidthStart = DeviceSize[this.props.device].widthStart;
      screenshotHeightStart = DeviceSize[this.props.device].heightStart;
      screenshotWidthEnd = DeviceSize[this.props.device].widthEnd;
      screenshotHeightEnd = DeviceSize[this.props.device].heightEnd;
    } else {
      console.log(deviceWidthStart, deviceHeightStart);
      // il faut le faire commencer et finir là où le device commencerait et finirait (mais pas complètement, parce qu'ils ne sont pas au même format)
      screenshotWidthStart = marginSides;
      screenshotHeightStart = 0;
      screenshotWidthEnd = maxWidth;
      screenshotHeightEnd = ( maxWidth * DeviceSize[this.props.device].heightEnd ) / DeviceSize[this.props.device].widthEnd;
    }

    device = this.props.device;
    number = this.props.index + 1;
  }

  destroyPrevCanvas = () => {
    const canvasToDestroy = document.querySelector(`#canva-container-${this.props.index}`);
    canvasToDestroy.innerHTML = "";
  }

  createEmptyCanvas = () => {
    // selecting the canvas parent
    const parentCanvas = document.querySelector(`#canva-container-${this.props.index}`);

    // creating a canvas
    const childCanvas = document.createElement('canvas');

    // childCanvas.classList.add(DeviceSize[this.props.device]);
    childCanvas.id = `canva-${this.props.index}`;
    childCanvas.classList.add(DeviceSize[this.props.device].canva);
    childCanvas.width = canvaWidth;
    childCanvas.height = canvaHeight;

    // appending the canva to the parent
    parentCanvas.appendChild(childCanvas);
  }

  uploadScreenshot = (e) => {
    // e.preventDefault();
    const reader = new FileReader();
    reader.onload = (event) => {
      const screenshot = this.state.screenshot;
      screenshot.src = event.target.result;
      this.setState({
        screenshot: screenshot
      })
    }
    reader.readAsDataURL(e.target.files[0]);

    this.setState({
      newScreenshot: true,
      screenshotPresent: true
    })
  }

  downloadIt = (index) => {
    console.log("fiiiiiire");
    console.log(index);

    const download = document.querySelector(`#a-${index}`);
    const image = document.querySelector(`#canva-${index}`).toDataURL('image/jpeg', 0.7).replace("image/jpg", "image/octet-stream");
    download.setAttribute("href", image);

    console.log("the end");
  }

  addCanvasBackground = (ctx) => {
    // creating the background
    ctx.fillStyle = this.state.backgroundColor;
    ctx.fillRect(0, 0, canvaWidth, canvaHeight);
  }

  getTextDatas = () => {
    countTitleLines = titleSplited.length;
    countSubtitleLines = subtitleSplited.length;
    titleSize = TextSizes[this.state.titleSize].titleSize;
    titleToTitle = TextSizes[this.state.titleSize].titleToTitle;
    subtitleSize = TextSizes[this.state.subtitleSize].subtitleSize;
    subtitleToSubtitle = TextSizes[this.state.titleSize].subtitleToSubtitle;
    let titleToSubtitleNeeded = 1;

    if (countTitleLines === 0 || countSubtitleLines === 0 ) {
      titleToSubtitleNeeded = 0;
    }

    if (countTitleLines === 0) {
      spaceFilledByTitle = 0;
    } else {
      spaceFilledByTitle = titleSize * countTitleLines + (titleToTitle - titleSize) * (countTitleLines-1) + TextSizes[this.state.titleSize].titleToSubtitle * titleToSubtitleNeeded;
    }

    if (countSubtitleLines === 0) {
      spaceFilledBySubtitle = 0;
    } else {
      spaceFilledBySubtitle = subtitleSize * countSubtitleLines + (subtitleToSubtitle - subtitleSize) * (countSubtitleLines-1);
    }


    if (countTitleLines === 0 && countSubtitleLines === 0) {
      spacingToDevice = 0;
      spacingToText = 0;
    } else {
      if (Templates[this.state.template].caption === "above") {
        if (countSubtitleLines > 0) {
          spacingToDevice = TextSizes[this.state.subtitleSize].subtitleToDevice;
        } else {
          spacingToDevice = TextSizes[this.state.titleSize].titleToDevice;
        }
      } else if (Templates[this.state.template].caption === "below") {
        if (countTitleLines > 0) {
          spacingToText = TextSizes[this.state.subtitleSize].deviceToTitle
        } else {
          spacingToText = TextSizes[this.state.subtitleSize].deviceToSubtitle
        }
      }
    }


    if (countSubtitleLines > 0) {
      spacingToDevice = TextSizes[this.state.subtitleSize].subtitleToDevice;
      spacingToText = TextSizes[this.state.subtitleSize].deviceToTitle
    } else {
      spacingToDevice = TextSizes[this.state.titleSize].titleToDevice;
      spacingToText = TextSizes[this.state.subtitleSize].deviceToSubtitle
    }
  }

  getTextStart = () => {
    // les start top et start bottom sont inutiles
    // il faut un marginTopBottom fixe
    // on fait commencer en haut de marginTopBottom + size de la première ligne (title ou subtitle)
    // on fait commencer en bas de marginTopBottom
    // on pourrait même calculer le marginTopBottom en fonction de la différence entre canva et device (mais ça marche que si le device est plus petit que le canva)
    // mais c'est exactement ce qu'il faut faire
    // mais du coup, il vaut mieux avoir des mockups qui collent au bord
    // ensuite, on recalcule la disposition du device en fonction de sa taille, de la taille du canva et de la marge que l'on veut
    // si on veut mettre du texte, on calcule une width pour device en fonction des marges sur le côté que l'on veut, puis on en déduit la height et une partie du device est cachée
    // si on veut centrer le device, sans texte, on calcule width minimum et height minimum en fonction des marges, on déduit l'une de l'autre et on garde le plus petit pour pas que ça dépasse
    // pour commencer, il me faut des mockups mieux faits
    // faire les mockups des 2 iphones et d'un ipad pour continuer à développer, on refera les mockups en entier plus tard

    if (Templates[this.state.template].caption === "above") {
      textStart = TextSizes.startTop;
    } else if (Templates[this.state.template].caption === "below") {
      textStart = CanvasSizes[DeviceSize[this.props.device].canva].height - TextSizes.startBottom - spaceFilledByTitle - spaceFilledBySubtitle;
    }
  }

  getTitleStart = () => {
    titleStart = textStart;
  }

  getSubtitleStart = () => {
    if (countTitleLines === 0) {
      subtitleStart = textStart;
    } else {
      subtitleStart = titleStart + spaceFilledByTitle;
    }
  }

  getDeviceStart = () => {

    if (Templates[this.state.template].caption === "above") {
      const spaceFilledByText = titleStart + spaceFilledByTitle + spaceFilledBySubtitle + spacingToDevice;
      deviceHeightStart += spaceFilledByText;
      screenshotHeightStart += spaceFilledByText;
    } else if (Templates[this.state.template].caption === "below") {
      const deviceToBottom = spacingToText + (deviceHeight - textStart);
      console.log(spacingToText);
      deviceHeightStart -= deviceToBottom;
      screenshotHeightStart -= deviceToBottom;
    }

  }

  writeText = (ctx, startHeight, fontColor, font, fontSize, content, lineToLine) => {
    ctx.fillStyle = fontColor;
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';

    let heightToDrawText = startHeight;

    for (let i = 0; i < content.length; i++) {
      const gap = ctx.measureText(" ").width;

      ctx.fillText(content[i], (canvaWidth + gap)/2, heightToDrawText, maxWidth);
      // ajout d'un interligne line/line
      heightToDrawText += lineToLine;
    }
  }

  splittingContent = (ctx, content, fontSize) => {
    ctx.fillStyle = 'white';
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';

    const arr = content.split("\n");
    const newArr = [];

    for (let i = 0; i < arr.length; i++) {
      const words = arr[i].split(" ");
      if (words[words.length-1] === "") {
        words.pop();
      }
      let lineOk = "";
      let lineTest = "";

      for (let j = 0; j < words.length; j++) {

        lineTest += `${words[j]} `;
        if (ctx.measureText(lineTest).width < maxWidth) {
          lineOk = lineTest;
        } else {
          newArr.push(lineOk);
          lineOk = "";
          lineTest = `${words[j]} `;
        }

        if (j == words.length - 1) {
          newArr.push(lineTest);
        }
      }
    }
    return newArr;
  }

  addCanvasScreenshot = (ctx) => {
    // if it's a new screenshot, we wait for onload
    // otherwise, we don't have to wait
    if (this.state.newScreenshot) {
      const screenshot = this.state.screenshot;
      screenshot.onload = () => {
        console.log(screenshotHeightStart);
        ctx.drawImage(screenshot, screenshotWidthStart, screenshotHeightStart, screenshotWidthEnd, screenshotHeightEnd);
        this.addCanvasDevice(ctx);
        if (this.state.newScreenshot) {
          this.setState({
            newScreenshot: false
          })
        }
      }
    } else {
      ctx.drawImage(this.state.screenshot, screenshotWidthStart, screenshotHeightStart, screenshotWidthEnd, screenshotHeightEnd);
      this.addCanvasDevice(ctx);
    }
  }

  addCanvasDevice = (ctx) => {
    if (Templates[this.state.template].device) {
      const device = new Image();
      device.src = require(`../mockups/${this.props.device}.png`);
      device.onload = () => {
        ctx.drawImage(device, deviceWidthStart, deviceHeightStart, deviceWidth, deviceHeight);
      }
    }
  }

  createCanvas = () => {
    // destroying and creating the empty canva, must be first and in this order
    this.getCanvaSize();
    this.destroyPrevCanvas();
    this.createEmptyCanvas();
    const ctx = document.querySelector(`#canva-${this.props.index}`).getContext('2d');

    // calculating how to split the title and the subtitle
    titleSplited = this.splittingContent(ctx, this.state.titleContent, TextSizes[this.state.titleSize].titleSize);
    subtitleSplited = this.splittingContent(ctx, this.state.subtitleContent, TextSizes[this.state.subtitleSize].subtitleSize);

    // getting meta-datas
    this.getTextDatas();
    if (Templates[this.state.template].caption !== "none") {
      this.getTextStart();
      this.getTitleStart();
      this.getSubtitleStart();
    }
    this.getDeviceStart();

    // drawing the backgroung
    this.addCanvasBackground(ctx);

    // drawing the text
    this.writeText(ctx, titleStart, this.state.titleColor, this.state.titleFont, TextSizes[this.state.titleSize].titleSize, titleSplited, TextSizes[this.state.titleSize].titleToTitle);
    this.writeText(ctx, subtitleStart, this.state.subtitleColor, this.state.subtitleFont, TextSizes[this.state.subtitleSize].subtitleSize, subtitleSplited, TextSizes[this.state.subtitleSize].subtitleToSubtitle);

    // if we have a screenshot, addCanvasDevice() is played inside the method drawing the screenshot (after that the screenshot is draw)
    // otherwise it's played here
    if (this.state.screenshotPresent == true) {
      this.addCanvasScreenshot(ctx);
    } else {
      this.addCanvasDevice(ctx);
    }
  }


  displayColors = () => {
    const colors = colorsList.map( (color, index) => (
      <option value={color} key={index} style={{backgroundColor: color}}></option>
    ));
    return colors;
  }

  displayFonts = () => {
    const fonts = fontsList.map( (font, index) => (
      <option value={font} key={index}>{font}</option>
    ));
    return fonts;
  }

  displayTemplates = () => {
    const templates = Templates.map((template, index) => (
      <option key={index} value={template.index}>{template.name}</option>
    ));
    return templates
  }



  render() {
    return(
      <Wrapper>
        <CanvaContainer id={`canva-container-${this.props.index}`} />
        <Settings>
          <p>settings ici</p>

          <label htmlFor={`template-${this.props.index}`}>Template:</label>
          <select id={`template-${this.props.index}`} name="template" onChange={e => this.handleChange(e)} value={this.state.template} >
            {this.displayTemplates()}
          </select>

          <label htmlFor="screenshot">Choose a screenshot:</label>
          <input type="file"
                 id="screenshot" name="screenshot"
                 accept="image/png, image/jpeg"
                 onChange={(e) => this.uploadScreenshot(e)}
                 />

          <label htmlFor={`background-color-${this.props.index}`}>Background Color:</label>
          <input
           id={`background-color-${this.props.index}`}
           name="backgroundColor"
           placeholder="Color"
           value={this.state.backgroundColor}
           onChange={e => this.handleChange(e)}
          />

          <label htmlFor={`background-color-dropdown-${this.props.index}`}>Background Color Picker:</label>
          <select id={`background-color-dropdown-${this.props.index}`} name="backgroundColor" onChange={e => this.handleChange(e)} value={this.state.backgroundColor} style={{backgroundColor: this.state.backgroundColor}} >
           {this.displayColors()}
          </select>

          <label htmlFor={`title-content-${this.props.index}`}>Title:</label>
          <TextArea
            id={`title-content-${this.props.index}`}
            name="titleContent"
            placeholder="Type your title here"
            onChange={e => this.handleChange(e)}
          />

          <label htmlFor={`title-size-${this.props.index}`}>Title Size:</label>
          <select id={`title-size-${this.props.index}`} name="titleSize" onChange={e => this.handleChange(e)} value={this.state.titleSize} >
            <option value="small">small</option>
            <option value="medium" default>medium</option>
            <option value="large">large</option>
          </select>

          <label htmlFor={`title-color-text-${this.props.index}`}>Title Color:</label>
          <input
            type="text"
            id={`title-color-text-${this.props.index}`}
            name="titleColor"
            placeholder="Color"
            value={this.state.titleColor}
            onChange={e => this.handleChange(e)}
          />

          <label htmlFor={`title-color-dropdown-${this.props.index}`}>Title Color Picker:</label>
          <select id={`title-color-dropdown-${this.props.index}`} name="titleColor" onChange={e => this.handleChange(e)} value={this.state.titleColor} style={{backgroundColor: this.state.titleColor}} >
            {this.displayColors()}
          </select>

          <label htmlFor={`title-font-dropdown-${this.props.index}`}>Title Font:</label>
          <select id={`title-font-dropdown-${this.props.index}`} name="titleFont" onChange={e => this.handleChange(e)} value={this.state.titleFont}>
            {this.displayFonts()}
          </select>

          <label htmlFor={`subtitle-content-${this.props.index}`}>Subtitle:</label>
          <TextArea
            id={`subtitle-content-${this.props.index}`}
            name="subtitleContent"
            placeholder="Type your subtitle here"
            onChange={e => this.handleChange(e)}
          />

          <label htmlFor={`subtitle-size-${this.props.index}`}>Subtitle Size:</label>
          <select id={`subtitle-size-${this.props.index}`} name="subtitleSize" onChange={e => this.handleChange(e)} value={this.state.subtitleSize} >
            <option value="small">small</option>
            <option value="medium" default>medium</option>
            <option value="large">large</option>
          </select>

          <label htmlFor={`subtitle-color-${this.props.index}`}>Subtitle Color:</label>
          <input
            id={`subtitle-color-${this.props.index}`}
            name="subtitleColor"
            placeholder="Color"
            value={this.state.subtitleColor}
            onChange={e => this.handleChange(e)}
          />

          <label htmlFor={`subtitle-color-dropdown-${this.props.index}`}>Subtitle Color Picker:</label>
          <select id={`subtitle-color-dropdown-${this.props.index}`} name="subtitleColor" onChange={e => this.handleChange(e)} value={this.state.subtitleColor} style={{backgroundColor: this.state.subtitleColor}} >
            {this.displayColors()}
          </select>

          <label htmlFor={`subtitle-font-dropdown-${this.props.index}`}>Subtitle Font:</label>
          <select id={`subtitle-font-dropdown-${this.props.index}`} name="subtitleFont" onChange={e => this.handleChange(e)} value={this.state.subtitleFont}>
            {this.displayFonts()}
          </select>

        </Settings>
        <DlContainer id={`a-${this.props.index}`} className="button" download={`${this.props.device}_${this.props.index + 1}.jpg`} onClick={ () => {this.downloadIt(this.props.index)} }>
          <button className="dl-button">Download</button>
        </DlContainer>
      </Wrapper>
    );
  }
}



export default Canvas;
