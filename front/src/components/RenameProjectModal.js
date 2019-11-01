import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from 'axios';
import Modal from "./Modal/Modal";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  width: 300px;
  height: 50px;
`;

const Button = styled.button`
  margin-top: 16px;
  height: 100px;
  margin-bottom: 80px;
`;

const RenameProjectModal = props => {

  const [name, setName] = useState("");

  useEffect(() => {
    setName(props.projectName);
  }, [props.projectId]);

  function handleChange(e) {
    setName(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    axios.put(`${process.env.REACT_APP_API_ENDPOINT}/projects/rename/${props.projectId}`, {
      name: name
    }, {
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
      title="Rename the project"
    >
      <Wrapper>
          <Form onSubmit={e => handleSubmit(e)}>
            <Input
              id="name" type="text" name="name"
              value={name}
              onChange={handleChange}
              autoFocus
            />
            <Button className="button" type="submit">Save</Button>
          </Form>
      </Wrapper>
    </Modal>
  )
};

export default RenameProjectModal;

// https://itnext.io/how-to-build-a-dynamic-controlled-form-with-react-hooks-2019-b39840f75c4f
