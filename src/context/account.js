import React, { useReducer } from "react"

import Medusa from "../services/api"

export const defaultAccountContext = {
  isLoggedIn: false,
  id: "",
  name: "",
  firstName: "",
  lastName: "",
  email: "",
}

export const AccountContext = React.createContext(defaultAccountContext)

const reducer = (state, action) => {
  console.log(action.payload)
  switch (action.type) {
    case "userAuthenticated":
      return {
        ...state,
        isLoggedIn: true,
        id: action.payload.id,
        email: action.payload.email,
        firstName: action.payload?.first_name,
        lastName: action.payload?.last_name,
      }
    case "updateUser":
      return {
        ...state,
        ...action.payload,
      }
    case "userLoggedOut":
      return defaultAccountContext
    case "userLoggedIn":
      return {
        ...state,
        isLoggedIn: true,
        id: action.payload.id,
        email: action.payload.email,
        firstName: action.payload?.first_name,
        lastName: action.payload?.last_name,
      }
    default:
      return state
  }
}

export const AccountProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultAccountContext)

  return (
    <AccountContext.Provider
      value={{
        ...state,
        session: () => {
          return Medusa.auth.session().then(({ data }) => {
            dispatch({ type: "userAuthenticated", payload: data.user })
            return data
          })
        },

        handleUpdateUser: user => {
          console.log(user)
          dispatch({ type: "updateUser", payload: user })
        },

        handleLogout: details => {
          return Medusa.auth.deauthenticate(details).then(() => {
            dispatch({ type: "userLoggedOut" })
            return null
          })
        },

        handleLogin: details => {
          return Medusa.auth.authenticate(details).then(({ data }) => {
            dispatch({ type: "userLoggedIn", payload: data.user })
            return data
          })
        },
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
