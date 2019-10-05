import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios';
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

const DuplicateProjectModal = props => {

  function duplicateProject(e) {
    e.preventDefault();
    console.log("duplicate", props.projectId);

    const emailAddress = localStorage.getItem('emailAddress');
    const password = localStorage.getItem('password');

    axios.post(`http://localhost:5000/projects/duplicate/${props.projectId}`, {}, {
      auth: {
        username: emailAddress,
        password: password
      },
    }).then( res => {
      console.log(res);
      props.setFlash("success", res.data);
      props.reloadProjects();
      props.closeModal();
    }).catch( err => {
      console.log(err);
      props.setFlash("error", err.response.data);
      props.reloadProjects();
      props.closeModal();
    })
  }

  return (
    <Modal
      open={props.isOpen}
      onClose={() => props.closeModal()}
      wrapContent
      showClose
      PaperProps={{ square: true }}
      CloseProps={{ style: { marginTop: 16, marginRight: 16 } }}
      maxWidth="sm"
      title="Duplicate the project"
    >
      <Wrapper>
          <p>Do you wish to duplicate this project?</p>
          <Button className="button" onClick={duplicateProject}>Duplicate</Button>
      </Wrapper>
    </Modal>
  )
};

export default DuplicateProjectModal;

// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f
