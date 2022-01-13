import * as React from "react"
import { useToasts } from "react-toast-notifications"
import ToastLabel from "../components/toast"

const useToaster = () => {
  const { addToast } = useToasts()

  return (text, type) => {
    return addToast(<ToastLabel>{text}</ToastLabel>, { appearance: type })
  }
}

export default useToaster
