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
        <Box
          sx={{
            position: "absolute",
            // sets top, right, bottom, left to 0
            inset: 0,
          }}
        >
          <Spinner
            height={"65%"}
            sx={{ position: "absolute", inset: 0, margin: "auto" }}
            dark={
              variant === "cta" ||
              variant === "danger" ||
              variant === "deep-blue"
                ? false
                : true
            }
          />
        </Box>
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
