import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import Plan from './Plan';

import plans from '../params/plans.js';

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

const PlansContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0 auto;
`;


const Pricing = (props) => {

  function displayPlans() {
    const allPlans = plans.map( (plan, index) => {
      return (
        <Plan
          plan={plan}
          key={index}
          needRedirect={props.location.state ? props.location.state.needRedirect : false}
          redirectToProject={props.location.state ? props.location.state.redirectToProject : false}
        />
      )
    });
    return allPlans;
  }

    return(
      <Wrapper>
        <Title>Pricing</Title>
        <PlansContainer>
          {displayPlans()}
        </PlansContainer>
      </Wrapper>
    )

}


export default withRouter(Pricing);
