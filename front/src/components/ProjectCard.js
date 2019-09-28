import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from "styled-components";

import Project from './Project';

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 400px;
  height: 200px;
  border: 1px dashed grey;
  border-radius: 10%;

  h4 {
    text-align: center;
  }
`;

class ProjectCard extends Component {

  constructor() {
    super();
    this.state = {
      prevPage: "/",
      emailAddress: "",
      password: ""
    };
  }

  render() {
    return(
      <Card to={{pathname: `/project`, state: {userId: this.props.userId, projectId: this.props.projectId} }}>
          <h4>{this.props.name}</h4>
      </Card>
    );
  }
}



export default ProjectCard;
