import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import _ from "lodash"
import { Box, Flex } from "rebass"
import { ReactComponent as Ellipsis } from "../../assets/svg/ellipsis.svg"
import Button from "../button"
import Portal from "../portal"
import { usePopper } from "react-popper"

const searchInputHeight = 40

const Dropdown = ({
  children,
  searchPlaceholder,
  showSearch,
  onSearchChange,
  toggleText,
  sx,
  dropdownWidth = "160px",
  dropdownHeight = "300px",
  placement = "bottom-start",
  showTrigger = true,
  topPlacement = 10,
  ...rest
}) => {
  const [isOpen, setIsOpen] = useState(showTrigger ? false : true)
  const [search, setSearch] = useState("")
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const { styles, attributes, forceUpdate } = usePopper(
    referenceElement,
    popperElement,
    {
      placement,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, topPlacement],
          },
        },
        {
          name: "flip",
        },
        {
          name: "preventOverflow",
        },
      ],
    }
  )

  const handleClickOutside = event => {
    if (popperElement && !popperElement.contains(event.target) && isOpen) {
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

  // listen to showTrigger changes and setIsOpen accordingly
  useEffect(() => {
    setIsOpen(!showTrigger)
  }, [showTrigger])

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  })

  // if the number of children is updated (i.e: more/less search results) then force update the popper
  React.useLayoutEffect(() => {
    if (forceUpdate) {
      forceUpdate()
    }
  }, [children?.length])

  const spacingProps = ["m", "mr", "ml", "mx"]

  return (
    <Box
      {..._.pick(rest, spacingProps)}
      sx={{
        width: showTrigger ? "auto" : "100%",
        minWidth: "30px",
        minHeight: "30px",
      }}
      ref={!showTrigger ? setReferenceElement : null}
    >
      {showTrigger && (
        <Button
          sx={sx}
          minHeight="25px"
          alignItems="center"
          variant="primary"
          onClick={() => handleOpen()}
          innerRef={setReferenceElement}
          {..._.omit(rest, spacingProps)}
        >
          {toggleText || <Ellipsis height="10px" />}
        </Button>
      )}
      {isOpen && (
        <Portal>
          <DropdownContainer
            minWidth={dropdownWidth}
            ref={setPopperElement}
            isOpen={isOpen}
            reverse={
              attributes.popper &&
              attributes.popper["data-popper-placement"].includes("top")
            }
            style={styles.popper}
            {...attributes.popper}
          >
            {showSearch && (
              <StyledInput
                placeholder={searchPlaceholder}
                value={search}
                onChange={handleSearch}
                topBorder={
                  attributes.popper &&
                  attributes.popper["data-popper-placement"].includes("top")
                }
              />
            )}
            <Scrollable maxHeight={dropdownHeight}>
              {React.Children.map(children, child => (
                <DropdownItem onClick={() => setIsOpen(false)}>
                  {child}
                </DropdownItem>
              ))}
            </Scrollable>
          </DropdownContainer>
        </Portal>
      )}
    </Box>
  )
}

export default Dropdown

export const DropdownContainer = styled(
  React.forwardRef((props, ref) => <Box ref={ref} {...props} />)
)`
  display: flex;
  // if the container is positioned on top of the trigger AND this is a search input...
  // ...then show the searchInput in the bottom
  flex-direction: ${props => (props.reverse ? "column-reverse" : "column")};
  position: fixed;
  background-color: #fefefe;
  max-width: 300px;
  min-width: ${props => props.dropdownWidth};
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);
  z-index: 1;
  border-radius: 5px;
  overflow: hidden;
`

const Scrollable = styled(Box)`
  max-height: ${props => props.maxHeight};
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
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Ubuntu, sans-serif;
  ${props => {
    return props.theme.text.small.default
  }};
  font-weight: 300;
  &:hover {
    background: #f1f3f5;
  }
`

const StyledInput = styled.input`
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Helvetica Neue, Ubuntu, sans-serif;
  width: 100%;
  min-height: ${searchInputHeight}px;
  border: none;
  font-size: 0.8em;
  padding: 5px 12px;
  color: #454545;
  ${props =>
    props.topBorder
      ? `border-top: 1px solid rgba(0, 0, 0, 0.2)`
      : `border-bottom: 1px solid rgba(0, 0, 0, 0.2)`};
  outline: none;
`
