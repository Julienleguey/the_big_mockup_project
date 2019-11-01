import React from "react";
import styled from "styled-components";

const Title = styled.p`
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1.6px;
  margin: 0 30px;
  @media (max-width: 712px) {
    margin: 0 16px;
  }
`;

const Container = styled.div`
  flex: 0 0 auto;
  margin: 0;
  padding: 24px 24px 20px;
`;

const ModalHeader = ({ title, divider }) => {
  if (!title) return null;

  return (
    <React.Fragment>
      <Container>
        <Title>
          {title}
        </Title>
      </Container>
    </React.Fragment>
  );
};

export default ModalHeader;
