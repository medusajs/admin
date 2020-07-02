import React, { useEffect } from "react"

import Button from "../../../components/button"
import { InputField } from "../elements"

const PricesEditor = React.forwardRef(({ onKeyDown, value, onChange }, ref) => {
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <Button ref={ref} variant="primary">
      Update {value.length} prices
    </Button>
  )
})

export default PricesEditor
