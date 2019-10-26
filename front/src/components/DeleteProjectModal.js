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

const DeleteProjectModal = props => {

  function deleteProject(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/projects/delete/${props.projectId}`, {
      params: {userId: props.userId},
      headers: { Authorization: `obladi ${token}`}
    }).then( res => {
      props.setFlash("success", res.data);
      props.reloadProjects();
      props.closeModal();
    }).catch( err => {
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
      title="Delete the project"
    >
      <Wrapper>
          <p>Do you wish to delete this project? This action is definitive!</p>
          <Button className="button" onClick={deleteProject}>Delete</Button>
      </Wrapper>
    </Modal>
  )
};

export default DeleteProjectModal;

// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f
