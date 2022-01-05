import React, { Children } from "react"
import { classNames } from "../../../utils/class-names"
import Spinner from "../../atoms/spinner"

type ButtonProps = {
  variant: "primary" | "secondary" | "ghost"
  size: "small" | "medium" | "large"
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "large",
      loading = false,
      children,
      ...attributes
    },
    ref
  ) => {
    const handleClick = e => {
      if (!loading && attributes.onClick) {
        attributes.onClick(e)
      }
    }

    let style: string

    switch (variant + "-" + size) {
      case "primary-large":
        style = "btn-primary-large"
        break
      case "primary-medium":
        style = "btn-primary-medium"
        break
      case "primary-small":
        style = "btn-primary-small"
        break
      case "secondary-large":
        style = "btn-secondary-large"
        break
      case "secondary-medium":
        style = "btn-secondary-medium"
        break
      case "secondary-small":
        style = "btn-secondary-small"
        break
      case "ghost-large":
        style = "btn-ghost-large"
        break
      case "ghost-medium":
        style = "btn-ghost-medium"
        break
      case "ghost-small":
        style = "btn-ghost-small"
        break
      default:
        style = "btn-primary-large"
        break
    }

    return (
      <button
        {...attributes}
        className={classNames(style, attributes.className)}
        disabled={attributes.disabled || loading}
        ref={ref}
        onClick={handleClick}
      >
        {loading ? (
          <Spinner size={size} variant={"secondary"} />
        ) : (
          Children.map(children, (child, i) => {
            return (
              <span key={i} className="mr-xsmall last:mr-0">
                {child}
              </span>
            )
          })
        )}
      </button>
    )
  }
)

export default Button
