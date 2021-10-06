import React, { useState, useReducer } from "react"

export const defaultInterfaceContext = {
  onSearch: () => {},
  setOnSearch: () => {},
}

export const InterfaceContext = React.createContext(defaultInterfaceContext)

const reducer = (state, action) => {
  switch (action.type) {
    case "registerHandler":
      return {
        ...state,
        onSearch: action.payload,
      }
    default:
      return state
  }
}

export const InterfaceProvider = ({ children }) => {
  const [searchHandler, setSearchHandler] = useState(() => () => {})

  const setOnSearch = handler => {
    if (handler) {
      setSearchHandler(() => {
        return handler
      })
    }
  }

  return (
    <InterfaceContext.Provider
      value={{
        onSearch: searchHandler,
        setOnSearch,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  )
}
