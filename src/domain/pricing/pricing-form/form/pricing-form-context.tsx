import React, { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { trimValues } from "../../../../utils/trim-values"
import { ConfigurationField, CreatePriceListFormValues } from "../types"

const defaultState: CreatePriceListFormValues = {
  customer_groups: null,
  name: null,
  description: null,
  ends_at: null,
  starts_at: null,
  prices: null,
}

const CreatePriceListFormContext = React.createContext<{
  configFields: Record<ConfigurationField, unknown>
  handleConfigurationSwitch: (
    switchState: boolean,
    field: ConfigurationField
  ) => void
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
  const [configFields, setConfigFields] = useState<
    Record<ConfigurationField, unknown>
  >({
    customer_groups: priceList.customer_groups,
    ends_at: priceList.ends_at,
    starts_at: priceList.starts_at,
  })
  const methods = useForm<CreatePriceListFormValues>({
    defaultValues: priceList,
  })

  const handleSubmit = (values: CreatePriceListFormValues) => {
    onSubmit(trimValues<CreatePriceListFormValues>(values))
  }

  const currentStartsAt = methods.watch("starts_at", priceList.starts_at)
  const currentEndsAt = methods.watch("ends_at", priceList.ends_at)
  const currentCustomerGroups = methods.watch(
    "customer_groups",
    priceList.customer_groups
  )
  const currentName = methods.watch("name", priceList.name)

  useEffect(() => {
    console.log("currentStartsAt", currentStartsAt)
    console.log("currentEndsAt", currentEndsAt)
    console.log("currentCustomerGroups", currentCustomerGroups)
    console.log("currentName", currentName)
  }, [currentStartsAt, currentEndsAt, currentCustomerGroups, currentName])

  const disableConfiguration = (configField: ConfigurationField) => {
    let configToSave: unknown | null = null

    switch (configField) {
      case ConfigurationField.CUSTOMER_GROUPS:
        console.log("customer groups", currentCustomerGroups)
        configToSave = currentCustomerGroups
        break
      case ConfigurationField.STARTS_AT:
        configToSave = currentStartsAt
        break
      case ConfigurationField.ENDS_AT:
        configToSave = currentEndsAt
        break
    }

    // we save the configuration field value to the state, so that if the user re-enables the field we can populate it with the previous value
    setConfigFields({
      ...configFields,
      [configField]: configToSave,
    })

    methods.setValue(configField, null)
  }

  const enableConfiguration = (configField: ConfigurationField) => {
    if (configFields[configField]) {
      methods.setValue(configField, configFields[configField])
    } else {
      switch (configField) {
        case ConfigurationField.STARTS_AT:
          methods.setValue(configField, new Date())
          break
        case ConfigurationField.ENDS_AT:
          methods.setValue(configField, new Date())
          break
        case ConfigurationField.CUSTOMER_GROUPS:
          break
      }
    }
  }

  const handleConfigurationSwitch = (
    switchState: boolean,
    configField: ConfigurationField
  ) => {
    if (switchState) {
      enableConfiguration(configField)
    } else {
      disableConfiguration(configField)
    }
  }

  return (
    <FormProvider {...methods}>
      <CreatePriceListFormContext.Provider
        value={{
          configFields,
          handleConfigurationSwitch,
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
