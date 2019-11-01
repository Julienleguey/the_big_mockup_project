import React, { Component } from 'react';
import styled from "styled-components";
import close from '../images/close.svg';

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  height: 0;
  overflow: hidden;
  width: 100%;
  /* background-color: lightblue; */
  transition: all 0.5s;

  &.active {
    height: 50px;
  }

  &.standard {
    background-color: lightblue;
  }

  &.success {
    background-color: lightgreen;
  }

  &.error {
    background-color: red;
    color: black;
  }

  &.warning {
    background-color: pink;
  }
`;

const Message = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 30px;
  width: 30px;
  padding: 10px;

  &:hover {
    cursor: pointer;
  }

  img {
    width: 30px;
  }
`;

class FlashAll extends Component {

  state = {
    plop: ""
  };

  componentDidMount() {
    this.setType();

    if (this.props.context.flashOpen === true) {
      this.openFlash();
    } else {
      this.closeFlash();
    }
  }

  componentDidUpdate() {
    this.setType();

    if (this.props.context.flashOpen === true) {
      this.openFlash();
    } else {
      this.closeFlash();
    }
  }

  openFlash = () => {
    document.querySelector("#main").classList.add("active");
  }

  closeFlash = () => {
    document.querySelector("#main").classList.remove("active");
  }

  setType = () => {
    const main = document.querySelector("#main");
    main.classList.remove("standard", "success", "error", "warning");
    main.classList.add(this.props.context.flashType);
  }


  render() {


    return(
      <Wrapper id="main">
        <Message>
          <p>{this.props.context.flashMsg}</p>
        </Message>
        <CloseContainer onClick={() => this.props.context.actions.closeFlash()}>
          <img src={close} alt="close the flash" />
        </CloseContainer>
      </Wrapper>
    );
  }
}

export default FlashAll;
