import React, { useCallback, useContext, useRef, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { InterfaceContext } from "../../context/interface"
import OSShortcut from "../atoms/os-shortcut"
import SearchInput from "../atoms/search-input"
import SearchIcon from "../fundamentals/icons/search-icon"

const SearchBar = () => {
  const { onSearch } = useContext(InterfaceContext)
  const [query, setQuery] = useState("")
  const [focusing, setFocusing] = useState(false)
  const searchRef = useRef(null)

  const hotKeyFocus = () => {
    if (searchRef && searchRef.current) {
      setFocusing(true)
      searchRef.current.focus()
      return false
    }
  }

  const onKeyDown = useCallback(
    event => {
      switch (event.key) {
        case "Enter":
          event.preventDefault()
          event.stopPropagation()
          if (onSearch) {
            onSearch(query)
          }
          searchRef.current.blur()
          break
        case "Esc":
        case "Escape":
          searchRef.current.blur()
          break
        default:
          break
      }
    },
    [onSearch, query]
  )

  const handleChange = e => {
    if (focusing) {
      setFocusing(false)
      return
    } else {
      setQuery(e.target.value)
    }
  }

  useHotkeys("cmd+k", hotKeyFocus, {}, [searchRef])
  useHotkeys("ctrl+k", hotKeyFocus, {}, [searchRef])

  return (
    <div className="flex items-cente">
      <SearchIcon className="text-grey-40" />
      <div className="mr-xsmall ml-base">
        <OSShortcut />
      </div>
      <SearchInput
        value={query}
        onKeyDown={onKeyDown}
        onChange={handleChange}
        ref={searchRef}
        placeholder="Search anything..."
      />
    </div>
  )
}

export default SearchBar
