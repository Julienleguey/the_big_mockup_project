import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";

import Project from './Project';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 400px;
  height: 200px;
  border: 1px dashed grey;
  border-radius: 10%;
`;

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;

  h4 {
    text-align: center;
  }
`;

const OptionsContainer = styled.div`
  position: absolute;
  left: 8px;
  bottom: 8px;
`;

const OptionTitle = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const OptionsMenus = styled.div`
  display: ${props => props.isOpen ? "flex" : "none"};

  flex-direction: column;
  position: absolute;
  left: 0;
  bottom: -80px;
  z-index: 10;
  width: 100px;
  border: 1px solid black;
  padding: 8px;
`;

const Option = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

class ProjectCard extends Component {

  constructor() {
    super();
    this.state = {
      options: false
    };
  }

  openOptions = () => {
    this.setState({options: true});
    document.addEventListener("click", this.closeOptions);
  }

  closeOptions = () => {
    this.setState({options: false});
    document.removeEventListener("click", this.closeOptions);
  }

  render() {
    return(
      <Container>
        <Card to={{pathname: `/project`, state: {userId: this.props.userId, projectId: this.props.projectId} }}>
            <h4>{this.props.name}</h4>
        </Card>
        <OptionsContainer onClick={this.openOptions}>
          <OptionTitle>
            <p>Options</p>
          </OptionTitle>
          <OptionsMenus isOpen={this.state.options}>
            <Option onClick={() => this.props.openModal("renameProject", this.props.projectId, this.props.name)}>edit name</Option>
            <Option onClick={() => this.props.openModal("duplicateProject", this.props.projectId)}><p>duplicate</p></Option>
            <Option onClick={() => this.props.openModal("deleteProject", this.props.projectId, this.props.name)}><p>delete</p></Option>
          </OptionsMenus>
        </OptionsContainer>
      </Container>
    );
  }
}



export default ProjectCard;
