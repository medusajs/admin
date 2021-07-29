import React, { useState, useRef, useEffect } from "react"
import styled from "@emotion/styled"
import _ from "lodash"
import { Box, Flex } from "rebass"

import { ReactComponent as Ellipsis } from "../../assets/svg/ellipsis.svg"

import Button from "../button"

export const DropdownContainer = styled(Box)`
  ${props => `
    display: ${props.isOpen ? "block" : "none"};
  `};

  transform: ${props =>
    props.dropUp ? "translateY(-180px)" : "translateY(32px)"};
  position: absolute;
  background-color: #fefefe;
  min-width: ${props => props.dropdownWidth};
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);
  z-index: 1;
  top: ${props => (props.topPlacement ? props.topPlacement : "10px")};
  border-radius: 5px;
  ${props => (props.leftAlign ? "left" : "right")}: 0;
`

const Scrollable = styled(Box)`
  max-height: 80vh;
  overflow: auto;
`

const DropdownItem = styled.a`
  > div {
    padding: 12px 16px;
  }
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
  dropdownWidth,
  dropdownHeight,
  dropUp = false,
  showTrigger = true,
  topPlacement,
  sx,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(showTrigger ? false : true)
  const [search, setSearch] = useState("")

  const ref = useRef(null)

  const handleClickOutside = event => {
    if (
      ref.current &&
      !ref.current.contains(event.target) &&
      isOpen &&
      showTrigger
    ) {
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
    <Flex sx={{ position: "relative", width: showTrigger ? "auto" : "100%" }}>
      {showTrigger && (
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
      )}
      <DropdownContainer
        dropUp={dropUp}
        leftAlign={leftAlign}
        minWidth={dropdownWidth || "160px"}
        ref={ref}
        isOpen={isOpen}
        topPlacement={topPlacement}
        {..._.pick(rest, spacingProps)}
      >
        {showSearch && (
          <StyledInput
            placeholder={searchPlaceholder}
            value={search}
            onChange={handleSearch}
          />
        )}
        <Scrollable maxHeight={dropdownHeight || "80vh"}>
          {React.Children.map(children, child => (
            <DropdownItem>{child}</DropdownItem>
          ))}
        </Scrollable>
      </DropdownContainer>
    </Flex>
  )
}

export default Dropdown
