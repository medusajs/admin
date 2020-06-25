import React, { useState, useRef, useEffect } from "react"
import styled from "@emotion/styled"

import { ReactComponent as Ellipsis } from "../../assets/svg/ellipsis.svg"

import Button from "../button/index"

const DropdownContainer = styled.div`
  ${props => `
    display: ${props.isOpen ? "block" : "none"};
    transform: translate3d(-15px, 32px, 0px);  
  `};

  position: absolute;
  background-color: #fefefe;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  top: 0;
  border-radius: 5px;
  right: 0;

  &::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    bottom: 100%;
    right: 0.4rem;
    border: 0.4rem solid transparent;
    border-top: none;
    color: #fefefe;

    border-bottom-color: #fefefe;
    filter: drop-shadow(0px 8px 16px 0px rgba(0, 0, 0, 0.2));
  }
`

const DropdownItem = styled.a`
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  cursor: pointer;
`

const Dropdown = ({ children, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)

  const ref = useRef(null)

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target) && isOpen) {
      setIsOpen(false)
    }
  }

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true)
    } else if (isOpen) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  })

  return (
    <div style={{ position: "relative" }}>
      <Button
        mr={3}
        p={0}
        alignItems="center"
        variant="primary"
        height="20px"
        width="35px"
        onClick={() => handleOpen()}
      >
        <Ellipsis height="20px" />
      </Button>
      <DropdownContainer ref={ref} isOpen={isOpen}>
        {" "}
        {/* {children && children.map(el => <DropdownItem>{el}</DropdownItem>)} */}
        {React.Children.map(children, child => (
          <DropdownItem>{child}</DropdownItem>
        ))}
      </DropdownContainer>
    </div>
  )
}

export default Dropdown
