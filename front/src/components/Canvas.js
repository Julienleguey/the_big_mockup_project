import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

const DeleteButton = styled.div`
  display: flex;
  width: 50%;
  height: 30px;
  margin: 0 auto;
  border: 1px solid red;

  &:hover {
    cursor: pointer;
  }
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
const rLMarginRate = 0.05;
const tBMarginRate = 0.05;
const resizeNoDevice = 0.8;
let rotRadians = 0;

let device = "";
let caption = "";
let isRotate = "";
let isDevice = false;
let isFull = false;

let canvaWidth = 0;
let canvaHeight = 0;

let rLMargin = 0;
let tBMargin = 0;
let sideMargin = 0;
let maxWidthText = 0;

let maxWidth = 0;
let maxHeight = 0;

let deviceWidthStart = 0;
let deviceHeightStart = 0;
let deviceWidth = 0;
let deviceHeight = 0;
let allDevices = {};

let resizeWithDevice = 0;

let screenshotWidthStart = 0;
let screenshotHeightStart = 0;
let screenshotWidth = 0;
let screenshotHeight = 0;

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
let paddingTop = 0;
let spaceFilledByTitle = 0;
let spaceFilledBySubtitle = 0;
let spaceFilledByText = 0;

let isText = false;
let elementHeight = 0;
let elementWidth = 0;
let intermediaryMargin = 0;
let spaceFilledNone = 0;
let spaceFilledAbove = 0;
let spaceFilledBelow = 0;

let diffHeight = 0;
let diffHeightTop = 0;
let diffWidthRight = 0;
let diffWidthLeft = 0;

let translateX = 0;
let translateY = 0;

class Canvas extends Component {

  constructor() {
    super();
    this.state = {
      isDevice: false,
      deviceWidthStart: 0,
      deviceHeightStart: 0,
      deviceWidth: 0,
      deviceHeight: 0,
      screenshotWidthStart: 0,
      screenshotHeightStart: 0,
      screenshotWidth: 0,
      screenshotHeight: 0
    };
  }

/****************
lifecycle events
****************/

  componentDidMount = () => {
    this.createCanvas();
  }

  componentDidUpdate = (prevProps) => {
    // if (prevProps.canva !== this.props.canva) {
      this.createCanvas();
    // }
  }

  addDeviceCoordinatesToState = () => {
    if (this.state.isDevice !== isDevice ||
        this.state.deviceWidthStart !== deviceWidthStart ||
        this.state.deviceHeightStart !== deviceHeightStart ||
        this.state.deviceWidth !== allDevices[`datas${this.props.index}`].deviceWidth ||
        this.state.deviceHeight !== allDevices[`datas${this.props.index}`].deviceHeight) {
      this.setState({
        isDevice: isDevice,
        deviceWidthStart: deviceWidthStart,
        deviceHeightStart: deviceHeightStart,
        deviceWidth: deviceWidth,
        deviceHeight: deviceHeight
      })
    }
  }

  addScreenshotCoordinatesToState = () => {
    if (this.state.screenshotWidthStart !== screenshotWidthStart ||
        this.state.screenshotHeightStart !== screenshotHeightStart ||
        this.state.screenshotWidth !== screenshotWidth ||
        this.state.screenshotHeight !== screenshotHeight) {
      this.setState({
        screenshotWidthStart: screenshotWidthStart,
        screenshotHeightStart: screenshotHeightStart,
        screenshotWidth: screenshotWidth,
        screenshotHeight: screenshotHeight
      });
    }
  }


/*****************************
methods to calculate the text
*****************************/

splittingContent = (ctx, content, fontSize) => {
  // ctx.fillStyle = 'white';
  ctx.font = `${fontSize}px Arial`;
  // ctx.textAlign = 'center';

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
      if (ctx.measureText(lineTest).width < maxWidthText) {
        lineOk = lineTest;
      } else {
        newArr.push(lineOk);
        lineOk = "";
        lineTest = `${words[j]} `;
      }

      if (j === words.length - 1) {
        newArr.push(lineTest);
      }
    }
  }
  return newArr;
}

/*******************************
methods to calculate meta-datas
*******************************/
  // 1. définir le contexte : device, caption, rotate
  getContext = () => {
    device = this.props.device;
    caption = Templates[this.props.canva.template].caption;
    isDevice = Templates[this.props.canva.template].device;
    isRotate = Templates[this.props.canva.template].rotate;
    rotRadians = (Math.PI / 180) * Templates[this.props.canva.template].rotation;
    isFull = Templates[this.props.canva.template].full;
    deviceWidth = DeviceSize[device].width;
    deviceHeight = DeviceSize[device].height;

    allDevices[`datas${this.props.index}`]= {
      deviceWidth: 0,
      deviceHeight: 0
    };
  }

  // 2. calculer la taille du nouveau canva
  getCanvaDatas = () => {
    canvaWidth = CanvasSizes[DeviceSize[device].canva].width;
    canvaHeight = CanvasSizes[DeviceSize[device].canva].height;
  }

  // 3. définir la taille des marges rL et tB et les max width & height
  getMargins = () => {
    rLMargin = canvaWidth * rLMarginRate;
    tBMargin = canvaHeight * tBMarginRate;
    maxWidthText = canvaWidth - rLMargin * 2;
  }

  // 4. définir le texte (splitting content etc)
  defineText = (ctx) => {
    titleSplited = this.splittingContent(ctx, this.props.canva.titleContent, TextSizes[this.props.canva.titleSize].titleSize);
    subtitleSplited = this.splittingContent(ctx, this.props.canva.subtitleContent, TextSizes[this.props.canva.subtitleSize].subtitleSize);
  }

  // 5. calculer la hauteur occupée par le texte
  // une petite refactorisation ici ? Ou des commentaires au moins ?
  getTextDatas = () => {
    countTitleLines = titleSplited.length;
    countSubtitleLines = subtitleSplited.length;
    titleSize = TextSizes[this.props.canva.titleSize].titleSize;
    titleToTitle = TextSizes[this.props.canva.titleSize].titleToTitle;
    subtitleSize = TextSizes[this.props.canva.subtitleSize].subtitleSize;
    subtitleToSubtitle = TextSizes[this.props.canva.titleSize].subtitleToSubtitle;
    let titleToSubtitleNeeded = 1;

    if (countTitleLines === 0 || countSubtitleLines === 0 ) {
      titleToSubtitleNeeded = 0;
    }

    if (countTitleLines === 0) {
      spaceFilledByTitle = 0;
    } else {
      spaceFilledByTitle = titleSize * countTitleLines + titleToTitle * (countTitleLines-1) + TextSizes[this.props.canva.titleSize].titleToSubtitle * titleToSubtitleNeeded;
    }

    if (countSubtitleLines === 0) {
      spaceFilledBySubtitle = 0;
    } else {
      spaceFilledBySubtitle = subtitleSize * countSubtitleLines + subtitleToSubtitle * (countSubtitleLines-1);
    }

    if (countTitleLines > 0) {
      paddingTop = TextSizes[this.props.canva.titleSize].paddingTop;
      spaceFilledByTitle -= paddingTop;
    } else if (countSubtitleLines > 0 ) {
      paddingTop = TextSizes[this.props.canva.subtitleSize].paddingTop;
      spaceFilledBySubtitle -= paddingTop;
    }

    if (countTitleLines === 0 && countSubtitleLines === 0) {
      spacingToDevice = 0;
      spacingToText = 0;
    } else {
      if (caption === "above") {
        if (countSubtitleLines > 0) {
          spacingToDevice = TextSizes[this.props.canva.subtitleSize].subtitleToDevice;
        } else {
          spacingToDevice = TextSizes[this.props.canva.titleSize].titleToDevice;
        }
      } else if (caption === "below") {
        if (countTitleLines > 0) {
          spacingToText = TextSizes[this.props.canva.subtitleSize].deviceToTitle
        } else {
          spacingToText = TextSizes[this.props.canva.subtitleSize].deviceToSubtitle
        }
      }
    }
  }

  getTextSize = () => {
    spaceFilledByText = tBMargin + spaceFilledByTitle + spaceFilledBySubtitle;
  }

  // 6. now we can define the max height
  getMaxDimensions = () => {
    diffWidthRight = 0;
    diffWidthLeft = 0;
    diffHeight = 0;

    if (isRotate) {
      diffWidthRight = Math.abs(deviceWidth - (Math.abs(Math.sin(rotRadians) * deviceWidth) / Math.abs(Math.tan(rotRadians))));
      diffWidthLeft = Math.abs(Math.sin(rotRadians) * deviceHeight);
      diffHeight = Math.abs(Math.sin(rotRadians) * deviceWidth);
    }

    if (isFull) {
      if (isRotate) {
        // différentes possibilités de maxwidth et il y en a d'autres
        // maxWidth = canvaWidth - diffWidthRight - diffWidthLeft;
        // maxWidth = canvaWidth - diffWidthLeft/2 - diffWidthRight;
        // maxWidth = canvaWidth;
        // maxWidth = canvaWidth - rLMargin * 2;
        maxWidth = canvaWidth - rLMargin;
      } else {
        maxWidth = canvaWidth - rLMargin * 2;
      }
      maxHeight = canvaHeight - spaceFilledByText - spacingToDevice - tBMargin;
    } else {
      maxWidth = canvaWidth - rLMargin * 2;
      maxHeight = canvaHeight - tBMargin * 2;
    }

  }

  // 7. redimensionner le device s'il y en a un
  redoDeviceForCanvas = () => {
    const tempWidth = maxWidth;
    const tempHeight = tempWidth * DeviceSize[device].height / DeviceSize[device].width;

    // from height
    const tempHeight2 = maxHeight;
    const tempWidth2 = tempHeight2 * DeviceSize[device].width / DeviceSize[device].height;

    if (tempWidth <= tempWidth2) {
      deviceWidth = tempWidth;
      deviceHeight = tempHeight;
    } else {
      deviceWidth = tempWidth2;
      deviceHeight = tempHeight2;
    }

    allDevices[`datas${this.props.index}`].deviceWidth = deviceWidth;
    allDevices[`datas${this.props.index}`].deviceHeight = deviceHeight;

    resizeWithDevice = deviceWidth / DeviceSize[device].width;

    this.addDeviceCoordinatesToState();
  }

  // 8. redimensionner le screenshot (calcul selon le device ou selon le canvas s'il n'y a pas de device)
  redoScreenshotForCanvas = () => {
    if (isDevice) {
      screenshotWidthStart = DeviceSize[device].ssWidthStart * resizeWithDevice;
      screenshotHeightStart = DeviceSize[device].ssHeightStart * resizeWithDevice;
      screenshotWidth = DeviceSize[device].ssWidth * resizeWithDevice;
      screenshotHeight = DeviceSize[device].ssHeight * resizeWithDevice;
    } else {
      screenshotWidthStart = 0;
      screenshotHeightStart = 0;
      screenshotWidth = canvaWidth * resizeNoDevice;
      screenshotHeight = DeviceSize[device].ssHeight * screenshotWidth / DeviceSize[device].ssWidth;
    }

    this.addScreenshotCoordinatesToState();
  }

  // 9. définir la taille des marges rL et tB
  getElementSize = () => {
    if (isDevice) {
      if (isRotate) {
        elementWidth = deviceWidth + diffWidthRight;
        elementHeight = Math.abs(Math.sin(rotRadians) * deviceWidth) + Math.abs(Math.cos(rotRadians) * deviceHeight);
      } else {
        elementWidth = deviceWidth;
        elementHeight = deviceHeight;
      }
    } else {
      elementWidth = screenshotWidth;
      elementHeight = screenshotHeight;
    }

    sideMargin = Math.max(rLMargin, (canvaWidth - elementWidth) / 2);
  }

  // 10. calculer la hauteur à laquelle écrire title et subtitle
  getTextStart = () => {
    let firstLineHeight = 0;
    if (countTitleLines > 0) {
      firstLineHeight += (TextSizes[this.props.canva.titleSize].titleSize - paddingTop);
    } else if (countSubtitleLines > 0) {
      firstLineHeight += (TextSizes[this.props.canva.subtitleSize].subtitleSize - paddingTop);
    }

    if (caption === "above") {
      textStart = tBMargin + firstLineHeight;
    } else if (caption === "below") {
      textStart = CanvasSizes[DeviceSize[device].canva].height - spaceFilledByTitle - spaceFilledBySubtitle - tBMargin + firstLineHeight;
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

  // 11. calculer la hauteur occupée par intermediaryMargin
  getIntermediaryMargin = () => {
    if ( (countTitleLines === 0 && countSubtitleLines === 0) || caption === "none") {
      isText = false;
    } else {
      isText = true;
    }

    if (!isText) {
      intermediaryMargin = (canvaHeight - elementHeight) / 2;
    } else {
      let marginLeft = 0;

      if (isFull) {
        marginLeft = (canvaHeight - elementHeight - spaceFilledByText - tBMargin) / 2;
      } else {
        marginLeft = (canvaHeight - elementHeight - spaceFilledByText) / 2;
      }

      if (caption === "above" && spacingToDevice > marginLeft) {
        intermediaryMargin = spacingToDevice;
      } else if (caption === "below" && spacingToText > marginLeft) {
        intermediaryMargin = spacingToText;
      } else {
        intermediaryMargin = marginLeft;
      }
    }
  }

  // 12. calculer l'espace occupé par le bloc au-dessus ou au-dessous de l'element:
  getSpaceFilled = () => {
    if (!isText) {
      spaceFilledNone = intermediaryMargin;
    } else {
      spaceFilledAbove = spaceFilledByText + intermediaryMargin;
      spaceFilledBelow = intermediaryMargin + spaceFilledByText;
    }
  }

  // 13. calculer les translations : translateX et translateY
  getTranslations = () => {
    translateX = sideMargin;

    if (!isText) {
      translateY = spaceFilledNone;
    } else if (caption === "above") {
      translateY = spaceFilledAbove;
    } else if (caption === "below") {
      translateY = canvaHeight - elementHeight - spaceFilledBelow;
    }
  }

  getRotateTranslations = () => {
    if (rotRadians > 0) {
      translateX += diffWidthRight + sideMargin * 1.3;
      translateY += 0;
    } else {
      diffHeightTop = Math.abs(Math.tan(rotRadians) * (deviceWidth - diffWidthRight));
      translateX -= sideMargin * 1.3;
      translateY += diffHeightTop;
    }
  }


/***************************************
methods to draw and write on the canvas
***************************************/

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
    childCanvas.classList.add(DeviceSize[device].canva);
    childCanvas.width = canvaWidth;
    childCanvas.height = canvaHeight;

    // appending the canva to the parent
    parentCanvas.appendChild(childCanvas);
  }

  uploadScreenshot = (e) => {
    // e.preventDefault();
    const blob = e.target.files[0].slice(0, e.target.files[0].size, e.target.files[0].type);
    const newFile = new File ([blob], `${this.props.canva.id}.png`, {type: e.target.files[0].type});

    this.props.handleChangeCanvas(this.props.canva.id, "screenshot", newFile);
    this.props.handleChangeCanvas(this.props.canva.id, "screenshotURL", `/${this.props.userId}/${this.props.canva.ProjectId}/${newFile.name}`);
  }

  addCanvasBackground = (ctx) => {
    // creating the background
    ctx.fillStyle = this.props.canva.backgroundColor;
    ctx.fillRect(0, 0, canvaWidth, canvaHeight);
  }

  writeText = (ctx, startHeight, fontColor, font, fontSize, content, lineToLine) => {
    ctx.fillStyle = fontColor;
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = 'center';

    let heightToDrawText = startHeight;

    for (let i = 0; i < content.length; i++) {
      const gap = ctx.measureText(" ").width;

      ctx.fillText(content[i], (canvaWidth + gap)/2, heightToDrawText, maxWidthText);
      // ajout d'un interligne line/line
      heightToDrawText += (lineToLine + fontSize);
    }
  }

  addCanvasScreenshot = (ctx) => {
      const reader = new FileReader();
      const screenshot = new Image();

      reader.onload = function(e) {
        screenshot.src = e.target.result;
      }

      if (this.props.canva.screenshot) {
        reader.readAsDataURL(this.props.canva.screenshot);
        screenshot.onload = () => {
          ctx.drawImage(screenshot, this.state.screenshotWidthStart, this.state.screenshotHeightStart, this.state.screenshotWidth, this.state.screenshotHeight);
          this.addCanvasDevice(ctx);
        }
      }
  }

  addCanvasDevice = (ctx) => {
    if (this.state.isDevice) {
      const deviceImg = new Image();
      deviceImg.src = require(`../mockups/${this.props.device}.png`);
      deviceImg.onload = () => {
        ctx.drawImage(deviceImg, this.state.deviceWidthStart, this.state.deviceHeightStart, this.state.deviceWidth, this.state.deviceHeight);
      }
    }
  }

  downloadIt = (index) => {
    const download = document.querySelector(`#a-${index}`);
    const image = document.querySelector(`#canva-${index}`).toDataURL('image/jpeg', 0.7).replace("image/jpg", "image/octet-stream");
    download.setAttribute("href", image);
  }


/********************************************
the finale method where everything is played
********************************************/

  createCanvas = () => {
    // destroying and creating the empty canva, must be first and in this order
    this.getContext();
    this.getCanvaDatas();
    this.destroyPrevCanvas();
    this.createEmptyCanvas();

    const ctx = document.querySelector(`#canva-${this.props.index}`).getContext('2d');

    // ctx.mozImageSmoothingEnabled = false;
    // ctx.webkitImageSmoothingEnabled = false;
    // ctx.msImageSmoothingEnabled = false;
    // ctx.imageSmoothingEnabled = false;

    // getting meta-datas
    this.getMargins();
    this.defineText(ctx);
    this.getTextDatas();
    this.getTextSize();
    this.getMaxDimensions();
    this.redoDeviceForCanvas();
    this.redoScreenshotForCanvas();
    this.getElementSize();
    this.getTextStart();
    this.getTitleStart();
    this.getSubtitleStart();
    this.getIntermediaryMargin();
    this.getSpaceFilled();
    this.getTranslations();

    // drawing the background
    this.addCanvasBackground(ctx);

    // drawing the text
    if (caption !== "none") {
      this.writeText(ctx, titleStart, this.props.canva.titleColor, this.props.canva.titleFont, titleSize, titleSplited, titleToTitle);
      this.writeText(ctx, subtitleStart, this.props.canva.subtitleColor, this.props.canva.subtitleFont, subtitleSize, subtitleSplited, subtitleToSubtitle);
    }

    // rotating if needed
    if (isRotate) {
      this.getRotateTranslations();
      ctx.translate(translateX, translateY);
      ctx.rotate(rotRadians);
    } else {
      // translation of the element (device and screenshot)
      ctx.translate(translateX, translateY);
    }

    // if we have a screenshot, addCanvasDevice() is played inside the method drawing the screenshot (after that the screenshot is drawn)
    // otherwise it's played here
    if (this.props.canva.screenshotURL) {
      this.addCanvasScreenshot(ctx);
    } else {
      this.addCanvasDevice(ctx);
    }

    // this.sendCanvasDatasToProject();

  }

/*************************************
methods to display the dropdown menus
*************************************/


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
    return templates;
  }


  render() {
    return(
      <Wrapper>
        <CanvaContainer id={`canva-container-${this.props.index}`} />
        <Settings>
          <p>settings ici</p>

          <label htmlFor={`template-${this.props.index}`}>Template:</label>
          <select id={`template-${this.props.index}`} name="template" onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)} value={this.props.canva.template} >
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
           value={this.props.canva.backgroundColor}
           onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)}
          />

          <label htmlFor={`background-color-dropdown-${this.props.index}`}>Background Color Picker:</label>
          <select id={`background-color-dropdown-${this.props.index}`} name="backgroundColor" onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)} value={this.props.canva.backgroundColor} style={{backgroundColor: this.props.canva.backgroundColor}} >
           {this.displayColors()}
          </select>

          <label htmlFor={`title-content-${this.props.index}`}>Title:</label>
          <TextArea
            id={`title-content-${this.props.index}`}
            name="titleContent"
            placeholder="Type your title here"
            value={this.props.canva.titleContent}
            onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)}
          />

          <label htmlFor={`title-size-${this.props.index}`}>Title Size:</label>
          <select id={`title-size-${this.props.index}`} name="titleSize" onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)} value={this.props.canva.titleSize} >
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
            value={this.props.canva.titleColor}
            onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)}
          />

          <label htmlFor={`title-color-dropdown-${this.props.index}`}>Title Color Picker:</label>
          <select id={`title-color-dropdown-${this.props.index}`} name="titleColor" onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)} value={this.props.canva.titleColor} style={{backgroundColor: this.props.canva.titleColor}} >
            {this.displayColors()}
          </select>

          <label htmlFor={`title-font-dropdown-${this.props.index}`}>Title Font:</label>
          <select id={`title-font-dropdown-${this.props.index}`} name="titleFont" onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)} value={this.props.canva.titleFont}>
            {this.displayFonts()}
          </select>

          <label htmlFor={`subtitle-content-${this.props.index}`}>Subtitle:</label>
          <TextArea
            id={`subtitle-content-${this.props.index}`}
            name="subtitleContent"
            placeholder="Type your subtitle here"
            value={this.props.canva.subtitleContent}
            onChange={e => this.this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)}
          />

          <label htmlFor={`subtitle-size-${this.props.index}`}>Subtitle Size:</label>
          <select id={`subtitle-size-${this.props.index}`} name="subtitleSize" onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)} value={this.props.canva.subtitleSize} >
            <option value="small">small</option>
            <option value="medium" default>medium</option>
            <option value="large">large</option>
          </select>

          <label htmlFor={`subtitle-color-${this.props.index}`}>Subtitle Color:</label>
          <input
            id={`subtitle-color-${this.props.index}`}
            name="subtitleColor"
            placeholder="Color"
            value={this.props.canva.subtitleColor}
            onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)}
          />

          <label htmlFor={`subtitle-color-dropdown-${this.props.index}`}>Subtitle Color Picker:</label>
          <select id={`subtitle-color-dropdown-${this.props.index}`} name="subtitleColor" onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)} value={this.props.canva.subtitleColor} style={{backgroundColor: this.props.canva.subtitleColor}} >
            {this.displayColors()}
          </select>

          <label htmlFor={`subtitle-font-dropdown-${this.props.index}`}>Subtitle Font:</label>
          <select id={`subtitle-font-dropdown-${this.props.index}`} name="subtitleFont" onChange={e => this.props.handleChangeCanvas(this.props.canva.id, e.target.name, e.target.value)} value={this.props.canva.subtitleFont}>
            {this.displayFonts()}
          </select>

        </Settings>
          { this.props.canva.id ?
            <DeleteButton onClick={() => this.props.deleteCanva(this.props.canva.id, this.props.canva.screenshotURL)}>
              <p>Delete this mockup</p>
            </DeleteButton>
          : null}
        <DlContainer id={`a-${this.props.index}`} className="button" download={`${this.props.device}_${this.props.index + 1}.jpg`} onClick={ () => {this.downloadIt(this.props.index)} }>
          <button className="dl-button">Download</button>
        </DlContainer>
      </Wrapper>
    );
  }
}



export default Canvas;
