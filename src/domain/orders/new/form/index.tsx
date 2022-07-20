import { Region } from "@medusajs/medusa"
import { useAdminRegion, useAdminShippingOptions } from "medusa-react"
import React, { createContext, ReactNode, useContext, useMemo } from "react"
import {
  FormProvider,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { AddressPayload } from "../../../../components/templates/address-form"
import { Option } from "../../../../types/shared"

type NewOrderForm = {
  shipping_address: AddressPayload | null
  billing_address: AddressPayload | null
  region: Option | null
}

type NewOrderContextValue = {
  validCountries: Option[]
  region: Region | undefined
}

const NewOrderContext = createContext<NewOrderContextValue | null>(null)

const NewOrderFormProvider = ({ children }: { children?: ReactNode }) => {
  const form = useForm<NewOrderForm>()

  //   const pay: AdminPostDraftOrdersReq = {}

  const selectedRegion = useWatch({ control: form.control, name: "region" })
  const { region } = useAdminRegion(selectedRegion?.value!, {
    enabled: !!selectedRegion,
  })

  const validCountries = useMemo(() => {
    if (!region) {
      return []
    }

    return region.countries.map((country) => ({
      label: country.display_name,
      value: country.iso_2,
    }))
  }, [region])

  const { shipping_options } = useAdminShippingOptions(
    {
      region_id: region?.id,
      is_return: false,
    },
    {
      enabled: !!region,
    }
  )

  const validShippingOptions = useMemo(() => {}, [shipping_options])

  return (
    <NewOrderContext.Provider
      value={{
        validCountries,
        region,
      }}
    >
      <FormProvider {...form}>{children}</FormProvider>
    </NewOrderContext.Provider>
  )
}

export const useNewOrderForm = () => {
  const context = useContext(NewOrderContext)
  const form = useFormContext<NewOrderForm>()

  if (!context) {
    throw new Error("useNewOrderForm must be used within NewOrderFormProvider")
  }

  return { ...context, ...form }
}

export default NewOrderFormProvider
