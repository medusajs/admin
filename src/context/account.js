import React, { useReducer } from "react"
import Medusa from "../services/api"

export const defaultAccountContext = {
  isLoggedIn: false,
  id: "",
  name: "",
  first_name: "",
  last_name: "",
  email: "",
  api_token: "",
}

export const AccountContext = React.createContext(defaultAccountContext)

const reducer = (state, action) => {
  switch (action.type) {
    case "userAuthenticated":
      return {
        ...state,
        isLoggedIn: true,
        id: action.payload.id,
        email: action.payload.email,
        first_name: action.payload?.first_name,
        last_name: action.payload?.last_name,
        api_token: action.payload?.api_token,
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
        first_name: action.payload?.first_name,
        last_name: action.payload?.last_name,
        api_token: action.payload?.api_token,
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

        handleUpdateUser: (id, user) => {
          return Medusa.users.update(id, user).then(({ data }) => {
            dispatch({ type: "updateUser", payload: data.user })
          })
        },

        handleLogout: (details) => {
          return Medusa.auth.deauthenticate(details).then(() => {
            dispatch({ type: "userLoggedOut" })
            return null
          })
        },

        handleLogin: (details) => {
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
