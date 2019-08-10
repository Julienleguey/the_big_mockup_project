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
const rLMarginRate = 0.05;
const tBMarginRate = 0.05;
const resizeNoDevice = 1.8;


let device = "";
let number = "";

let canvaWidth = 0;
let canvaHeight = 0;
let rLMargin = 0;
let tBMargin = 0;
let sideMargin = 0;
let maxWidth = 0;

let deviceWidth = 0;
let deviceHeight = 0;
let deviceWidthStart = 0;
let deviceHeightStart = 0;
let deviceWidthEnd = 0;
let deviceHeightEnd = 0;
let resizeWithDevice = 0;

let screenshotWidthStart = 0;
let screenshotHeightStart = 0;
let screenshotWidthEnd = 0;
let screenshotHeightEnd = 0;
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

    rLMargin = canvaWidth * rLMarginRate;
    tBMargin = canvaHeight * tBMarginRate;
    maxWidth = canvaWidth - rLMargin * 2;

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

  redoDeviceForCanvas = () => {

    // from width
    const tempWidth = canvaWidth * ( 1 - rLMarginRate * 2);
    const tempHeight = tempWidth * DeviceSize[this.props.device].height / DeviceSize[this.props.device].width;

    // from height
    const tempHeight2 = canvaHeight * ( 1 - tBMarginRate * 2);
    const tempWidth2 = tempHeight2 * DeviceSize[this.props.device].width / DeviceSize[this.props.device].height;

    if (tempWidth <= tempWidth2) {
      deviceWidth = tempWidth;
      deviceHeight = tempHeight;
    } else {
      deviceWidth = tempWidth2;
      deviceHeight = tempHeight2;
    }

    resizeWithDevice = deviceWidth / DeviceSize[this.props.device].width;
  }

  redoScreenshotForCanvas = () => {
    if (Templates[this.state.template].device) {
      screenshotWidthStart = (DeviceSize[this.props.device].widthStart * resizeWithDevice) + sideMargin;
      screenshotWidthEnd = DeviceSize[this.props.device].widthEnd * resizeWithDevice;
      screenshotHeightStart = DeviceSize[this.props.device].heightStart * resizeWithDevice;
      screenshotHeightEnd = DeviceSize[this.props.device].heightEnd * resizeWithDevice;
    } else {
      screenshotWidthStart = rLMargin * resizeNoDevice;
      screenshotHeightStart = 0;
      screenshotWidthEnd = canvaWidth - screenshotWidthStart * 2;
      screenshotHeightEnd = ( (canvaWidth - screenshotWidthStart * 2) * DeviceSize[this.props.device].heightEnd ) / DeviceSize[this.props.device].widthEnd;
      screenshotHeight = screenshotHeightEnd;
    }
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
      spaceFilledByTitle = titleSize * countTitleLines + titleToTitle * (countTitleLines-1) + TextSizes[this.state.titleSize].titleToSubtitle * titleToSubtitleNeeded;
    }

    if (countSubtitleLines === 0) {
      spaceFilledBySubtitle = 0;
    } else {
      spaceFilledBySubtitle = subtitleSize * countSubtitleLines + subtitleToSubtitle * (countSubtitleLines-1);
    }

    if (countTitleLines > 0) {
      paddingTop = TextSizes[this.state.titleSize].paddingTop;
      spaceFilledByTitle -= paddingTop;
    } else if (countSubtitleLines > 0 ) {
      paddingTop = TextSizes[this.state.subtitleSize].paddingTop;
      spaceFilledBySubtitle -= paddingTop;
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
  }

  getTextStart = () => {
    let firstLineHeight = 0;
    if (countTitleLines > 0) {
      firstLineHeight += (TextSizes[this.state.titleSize].titleSize - paddingTop);
    } else if (countSubtitleLines > 0) {
      firstLineHeight += (TextSizes[this.state.subtitleSize].subtitleSize - paddingTop);
    }

    if (Templates[this.state.template].caption === "above") {
      textStart = tBMargin + firstLineHeight;
    } else if (Templates[this.state.template].caption === "below") {
      textStart = CanvasSizes[DeviceSize[this.props.device].canva].height - spaceFilledByTitle - spaceFilledBySubtitle - tBMargin + firstLineHeight;
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
    // y'a moyen de refactoriser cette fonction : c'est le gros bazar et il y a des trucs qui se répètent
    sideMargin = Math.max(canvaWidth * rLMarginRate, (canvaWidth - deviceWidth) / 2);
    deviceWidthStart = sideMargin;
    // need to reboot the deviceHeightStart, do not delete, it's useful (seriously)
    deviceHeightStart = 0;

    if (Templates[this.state.template].caption === "none" || spaceFilledByTitle + spaceFilledBySubtitle === 0) {
      deviceHeightStart += (canvaHeight - deviceHeight) / 2;

      if (Templates[this.state.template].device) {
        screenshotHeightStart += (canvaHeight - deviceHeight) / 2;
      } else {
        screenshotHeightStart += (canvaHeight - screenshotHeight) / 2;
      }

    } else if (Templates[this.state.template].caption === "above") {
      if (spaceFilledByTitle + spaceFilledBySubtitle > 0) {
        const spaceLeft = canvaHeight - tBMargin - spaceFilledByTitle - spaceFilledBySubtitle;
        let marginLeft = 0;

        if (Templates[this.state.template].device) {
          marginLeft = (spaceLeft - deviceHeight)/2;
        } else {
          marginLeft = (spaceLeft - screenshotHeight)/2;
        }

        let spaceFilledByText = 0;

        if (marginLeft > spacingToDevice) {
          spaceFilledByText = tBMargin + spaceFilledByTitle + spaceFilledBySubtitle + marginLeft;
        } else {
          spaceFilledByText = tBMargin + spaceFilledByTitle + spaceFilledBySubtitle + spacingToDevice;
        }
        deviceHeightStart += spaceFilledByText;
        screenshotHeightStart += spaceFilledByText;
      }
    } else if (Templates[this.state.template].caption === "below") {
      if (spaceFilledByTitle + spaceFilledBySubtitle > 0) {
        const spaceLeft = canvaHeight - tBMargin - spaceFilledByTitle - spaceFilledBySubtitle;

        let deviceToBottom = 0;
        let marginLeft = 0;

        if (Templates[this.state.template].device) {
          marginLeft = (spaceLeft - deviceHeight)/2;
        } else {
          marginLeft = (spaceLeft - screenshotHeight)/2;
        }

        if (Templates[this.state.template].device) {
          if (marginLeft > spacingToText) {
            deviceToBottom = (canvaHeight - deviceHeight) - marginLeft - spaceFilledByTitle - spaceFilledBySubtitle - tBMargin;
          } else {
            deviceToBottom = (canvaHeight - deviceHeight) - spacingToText - spaceFilledByTitle - spaceFilledBySubtitle - tBMargin;
          }
        } else {
          console.log(marginLeft, spacingToText)
          if (marginLeft > spacingToText) {
            deviceToBottom = (canvaHeight - screenshotHeight) - marginLeft - spaceFilledByTitle - spaceFilledBySubtitle - tBMargin;
          } else {
            deviceToBottom = (canvaHeight - screenshotHeight) - spacingToText - spaceFilledByTitle - spaceFilledBySubtitle - tBMargin;
          }
        }

        deviceHeightStart += deviceToBottom;
        screenshotHeightStart += deviceToBottom;
      }
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
      heightToDrawText += (lineToLine + fontSize);
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
    this.redoDeviceForCanvas();
    this.redoScreenshotForCanvas();
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
    if (Templates[this.state.template].caption !== "none") {
      this.writeText(ctx, titleStart, this.state.titleColor, this.state.titleFont, titleSize, titleSplited, titleToTitle);
      this.writeText(ctx, subtitleStart, this.state.subtitleColor, this.state.subtitleFont, subtitleSize, subtitleSplited, subtitleToSubtitle);
    }

    // rotating if needed
    if (Templates[this.state.template].rotate) {
      ctx.translate((deviceWidth - sideMargin * 8)/2, 0);
      ctx.rotate((Math.PI / 180) * 25);
      ctx.translate(0, -200);
    }


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
