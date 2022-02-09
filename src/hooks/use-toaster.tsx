import React from "react"
import { AppearanceTypes, useToasts } from "react-toast-notifications"
import Toaster from "../components/atoms/toaster"

const useToaster = () => {
  const { addToast } = useToasts()

  return (title: string, message: string, appearance: AppearanceTypes) => {
    const content = <Toaster.Content title={title} message={message} />
    return addToast(content, {
      appearance,
    })
  }
}

export default useToaster
