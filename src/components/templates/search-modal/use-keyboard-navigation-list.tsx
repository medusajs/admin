import * as React from "react"

const useKeyboardNavigationList = ({ length = 0 }) => {
  const liRefs = React.useRef<Array<HTMLLIElement | null>>([])
  const [selected, setSelected] = React.useState(0)
  const [pressed, setPressed] = React.useState(false)

  const getInputProps = () => {
    return {
      "aria-activedescendant": `product-item-${selected}`,
      "aria-controls": "results-menu",
      onKeyDown: (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelected((selected) => Math.min(selected + 1, length - 1))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelected((selected) => Math.max(selected - 1, 0))
        }
      },
    }
  }

  const getLIProps = ({ index, ...props }) => {
    return {
      tabIndex: index,
      role: "option",
      id: `product-item-${index}`,
      "aria-selected": selected === index,
      ref: (el) => {
        liRefs.current[index] = el
      },
      onMouseEnter: () => {
        setSelected(index)
      },
      ...props,
    }
  }

  const getULProps = () => {
    return {
      tabIndex: 0,
      role: "listbox",
      id: "results-menu",
    }
  }

  const enterHandler = (e) => {
    if (e.key === "Enter") {
      console.log("enter clicked")
      setPressed(true)
    }
  }

  React.useEffect(() => {
    if (pressed) {
      liRefs.current[selected]?.children[0].click()
    }
  }, [pressed, selected])

  React.useEffect(() => {
    window.addEventListener("keydown", enterHandler)
    return () => {
      window.removeEventListener("keydown", enterHandler)
    }
  }, [])

  return {
    getInputProps,
    getLIProps,
    getULProps,
    selected,
  } as const
}

export default useKeyboardNavigationList
