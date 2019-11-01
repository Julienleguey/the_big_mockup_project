import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import Modal from "./Modal/Modal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  margin-top: 16px;
  height: 100px;
  margin-bottom: 80px;
`;

const NeedPremiumModal = props => {

  console.log("helloooooooooooooooooooooooo");
  console.log(props.projectId);


  return (
    <Modal
      open={props.isOpen}
      onClose={() => props.closeModal()}
      wrapContent
      showClose
      PaperProps={{ square: true }}
      CloseProps={{ style: { marginTop: 16, marginRight: 16 } }}
      maxWidth="sm"
      title="You need a premium account!"
    >
      <Wrapper>
          <p>You need a premium account to save your project. Don't worry, you won't lose your work and you will be redirected to this very page.</p>
          <Button className="button" onClick={props.closeModal}>Nah, I'm good</Button>
          <Button className="button" onClick={ () => props.history.push({ pathname: "/pricing", state: { needRedirect: true, redirectToProject: props.projectId } })}>Subscribe to a premium account</Button>
      </Wrapper>
    </Modal>
  )
};

export default withRouter(NeedPremiumModal);
