import * as React from "react"

const useKeyboardNavigationList = ({ length = 0 }) => {
  const liRefs = React.useRef<Array<HTMLLIElement | null>>([])
  const [selected, setSelected] = React.useState(0)
  const [pressed, setPressed] = React.useState(false)

  const getInputProps = () => {
    return {
      "aria-activedescendant": `result-item-${selected}`,
      "aria-controls": "results-list",
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
      id: `result-item-${index}`,
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
      id: "results-list",
    }
  }

  const enterHandler = (e) => {
    if (e.key === "Enter") {
      setPressed(true)
    }
  }

  React.useEffect(() => {
    if (pressed) {
      const child = liRefs.current[selected]?.children[0] as HTMLAnchorElement
      child?.click()
    }
  }, [pressed, selected])

  React.useLayoutEffect(() => {
    if (liRefs.current[selected]) {
      liRefs.current[selected]?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }
  }, [selected])

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
