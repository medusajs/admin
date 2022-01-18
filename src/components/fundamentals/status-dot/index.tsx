import React from "react"
import clsx from "clsx"

type StatusDotProps = {
  title: string
  variant: "primary" | "danger" | "warning" | "success"
} & React.HTMLAttributes<HTMLDivElement>

const StatusDot: React.FC<StatusDotProps> = ({
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
  })
  return (
    <div className={clsx("flex items-center", className)} {...props}>
      <div
        className={clsx("w-1.5 h-1.5 mr-2 self-center rounded-full", dotClass)}
      ></div>
      {title}
    </div>
  )
}

export default StatusDot
