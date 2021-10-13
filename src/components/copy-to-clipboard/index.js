import React from "react"
import { Box, Flex, Text } from "rebass"
import useClipboard from "../../hooks/use-clipboard"
import Tooltip from "../tooltip"
import { ReactComponent as ClipboardIcon } from "../../assets/svg/clipboard.svg"
import { ReactComponent as CheckIcon } from "../../assets/svg/check.svg"
import Button from "../button"
import styled from "@emotion/styled"
import Typography from "../typography"

const TextButton = styled(Button)`
  ${Typography.Base};
  border: none;
  background: none;
  outline: none;
  color: #89959c;
  border-radius: 0px;
  padding: 3px 1px;
  transition: color 0.3s ease;
  &:hover {
    color: #454b54;

    & svg {
      fill: #454b54;
    }
  }
`

const CopyToClipboard = ({
  copyText,
  tooltipText,
  label,
  buttonProps,
  fillColor,
  onCopy = () => {},
  successDuration = 3000,
}) => {
  const [isCopied, handleCopy] = useClipboard(copyText, {
    onCopy,
    successDuration,
  })

  const forceTooltipRemount = isCopied ? "content-1" : "content-2"
  const tooltipId = `tooltip__${tooltipText}`

  return (
    <Flex alignItems="center">
      <Box
        data-for={tooltipId}
        data-tip={forceTooltipRemount}
        key={forceTooltipRemount}
      >
        {isCopied ? (
          <Tooltip id={tooltipId}>
            <Flex alignItems="center">
              <CheckIcon />
              <Text fontSize={12} ml={2}>
                Copied!
              </Text>
            </Flex>
          </Tooltip>
        ) : (
          <Tooltip id={tooltipId}>{tooltipText}</Tooltip>
        )}
        <TextButton onClick={handleCopy} {...buttonProps}>
          <Flex alignItems="center">
            <Box mr={1}>{label}</Box>
            <ClipboardIcon
              style={{ marginTop: 1, display: "block" }}
              fill={fillColor ? fillColor : "#454B54"}
            />
          </Flex>
        </TextButton>
      </Box>
    </Flex>
  )
}

export default CopyToClipboard
