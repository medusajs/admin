import React from "react"
import { Flex, Box, Text, Card as RebassCard } from "rebass"
import styled from "@emotion/styled"

import Badge from "../fundamentals/badge"
import Dropdown from "../dropdown"
import Button from "../button"
import Typography from "../typography"

const Card = styled(RebassCard)`
  ${Typography.Base}
  border-radius: 2px;
  height: 100%;
`

const StyledFooter = styled(Flex)`
  ${props =>
    !props.hideBorder &&
    `
    border-top: 1px solid #e3e8ee;
  `}
`

const StyledHeader = styled(Flex)`
  ${props =>
    !props.hideBorder &&
    `
  
`}
`

Card.Header = ({
  children,
  badge,
  dropdownOptions,
  action,
  removeBorderTop,
  ...rest
}) => {
  if (action && !Array.isArray(action)) {
    action = [action]
  }

  let style = {}

  if (!removeBorderTop) {
    style = { borderTop: "1px solid #e3e8ee" }
  }

  return (
    <StyledHeader sx={style} alignItems="center" {...rest}>
      <Flex p={3} flexGrow="1" fontWeight="bold" alignItems="center">
        <Text fontSize={20}>{children}</Text>
        {!!badge && (
          <Badge
            ml={3}
            color={badge.color || "#4f566b"}
            bg={badge.bgColor || "#e3e8ee"}
          >
            {badge.label}
          </Badge>
        )}
      </Flex>
      {!!action &&
        action.map(a => (
          <Button
            loading={a.isLoading}
            onClick={a.onClick}
            disabled={a.disabled}
            mr={3}
            variant={a.type || "cta"}
          >
            {a.label}
          </Button>
        ))}
      {dropdownOptions && dropdownOptions.length > 0 && (
        <Dropdown mr={3}>
          {dropdownOptions.map(o => (
            <Text p={0} color={o.variant} onClick={o.onClick}>
              {o.label}
            </Text>
          ))}
        </Dropdown>
      )}
    </StyledHeader>
  )
}

Card.VerticalDivider = styled(Box)`
  box-shadow: inset -1px 0 #e3e8ee;
  width: 1px;
`

Card.Footer = ({ children, ...rest }) => (
  <StyledFooter py={3} {...rest}>
    {children}
  </StyledFooter>
)

Card.Body = ({ children, ...rest }) => (
  <Flex py={3} {...rest}>
    {children}
  </Flex>
)

export default Card
