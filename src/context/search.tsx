import * as React from "react"
import { useHotkeys } from "react-hotkeys-hook"

export const defaultSearchContext = {
  onSearch: (query) => {},
  setOnSearch: (query) => {},
  onUnmount: () => {},
  display: false,
}

export const SearchContext = React.createContext(defaultInterfaceContext)

export const SearchProvider = ({ children }) => {
  const [showSearchModal, setShowSearchModal] = useState(false)

  const openSearch = () => {
    setShowSearchModal(true)
  }

  useHotkeys("cmd+k", hotKeyFocus, {}, [])
  useHotkeys("ctrl+k", hotKeyFocus, {}, [])

  return (
    <SearchContext.Provider
      value={{
        openSearch,
        showSearchModal,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
