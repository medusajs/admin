import React from "react"
import { AppearanceTypes } from "react-toast-notifications"

type ToasterProps = {
  apperance: AppearanceTypes
  message: string
  title: string
}

const Toaster: React.FC<ToasterProps> = ({ apperance, message, title }) => {
  return (
    <div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}

export default Toaster
