import React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { trimValues } from "../../../../utils/trim-values"
import { CreatePriceListFormValues } from "../types"

const defaultState: CreatePriceListFormValues = {
  customer_groups: null,
  name: "",
  description: null,
  end_date: null,
  start_date: null,
  prices: [],
}

const CreatePriceListFormContext = React.createContext<{
  onSubmit: (values: CreatePriceListFormValues) => void
} | null>(null)

type FormProviderProps = {
  priceList?: CreatePriceListFormValues
  onSubmit: (values: CreatePriceListFormValues) => void
}

export const CreatePriceListFormProvider: React.FC<FormProviderProps> = ({
  priceList = defaultState,
  onSubmit,
  children,
}) => {
  const methods = useForm<CreatePriceListFormValues>()

  const handleSubmit = (values: CreatePriceListFormValues) => {
    onSubmit(trimValues<CreatePriceListFormValues>(values))
  }

  return (
    <FormProvider {...methods}>
      <CreatePriceListFormContext.Provider
        value={{
          onSubmit: handleSubmit,
        }}
      >
        {children}
      </CreatePriceListFormContext.Provider>
    </FormProvider>
  )
}

export const useCreatePriceListForm = () => {
  const context = React.useContext(CreatePriceListFormContext)
  const form = useForm<CreatePriceListFormValues>()
  if (context === null) {
    throw new Error(
      "useCreatePriceListForm must be used within a CreatePriceListFormProvider"
    )
  }
  return { ...form, ...context }
}
