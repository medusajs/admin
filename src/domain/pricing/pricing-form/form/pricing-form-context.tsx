import React, { useState } from "react"
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
  SubmitHandler,
} from "react-hook-form"
import { weekFromNow } from "../../../../utils/date-utils"
import {
  ConfigurationField,
  CreatePriceListPricesFormValues,
  PriceListFormValues,
  PriceListType,
} from "../types"

const defaultState: PriceListFormValues = {
  customer_groups: [],
  name: null,
  description: null,
  ends_at: null,
  starts_at: null,
  prices: null,
  type: PriceListType.SALE,
}

const PriceListFormContext = React.createContext<{
  configFields: Record<ConfigurationField, unknown>
  handleConfigurationSwitch: (values: string[]) => void
  prices: CreatePriceListPricesFormValues | null
  setPrices: React.Dispatch<
    React.SetStateAction<CreatePriceListPricesFormValues | null>
  >
  handleSubmit: <T>(
    submitHandler: SubmitHandler<T>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>
} | null>(null)

type FormProviderProps = {
  priceList?: PriceListFormValues
}

export const PriceListFormProvider: React.FC<FormProviderProps> = ({
  priceList = defaultState,
  children,
}) => {
  const [configFields, setConfigFields] = useState<
    Record<ConfigurationField, unknown>
  >({
    customer_groups: priceList.customer_groups,
    ends_at: priceList.ends_at,
    starts_at: priceList.starts_at,
  })
  const methods = useForm<PriceListFormValues>({
    defaultValues: priceList,
  })

  const [prices, setPrices] = useState<CreatePriceListPricesFormValues | null>(
    null
  )

  const currentStartsAt = useWatch({
    name: "starts_at",
    control: methods.control,
  })
  const currentEndsAt = useWatch({
    name: "ends_at",
    control: methods.control,
  })
  const currentCustomerGroups = useWatch({
    name: "customer_groups",
    control: methods.control,
  })

  const disableConfiguration = (configField: ConfigurationField) => {
    let configToSave: unknown | null = null

    switch (configField) {
      case ConfigurationField.CUSTOMER_GROUPS:
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

    // use timeout to avoid flashing default value
    setTimeout(() => methods.setValue(configField, null), 300)
  }

  const enableConfiguration = (configField: ConfigurationField) => {
    // we get the configuration field value from the state, so that if the user re-enables the field we can populate it with the previous value
    if (configFields[configField]) {
      methods.setValue(configField, configFields[configField])
    } else {
      // if the configuration field value is null, we set a default value
      switch (configField) {
        case ConfigurationField.STARTS_AT:
          methods.setValue(configField, new Date())
          break
        case ConfigurationField.ENDS_AT:
          methods.setValue(configField, weekFromNow())
          break
        case ConfigurationField.CUSTOMER_GROUPS:
          methods.setValue(configField, [])
          break
      }
    }
  }

  const handleConfigurationSwitch = (values: string[]) => {
    for (const key of Object.keys(configFields)) {
      if (values.includes(key)) {
        enableConfiguration(key as ConfigurationField)
      } else {
        disableConfiguration(key as ConfigurationField)
      }
    }
  }

  const handleSubmit = (submitHandler) => {
    return methods.handleSubmit((values) => {
      submitHandler({ ...values, prices })
    })
  }

  return (
    <FormProvider {...methods}>
      <PriceListFormContext.Provider
        value={{
          configFields,
          handleConfigurationSwitch,
          prices,
          handleSubmit,
          setPrices,
        }}
      >
        {children}
      </PriceListFormContext.Provider>
    </FormProvider>
  )
}

export const usePriceListForm = () => {
  const context = React.useContext(PriceListFormContext)
  const form = useFormContext()
  if (context === null) {
    throw new Error(
      "usePriceListForm must be used within a PriceListFormProvider"
    )
  }
  return { ...form, ...context }
}
