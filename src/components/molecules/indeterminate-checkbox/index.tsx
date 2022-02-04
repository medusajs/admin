import React, { forwardRef, useEffect, useRef } from "react"
import CheckIcon from "../../fundamentals/icons/check-icon"

interface Props {
  indeterminate?: boolean
  name: string
}

const useCombinedRefs = (...refs): React.MutableRefObject<any> => {
  const targetRef = React.useRef()

  React.useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) {
        return
      }

      if (typeof ref === "function") {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}

const IndeterminateCheckbox = forwardRef<HTMLInputElement, Props>(
  ({ indeterminate, ...rest }, ref: React.Ref<HTMLInputElement>) => {
    const defaultRef = useRef(null)
    const combinedRef = useCombinedRefs(ref, defaultRef)

    useEffect(() => {
      if (combinedRef?.current) {
        combinedRef.current.indeterminate = indeterminate ?? false
      }
    }, [combinedRef, indeterminate])

    return (
      <div className="items-center h-full flex">
        <div
          onClick={() => combinedRef.current?.click()}
          className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base ${
            combinedRef.current?.checked && "bg-violet-60"
          }`}
        >
          <span className="self-center">
            {combinedRef.current?.checked && <CheckIcon size={16} />}
          </span>
        </div>
        <input type="checkbox" className="hidden" ref={combinedRef} {...rest} />
      </div>
    )
  }
)

export default IndeterminateCheckbox
