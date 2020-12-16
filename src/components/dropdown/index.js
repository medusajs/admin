import React, { useState, useRef, useEffect } from "react"
import styled from "@emotion/styled"
import _ from "lodash"
import { Box } from "rebass"

import { ReactComponent as Ellipsis } from "../../assets/svg/ellipsis.svg"

import Button from "../button"

const DropdownContainer = styled(Box)`
  ${props => `
    display: ${props.isOpen ? "block" : "none"};
  `};

  transform: translateY(32px);
  position: absolute;
  background-color: #fefefe;
  min-width: 160px;
  // box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);
  z-index: 1;
  top: 10px;
  border-radius: 5px;
  ${props => (props.leftAlign ? "left" : "right")}: 0;
`

const Scrollable = styled(Box)`
  max-height: 80vh;
  overflow: auto;
`

const DropdownItem = styled.a`
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f1f3f5;
  }
`

const StyledInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 0.8em;
  padding: 5px 12px;
  color: #454545;

  outline: none;
`

const Dropdown = ({
  children,
  searchPlaceholder,
  showSearch,
  onSearchChange,
  toggleText,
  leftAlign,
  sx,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

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

  const handleSearch = e => {
    const element = e.target
    if (onSearchChange) {
      onSearchChange(element.value)
    }

    setSearch(element.value)
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  })

  const spacingProps = ["m", "mr", "ml", "mx"]

  return (
    <div style={{ position: "relative" }}>
      <Button
        sx={sx}
        minHeight="33px"
        alignItems="center"
        variant="primary"
        onClick={() => handleOpen()}
        {...rest}
      >
        {toggleText || <Ellipsis height="10px" />}
      </Button>
      <DropdownContainer
        leftAlign={leftAlign}
        ref={ref}
        isOpen={isOpen}
        {..._.pick(rest, spacingProps)}
      >
        {showSearch && (
          <StyledInput
            placeholder={searchPlaceholder}
            value={search}
            onChange={handleSearch}
          />
        )}
        <Scrollable>
          {React.Children.map(children, child => (
            <DropdownItem>{child}</DropdownItem>
          ))}
        </Scrollable>
      </DropdownContainer>
    </div>
  )
}

export default Dropdown
