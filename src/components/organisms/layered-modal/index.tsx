import React, { ReactNode, useState } from "react"
import Modal from "../../molecules/modal"
import Button from "../../fundamentals/button"
import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"
import InputField from "../../molecules/input"

enum LayeredModalActions {
  PUSH,
  POP,
}

type LayeredModalScreen = {
  title: string
  onBack: () => void
  onConfirm: () => void
  view: ReactNode
}

type ILayeredModalContext = {
  screens: LayeredModalScreen[]
  push: () => void
  pop: () => void
}

const defaultContext = {
  screens: [],
}

const reducer = (state, action) => {
  switch (action.type) {
    case LayeredModalActions.PUSH: {
      state.screens.push(action.payload)
      return state
    }
    case LayeredModalActions.POP: {
      state.screens.pop()
      return state
    }
  }
}

type LayeredModalProps = {
  context: ILayeredModalContext
  children: ReactNode
}

export const  = ({ children }) => {
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

const LayeredModal: React.FC<LayeredModalProps> = ({ context, children }) => {
  return (
    <Modal handleClose={handleClose}>
      {children}
      {context.screens
    </Modal>
  )
}

export default LayeredModal
