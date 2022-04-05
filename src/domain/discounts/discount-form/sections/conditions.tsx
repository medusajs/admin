import React from "react"
import { useDiscountForm } from "../form/discount-form-context"

const Conditions = () => {
  const { conditions } = useDiscountForm()
  return (
    <div>
      {Object.keys(conditions).map((key) => {
        return (
          conditions[key] && (
            <div>
              <p>{key}</p>
              <pre>{JSON.stringify(conditions[key], null, 2)}</pre>
            </div>
          )
        )
      })}
    </div>
  )
}

export default Conditions
