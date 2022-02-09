import React, { useEffect, useRef, useState } from "react"
import {
  AppearanceTypes,
  Placement,
  ToastProps,
} from "react-toast-notifications"
import AlertIcon from "../../fundamentals/icons/alert-icon"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import InfoIcon from "../../fundamentals/icons/info-icon"
import XCircleIcon from "../../fundamentals/icons/x-circle-icon"

type ToasterContentProps = {
  message: string
  title: string
}

const ICON_SIZE = 20

const toastStates = (placement: Placement) => ({
  entering: { transform: getTranslate(placement) },
  entered: { transform: "translate3d(0,0,0)" },
  exiting: { transform: "scale(0.66)", opacity: 0 },
  exited: { transform: "scale(0.66)", opacity: 0 },
})

const Container: React.FC<ToastProps> = ({
  children,
  transitionDuration,
  transitionState,
  appearance,
  placement,
  onDismiss,
}) => {
  const [height, setHeight] = useState<string | number>("auto")
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (transitionState === "entered") {
      const el = elementRef.current
      if (el) {
        setHeight(el.offsetHeight + 8)
      }
    }
    if (transitionState === "exiting") {
      setHeight(0)
    }
  }, [transitionState])

  return (
    <div
      ref={elementRef}
      style={{
        height,
        transition: `height ${transitionDuration - 100}ms 100ms`,
      }}
    >
      <div
        className="flex items-start bg-grey-0 p-base border border-grey-20 rounded-rounded shadow-toaster w-[380px] mb-xsmall last:mb-0"
        style={{
          transitionDuration: `${transitionDuration}ms`,
          transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
          zIndex: 1000,
          ...toastStates(placement)[transitionState],
        }}
      >
        <div>{getIcon(appearance)}</div>
        <div className="flex flex-col ml-small mr-base gap-y-2xsmall flex-grow">
          {children}
        </div>
        <div>
          {/* @ts-ignore:next-line */}
          <div role="button" onClick={onDismiss} className="cursor-pointer">
            <CrossIcon size={ICON_SIZE} className="text-grey-40" />
          </div>
          <span className="sr-only">Close</span>
        </div>
      </div>
    </div>
  )
}

const Content: React.FC<ToasterContentProps> = ({ title, message }) => {
  return (
    <>
      <span className="inter-small-semibold">{title}</span>
      <span className="inter-small-regular text-grey-50">{message}</span>
    </>
  )
}

function getIcon(appearance: AppearanceTypes) {
  switch (appearance) {
    case "success":
      return <CheckCircleIcon size={ICON_SIZE} className="text-emerald-40" />
    case "warning":
      return <AlertIcon size={ICON_SIZE} className="text-orange-40" />
    case "error":
      return <XCircleIcon size={ICON_SIZE} className="text-rose-40" />
    default:
      return <InfoIcon size={ICON_SIZE} className="text-grey-40" />
  }
}

function getTranslate(placement: Placement) {
  const pos = placement.split("-")
  const relevantPlacement = pos[1] === "center" ? pos[0] : pos[1]
  const translateMap = {
    right: "translate3d(120%, 0, 0)",
    left: "translate3d(-120%, 0, 0)",
    bottom: "translate3d(0, 120%, 0)",
    top: "translate3d(0, -120%, 0)",
  }

  return translateMap[relevantPlacement]
}

export default { Container, Content }
