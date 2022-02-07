import clsx from "clsx"
import React, { useRef, useState } from "react"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import InputContainer from "../../fundamentals/input-container"
import InputHeader from "../../fundamentals/input-header"
import Tooltip from "../../atoms/tooltip"

const ENTER_KEY = 13
const TAB_KEY = 9
const BACKSPACE_KEY = 8
const ARROW_LEFT_KEY = 37
const ARROW_RIGHT_KEY = 39

type TagInputProps = {
  onChange: (values: string[]) => void
  onValidate?: (value: string) => void
  label?: string
  showLabel?: boolean
  values: string[]
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  withTooltip?: boolean
  tooltipContent?: string
  tooltip?: React.ReactNode
} & React.InputHTMLAttributes<HTMLInputElement>

const TagInput: React.FC<TagInputProps> = ({
  onChange,
  onValidate,
  values = [],
  label,
  showLabel = true,
  containerProps,
  className,
  required,
  placeholder,
  withTooltip = false,
  tooltipContent,
  tooltip,
  ...props
}) => {
  const [invalid, setInvalid] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAddValue = (newVal) => {
    let update = newVal

    if (typeof onValidate !== "undefined") {
      update = onValidate(newVal)
    }

    if (update) {
      onChange([...values, update])
      if (inputRef?.current) {
        inputRef.current.value = ""
      }
    } else {
      setInvalid(true)
    }
  }

  const handleKeyDown = (e) => {
    if (invalid) {
      setInvalid(false)
    }

    if (!inputRef?.current) {
      return
    }

    const { value, selectionStart } = inputRef.current

    switch (e.keyCode) {
      case ARROW_LEFT_KEY:
        if (highlighted !== -1) {
          // highlight previous element
          if (highlighted > 0) {
            setHighlighted(highlighted - 1)
          }
        } else if (!selectionStart) {
          // else highlight last element
          setHighlighted(values.length - 1)
          e.preventDefault()
        }
        break
      case ARROW_RIGHT_KEY:
        if (highlighted !== -1) {
          // highlight next element
          if (highlighted < values.length - 1) {
            setHighlighted(highlighted + 1)
            e.preventDefault()
          } else {
            // else remove highlighting entirely
            setHighlighted(-1)
          }
        }
        break
      case ENTER_KEY: // Fall through
        e.preventDefault()
        break
      case TAB_KEY: // Creates new tag
        if (value) {
          handleAddValue(value)
          e.preventDefault()
        }
        break

      case BACKSPACE_KEY: // Removes tag
        // if no element is currently highlighted, highlight last element
        if (!inputRef.current.selectionStart && highlighted === -1) {
          setHighlighted(values.length - 1)
          e.preventDefault()
        }
        // if element is highlighted, remove it
        if (highlighted !== -1) {
          const newValues = [...values]
          newValues.splice(highlighted, 1)
          onChange(newValues)
          setHighlighted(-1)
        }
        break
      default:
        // Remove highlight from any tag
        setHighlighted(-1)
    }
  }

  const handleRemove = (index) => {
    const newValues = [...values]
    newValues.splice(index, 1)
    onChange(newValues)
  }

  const handleBlur = (e) => {
    setHighlighted(-1)
  }

  const handleOnContainerFocus = () => {
    inputRef.current?.focus()
  }

  const handleInput = () => {
    if (!inputRef?.current) {
      return
    }

    const value = inputRef.current.value

    if (value?.endsWith(",")) {
      inputRef.current.value = value.slice(0, -1)
      handleAddValue(value.slice(0, -1))
    }
  }

  return (
    <InputContainer
      className={clsx("flex flex-wrap relative", className)}
      onFocus={handleOnContainerFocus}
    >
      {showLabel && (
        <InputHeader
          label={label || "Tags (comma separated)"}
          {...{ required, tooltipContent, tooltip }}
        />
      )}

      <Tooltip
        open={invalid}
        side={"top"}
        content={`${inputRef?.current?.value} is not a valid tag`}
      >
        <div className="w-full flex mt-1 ml-0 flex-wrap">
          {values.map((v, index) => (
            <div
              key={index}
              className={clsx(
                "items-center justify-center whitespace-nowrap w-max bg-grey-90 rounded",
                "px-2 mb-1 mr-2 leading-6",
                {
                  ["bg-grey-70"]: index === highlighted,
                }
              )}
            >
              <div className="inline-block text-grey-0 h-full inter-small-semibold mr-1">
                {v}
              </div>
              <CrossIcon
                className="inline cursor-pointer"
                size="16"
                color="#9CA3AF"
                onClick={() => handleRemove(index)}
              />
            </div>
          ))}
          <input
            id="tag-input"
            ref={inputRef}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onChange={handleInput}
            className={clsx("bg-grey-5 focus:outline-none")}
            placeholder={values?.length ? "" : placeholder} // only visible if no tags exist
            {...props}
          />
        </div>
      </Tooltip>
    </InputContainer>
  )
}

export default TagInput
