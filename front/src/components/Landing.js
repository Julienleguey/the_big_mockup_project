import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import axios from 'axios';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`;

const Title = styled.div`
  margin: 50px;
  text-align: center;
  font-size: 50px;
`;

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 50px;
  margin: 0 auto;
  border: 1px solid black;
  border-radius: 10px;

  &:hover {
    background-color: green;
    cursor: pointer;
  }
`;

const Landing = (props) => {
  function tryIt() {
    const token = localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_API_ENDPOINT}/users/testing/${props.context.loggedUserId}`, {}, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `obladi ${token}`
      }
    }).then( res => {
      props.context.actions.updateStatus("testing");
      props.history.push("/onboarding-project");
    }).catch( err => {
      console.log(err);
    })
  }

  return(
    <Wrapper>
      <Title>The big mockup project</Title>
      { props.context.status !== "active" &&
        <Button onClick={tryIt}>Try it!</Button>
      }
    </Wrapper>
  )
}


export default withRouter(Landing);
