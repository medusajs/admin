import React from "react"
import { Box, Flex } from "rebass"
import styled from "@emotion/styled"
import Typography from "../../typography"
import clsx from "clsx"

const StyledBox = styled(Flex)`
  ${Typography.Base};
  display: inline-block;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
`

type BadgeProps = {
  variant: "primary" | "danger" | "success" | "warning"
} & React.HTMLAttributes<HTMLDivElement>

const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  onClick,
  className,
  ...props
}) => {
  const variantClassname = clsx({
    ["badge-primary"]: variant === "primary",
    ["badge-danger"]: variant === "danger",
    ["badge-success"]: variant === "success",
    ["badge-warning"]: variant === "warning",
  })

  return (
    <div
      className={clsx("badge", variantClassname, className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge
