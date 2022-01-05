import React from "react"
import { classNames } from "../../utils/class-names"

type SpinnerProps = {
  size: "large" | "medium" | "small"
  variant: "primary" | "secondary"
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "large",
  variant = "primary",
}) => {
  const spinnerSize =
    size === "large"
      ? "h-[24px] w-[24px]"
      : size === "medium"
      ? "h-[20px] w-[20px]"
      : "h-[16px] w-[16px]"

  const spinnerColor =
    variant === "primary" ? "border-t-grey-0" : "border-t-violet-60"

  return (
    <div
      className={classNames("flex items-center justify-center", spinnerSize)}
    >
      <div className="inline-block relative w-full h-full">
        <div
          className={classNames(
            "animate-ring border-2 h-4/5 w-4/5 rounded-circle border-transparent",
            spinnerColor
          )}
        />
      </div>
    </div>
  )
}

export default Spinner
