import styled from "@emotion/styled"
import React from "react"
import { Flex } from "rebass"

const Modal = styled(Flex)`
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  background-color: rgba(238, 240, 245, 0.7);
  overflow: auto;
`

const ModalBody = styled(Flex)`
  flex-direction: column;
  max-height: 90vh;
  min-width: 450px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.12),
    0px 7px 15px 0px rgba(137, 149, 156, 0.12);
`

const ModalContent = styled(Flex)`
  flex: 1;
  overflow: auto;
`

const StyledHeader = styled(Flex)`
  border-bottom: 1px solid #e3e8ee;
`

const StyledFooter = styled(Flex)`
  align-items: center;
  border-top: 1px solid #e3e8ee;
`

Modal.Body = ({ children, ...rest }) => {
  return (
    <ModalBody onClick={e => e.stopPropagation()} {...rest}>
      {children}
    </ModalBody>
  )
}

Modal.Content = ({ children, ...rest }) => {
  return (
    <ModalContent p={3} {...rest}>
      {children}
    </ModalContent>
  )
}

Modal.Header = ({ children, ...rest }) => {
  return (
    <StyledHeader p={3} onClick={e => e.stopPropagation()} {...rest}>
      {children}
    </StyledHeader>
  )
}

Modal.Footer = ({ children, ...rest }) => {
  return (
    <StyledFooter p={3} onClick={e => e.stopPropagation()} {...rest}>
      {children}
    </StyledFooter>
  )
}

export default Modal
