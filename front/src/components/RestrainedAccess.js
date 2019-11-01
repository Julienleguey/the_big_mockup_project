import React, { useState } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  margin: 0 auto;
  height: 50px;
  width: 300px;
  font-size: 20px;
`;

const RestrainedAccess = (props) => {

  const [restrainedPassword, setRestrainedPassword] = useState("");

  function submitPassword(e) {
    e.preventDefault();
    if (restrainedPassword === process.env.REACT_APP_RESTRAINED_PASSWORD) {
      localStorage.setItem("restrainedToken", new Date());
      window.location.replace("/");
    }
  }

  function handleChange(e) {
    setRestrainedPassword(e.target.value);
  }

  return(
    <Wrapper>
      <Title>Restrained Access</Title>
      <Form method="post" onSubmit={submitPassword}>
        <Input
          id="restrained-password"
          name="restrained-password"
          type="password"
          placeholder="Restrained Password"
          value={restrainedPassword}
          onChange={handleChange}
        />
        <div className="grid-100 pad-bottom">
          <button className="button" type="submit">Check</button>
        </div>
      </Form>
    </Wrapper>
  )
}


export default withRouter(RestrainedAccess);
