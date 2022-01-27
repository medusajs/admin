import clsx from "clsx"
import React from "react"

type StatusIndicatorProps = {
  title: string
  variant: "primary" | "danger" | "warning" | "success" | "draft" | "active"
} & React.HTMLAttributes<HTMLDivElement>

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  title,
  variant = "success",
  className,
  ...props
}) => {
  const dotClass = clsx({
    "bg-teal-50": variant === "success",
    "bg-rose-50": variant === "danger",
    "bg-yellow-50": variant === "warning",
    "bg-violet-60": variant === "primary",
    "bg-grey-40": variant === "draft",
    "bg-emerald-40": variant === "active",
  })
  return (
    <div
      className={clsx("flex items-center inter-small-regular", className)}
      {...props}
    >
      <div
        className={clsx("w-1.5 h-1.5 mr-2 self-center rounded-full", dotClass)}
      />
      {title}
    </div>
  )
}

export default StatusIndicator
