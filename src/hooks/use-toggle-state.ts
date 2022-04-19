import * as React from "react"

type StateType = [boolean, () => void, () => void, () => void] & {
  state: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

const useToggleState = (initialState = false) => {
  const [state, setState] = React.useState<boolean>(initialState)

  const close = React.useCallback(() => {
    setState(false)
  }, [state])

  const open = React.useCallback(() => {
    setState(true)
  }, [state])

  const toggle = React.useCallback(() => {
    setState((state) => !state)
  }, [state])

  const p = [state, open, close, toggle] as StateType
  p.state = state
  p.open = open
  p.close = close
  p.toggle = toggle
  return p
}

export default useToggleState
