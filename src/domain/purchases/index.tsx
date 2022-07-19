import { Field, FieldGroup, OneForm } from "@oneform/react"
import React from "react"
import { useCallback } from "react"
import { useMedusaQuery } from "./helper"

const FieldGroupSubmissionExample = () => {
  const { data } = useMedusaQuery({ limit: 10, offset: 0 })

  const formSubmitted = useCallback(({ registeredValues }) => {
    console.log(registeredValues)
  }, [])

  return (
    <OneForm onSubmit={formSubmitted}>
      <FieldGroup id="1" name="addressId">
        <Field>
          <input name="name" />
        </Field>
      </FieldGroup>
      {data && JSON.stringify(data, null, 2)}
    </OneForm>
  )
}

export default FieldGroupSubmissionExample
