import React from "react"
import { ButtonContainer } from "./elements"

const Button = ({ children, className, dark, large }) => {
  return (
    <ButtonContainer dark={dark} large={large} className={className}>
      {children}
    </ButtonContainer>
  )
}

export default Button
