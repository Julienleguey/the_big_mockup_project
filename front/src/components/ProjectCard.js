import React, { Component } from 'react';
import styled from "styled-components";

const Card = styled.a`
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
      <Card href={`/project/${this.props.id}`}>
        <h4>{this.props.name}</h4>
      </Card>
    );
  }
}



export default ProjectCard;
