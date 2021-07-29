import React, { useState, useCallback } from "react"

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  return { isOpen, handleClose, handleOpen }
}

export default useModal
