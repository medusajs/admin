import React from "react"
import clsx from "clsx"

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
