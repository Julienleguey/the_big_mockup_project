import React from "react";
import { Link } from 'react-router-dom';
import styled from "styled-components";
import axios from 'axios';


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 200px;
  border: 1px black solid;
`;

const Title = styled.h1``;

const PriceTitle = styled.p``;

const Promotion = styled.p``;

const BuyButton = styled(Link)`
  width: 150px;
  height: 30px;
  border: 1px red solid;
  margin: 0 auto;
  &:hover {
    cursor: pointer;
  }
`;

const ProsContainer = styled.div`
  display: flex;
  flex-direction: column;
`
const Pro = styled.p``;

const Plan = (props) => {

  function displayPros() {
    const pros = props.plan.pros.map( (pro, index) => {
      return (
        <Pro key={index}>{pro}</Pro>
      )
    })
    return pros;
  }

    return(
      <Wrapper>
        <Title>{props.plan.name}</Title>
        <PriceTitle>{props.plan.price_title}</PriceTitle>
        {props.plan.promotion !== "" ?
          <Promotion>{props.plan.promotion}</Promotion>
        : null}
        <BuyButton to={{pathname: `/paymentstart`, state: {planId: props.plan.id, needRedirect: props.needRedirect, redirectToProject: props.redirectToProject} }}>
          Get Started - ${props.plan.price}
        </BuyButton>
        <ProsContainer>{displayPros()}</ProsContainer>
      </Wrapper>
    )
}


export default Plan;
