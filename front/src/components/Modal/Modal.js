import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Dialog as MuiDialog, DialogContent } from "@material-ui/core";
import ModalHeader from "./ModalHeader";
import close from "../../images/close.svg";

const CloseButton = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 19px;
  margin-top: 24px;
  background-image: url(${close});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  height: 20px;
  width: 20px;
`;

const Modal = ({
  title,
  children,
  wrapContent,
  showClose,
  CloseProps,
  HeaderProps,
  divider,
  ...other
}) => (
  <MuiDialog {...other}>
    {showClose && <CloseButton onClick={other.onClose} {...CloseProps} />}
    <ModalHeader title={title} {...HeaderProps} divider={divider} />
    {wrapContent ? <DialogContent children={children} /> : children}
  </MuiDialog>
);

Modal.defaultProps = {
  wrapContent: false,
  showClose: false,
  divider: true
};

Modal.propTypes = {
  wrapContent: PropTypes.bool,
  showClose: PropTypes.bool,
  title: PropTypes.string,
  CloseProps: PropTypes.object,
  HeaderProps: PropTypes.object,
  divider: PropTypes.bool
};

export default Modal;
