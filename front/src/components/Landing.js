import React from "react";
import styled from "styled-components";


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

const Landing = () => {


    return(
      <Wrapper>
        <Title>The big mockup project</Title>
        <Button href="/projects">Start</Button>
      </Wrapper>
    )

}


export default Landing;
