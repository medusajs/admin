import React, {
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"
import Modal, { ModalProps } from "../../molecules/modal"
import Button from "../../fundamentals/button"
import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"
import InputField from "../../molecules/input"
import ArrowLeftIcon from "../../fundamentals/icons/arrow-left-icon"
import clsx from "clsx"

enum LayeredModalActions {
  PUSH,
  POP,
  RESET,
}

type LayeredModalScreen = {
  title: string
  onBack: () => void
  onConfirm: () => void
  view: ReactNode
}

export type ILayeredModalContext = {
  screens: LayeredModalScreen[]
  push: (screen: ReactNode) => void
  pop: () => void
  reset: () => void
}

const defaultContext: ILayeredModalContext = {
  screens: [],
  push: (screen) => {},
  pop: () => {},
  reset: () => {},
}

export const LayeredModalContext = React.createContext(defaultContext)

const reducer = (state, action) => {
  switch (action.type) {
    case LayeredModalActions.PUSH: {
      state.screens.push(action.payload)
      return { ...state }
    }
    case LayeredModalActions.POP: {
      state.screens.pop()
      return { ...state }
    }
    case LayeredModalActions.RESET: {
      return { ...state, screens: [] }
    }
  }
}

type LayeredModalProps = {
  context: ILayeredModalContext
} & ModalProps

export const LayeredModalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultContext)

  return (
    <LayeredModalContext.Provider
      value={{
        ...state,
        push: (screen: LayeredModalScreen) => {
          dispatch({ type: LayeredModalActions.PUSH, payload: screen })
        },

        pop: () => {
          dispatch({ type: LayeredModalActions.POP })
        },

        reset: () => {
          dispatch({ type: LayeredModalActions.RESET })
        },
      }}
    >
      {children}
    </LayeredModalContext.Provider>
  )
}

const addProp = (children, prop) => {
  return React.Children.map(children, (child) =>
    React.cloneElement(child, prop)
  )
}

const LayeredModal: React.FC<LayeredModalProps> = ({
  context,
  children,
  handleClose,
  isLargeModal = true,
}) => {
  const emptyScreensAndClose = () => {
    context.reset()
    handleClose()
  }

  const screen = context.screens[context.screens.length - 1]
  return (
    <Modal isLargeModal={isLargeModal} handleClose={emptyScreensAndClose}>
      <Modal.Body
        className={clsx(
          "transition-transform translate-x-full flex flex-col justify-between duration-200",
          {
            "translate-x-0": typeof screen !== "undefined",
          }
        )}
        isLargeModal={isLargeModal}
      >
        {screen ? (
          <>
            <Modal.Header handleClose={emptyScreensAndClose}>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="small"
                  className="text-grey-50 w-8 h-8"
                  onClick={screen.onBack}
                >
                  <ArrowLeftIcon size={20} />
                </Button>
                <h2 className="inter-xlarge-semibold ml-5">{screen.title}</h2>
              </div>
            </Modal.Header>
            {screen.view}
          </>
        ) : (
          <></>
        )}
      </Modal.Body>
      <div
        className={clsx("transition-transform duration-200", {
          "-translate-x-full": typeof screen !== "undefined",
        })}
      >
        <div
          className={clsx("transition-display", {
            "hidden opacity-0 delay-500": typeof screen !== "undefined",
          })}
        >
          {addProp(children, { isLargeModal })}
        </div>
      </div>
    </Modal>
  )
}

export const useLayeredModal = () => {
  const context = useContext(LayeredModalContext)
  if (context === null) {
    throw new Error(
      "useLayeredModal must be used within a LayeredModalProvider"
    )
  }
  return context
}

export default LayeredModal
