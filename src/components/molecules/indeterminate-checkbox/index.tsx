import clsx from "clsx"
import React from "react"
import CheckIcon from "../../fundamentals/icons/check-icon"

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, className, checked, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    const handleClick = () => {
      if (resolvedRef.current) {
        resolvedRef.current.click()
      }
    }

    return (
      <div className="items-center h-full flex">
        <div
          onClick={handleClick}
          className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base ${
            checked && "bg-violet-60"
          }`}
        >
          <span className="self-center">
            {checked && <CheckIcon size={16} />}
          </span>
        </div>
        <input
          type="checkbox"
          className={clsx("hidden", className)}
          checked={checked}
          ref={resolvedRef}
          {...rest}
        />
      </div>
    )
  }
)

export default IndeterminateCheckbox
