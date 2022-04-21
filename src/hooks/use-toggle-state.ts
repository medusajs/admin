import * as React from "react"

type StateType = [boolean, () => void, () => void, () => void] & {
  state: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 *
 * @param initialState - boolean
 * @returns An array like object with `state`, `open`, `close`, and `toggle` properties
 *  to allow both object and array destructuring
 *
 * ```
 *  const [showModal, openModal, closeModal, toggleModal] = useToggleState()
 *  // or
 *  const { state, open, close, toggle } = useToggleState()
 * ```
 */

const useToggleState = (initialState = false) => {
  const [state, setState] = React.useState<boolean>(initialState)

  const close = () => {
    setState(false)
  }

  const open = () => {
    setState(true)
  }

  const toggle = () => {
    setState((state) => !state)
  }

  const p = [state, open, close, toggle] as StateType
  p.state = state
  p.open = open
  p.close = close
  p.toggle = toggle
  return p
}

export default useToggleState
