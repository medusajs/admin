import clsx from "clsx"
import React, { ReactNode, useReducer } from "react"
import useToggleState from "../../../hooks/use-toggle-state"
import Button from "../../fundamentals/button"
import Modal, { ModalProps } from "../../molecules/modal"
import LayeredModal, { ILayeredModalContext } from "./layered-modal"

enum SteppedActions {
  ENABLENEXTPAGE,
  DISABLENEXTPAGE,
  GOTONEXTPAGE,
  GOTOPREVIOUSPAGE,
  SETPAGE,
  SUBMIT,
  RESET,
}

type ISteppedContext = {
  currentStep: number
  nextStepEnabled: boolean
  enableNextPage: () => void
  disableNextPage: () => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  submit: () => void
  reset: () => void
  setPage: (page: number) => void
}

const defaultContext: ISteppedContext = {
  currentStep: 0,
  nextStepEnabled: true,
  enableNextPage: () => {},
  disableNextPage: () => {},
  goToNextPage: () => {},
  goToPreviousPage: () => {},
  submit: () => {},
  reset: () => {},
  setPage: (page) => {},
}

export const SteppedContext = React.createContext(defaultContext)

const reducer = (state, action) => {
  switch (action.type) {
    case SteppedActions.ENABLENEXTPAGE: {
      state.nextStepEnabled = true
      return { ...state }
    }
    case SteppedActions.DISABLENEXTPAGE: {
      state.nextStepEnabled = false
      return { ...state }
    }
    case SteppedActions.GOTONEXTPAGE: {
      state.currentStep = state.currentStep + 1
      return { ...state }
    }
    case SteppedActions.GOTOPREVIOUSPAGE: {
      if (state.currentStep !== 0) {
        state.currentStep = state.currentStep - 1
      }
      return { ...state }
    }
    case SteppedActions.SETPAGE: {
      if (action.payload > 0) {
        state.currentStep = action.payload
      }
      return { ...state }
    }
    case SteppedActions.SUBMIT: {
      return { ...state }
    }
    case SteppedActions.RESET: {
      return { ...state, currentStep: 0, nextStepEnabled: true }
    }
  }
}

type SteppedProps = {
  context: ISteppedContext
  title: string
  onSubmit: () => void
  lastScreenIsSummary?: boolean
  steps: ReactNode[]
  layeredContext?: ILayeredModalContext
} & ModalProps

export const SteppedProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultContext)

  return (
    <SteppedContext.Provider
      value={{
        ...state,
        enableNextPage: () => {
          dispatch({ type: SteppedActions.ENABLENEXTPAGE })
        },
        disableNextPage: () => {
          dispatch({ type: SteppedActions.DISABLENEXTPAGE })
        },
        goToNextPage: () => {
          dispatch({ type: SteppedActions.GOTONEXTPAGE })
        },
        goToPreviousPage: () => {
          dispatch({ type: SteppedActions.GOTOPREVIOUSPAGE })
        },
        submit: () => {
          dispatch({ type: SteppedActions.SUBMIT })
        },
        setPage: (page: number) => {
          dispatch({ type: SteppedActions.SETPAGE, payload: page })
        },
        reset: () => {
          dispatch({ type: SteppedActions.RESET })
        },
      }}
    >
      {children}
    </SteppedContext.Provider>
  )
}

const SteppedModal: React.FC<SteppedProps> = ({
  context,
  steps,
  layeredContext,
  title,
  onSubmit,
  lastScreenIsSummary = false,
  handleClose,
  isLargeModal = true,
}) => {
  const resetAndClose = () => {
    context.reset()
    handleClose()
  }

  const resetAndSubmit = () => {
    onSubmit()
  }
  return (
    <ModalElement
      layeredContext={layeredContext}
      isLargeModal={isLargeModal}
      handleClose={resetAndClose}
    >
      <Modal.Body
        className={clsx(
          "transition-transform flex flex-col justify-between duration-100 max-h-full"
        )}
      >
        <Modal.Header handleClose={resetAndClose}>
          <div className="flex flex-col">
            <h2 className="inter-xlarge-semibold">{title}</h2>
            {!lastScreenIsSummary ||
              (lastScreenIsSummary &&
                context.currentStep !== steps.length - 1 && (
                  <div className="flex items-center">
                    <span className="text-grey-50 inter-small-regular w-[70px] mr-4">{`Step ${
                      context.currentStep + 1
                    } of ${steps.length}`}</span>
                    {steps.map((_, i) => (
                      <span
                        key={i}
                        className={clsx(
                          "w-2 h-2 rounded-full mr-3",
                          {
                            "bg-grey-20": i > context.currentStep,
                            "bg-violet-60": context.currentStep >= i,
                          },
                          {
                            "outline-4 outline outline-violet-20":
                              context.currentStep === i,
                          }
                        )}
                      />
                    ))}
                  </div>
                ))}
          </div>
        </Modal.Header>
        <Modal.Content>{steps[context.currentStep]}</Modal.Content>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex justify-end w-full gap-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            disabled={context.currentStep === 0}
            onClick={() => context.goToPreviousPage()}
            className="w-[112px]"
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="small"
            disabled={!context.nextStepEnabled}
            onClick={() =>
              context.currentStep === steps.length - 1
                ? resetAndSubmit()
                : context.goToNextPage()
            }
            className="w-[112px]"
          >
            {context.currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </Modal.Footer>
    </ModalElement>
  )
}

const ModalElement = ({
  layeredContext,
  handleClose,
  isLargeModal = true,
  children,
}) =>
  layeredContext ? (
    <LayeredModal
      context={layeredContext}
      handleClose={handleClose}
      isLargeModal={isLargeModal}
    >
      {children}
    </LayeredModal>
  ) : (
    <Modal handleClose={handleClose} isLargeModal={isLargeModal}>
      {children}
    </Modal>
  )

export default SteppedModal
