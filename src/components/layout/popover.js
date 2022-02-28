import styled from "@emotion/styled"
import React, { useRef } from "react"
import ReactTooltip from "react-tooltip"
import Typography from "../typography"

const Tooltip = styled(ReactTooltip)`
  ${Typography.Base};
  box-shadow: ${(props) => props.theme.shadows.popover} !important;
  padding: 0 !important;
  border: none !important;
  overflow: hidden;
  &.show {
    opacity: 1 !important;
  }
  &.place-bottom::before {
    border-bottom: 5.9px solid #e1e1e1 !important;
    border-left-width: 9px !important;
    border-right-width: 9px !important;
    margin-left: -9px !important;
  }
  &.place-bottom::after {
    border-bottom-width: 6px !important;
  }
`

const computePosition = (position, event, triggerElement, tooltipElement) => {
  const id = triggerElement.getAttribute("aria-describedby")
  const arrowLeft =
    triggerElement.getBoundingClientRect().left + triggerElement.offsetWidth / 2
  const arrowTop =
    triggerElement.getBoundingClientRect().top + triggerElement.offsetHeight + 2
  const leftPosition = arrowLeft - (tooltipElement.clientWidth - 30)

  const oldSheet = document.getElementById(`tooltip-styles-${id}`)
  if (oldSheet) {
    document.body.removeChild(oldSheet)
  }

  const sheet = document.createElement("style")
  sheet.setAttribute("id", "tooltip-styles")

  sheet.innerHTML = `
    .__react_component_tooltip.${id}.place-bottom::after {
      position: fixed;
      top: ${arrowTop}px;
      left: ${arrowLeft}px;
    }
    .__react_component_tooltip.${id}.place-bottom::before {
      position: fixed;
      top: ${arrowTop - 1}px;
      left: ${arrowLeft}px;
    }
  `
  document.body.appendChild(sheet)
  return {
    top: position.top - 2,
    left: leftPosition,
  }
}

const Popover = ({ children, id }) => {
  const ref = useRef()
  const forceClose = (e) => {
    const current = ref.current
    current.tooltipRef = null
    ReactTooltip.hide()
  }

  const rebuildPopover = (e) => {
    ReactTooltip.rebuild()
  }

  return (
    <Tooltip
      border={true}
      ref={ref}
      textColor="black"
      backgroundColor="white"
      arrowColor="white"
      effect="solid"
      clickable={true}
      globalEventOff={"click"}
      isCapture={true}
      id={id}
      place="bottom"
      overridePosition={computePosition}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { forceClose, rebuildPopover })
        }
        return child
      })}
    </Tooltip>
  )
}

export default Popover
