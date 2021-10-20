import React from "react"
import { Flex, Box, Button as RebassButton } from "rebass"
import styled from "@emotion/styled"
import Spinner from "../spinner"

const Button = ({
  loading,
  children,
  variant,
  type,
  onClick,
  disabled,
  innerRef,
  sx,
  ...props
}) => {
  const handleClick = e => {
    if (!loading && onClick) {
      onClick(e)
    }
  }

  return (
    <RebassButton
      ref={innerRef}
      sx={{
        position: "relative",
        cursor: loading ? "default" : "pointer",
        ...(sx || {}),
      }}
      disabled={disabled}
      loading={loading}
      onClick={handleClick}
      type={type || "button"}
      variant={`buttons.${variant}`}
      {...props}
    >
      {loading && (
        <Flex
          alignItems={"center"}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <Spinner
            height={"65%"}
            dark={variant === "cta" || variant === "danger" ? false : true}
          />
        </Flex>
      )}
      <Box
        sx={{
          visibility: loading ? "hidden" : "visible",
        }}
      >
        {children}
      </Box>
    </RebassButton>
  )
}

export default Button
