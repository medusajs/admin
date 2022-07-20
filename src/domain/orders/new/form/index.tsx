import { Region, ShippingOption } from "@medusajs/medusa"
import {
  useAdminCreateDraftOrder,
  useAdminRegion,
  useAdminShippingOptions,
} from "medusa-react"
import React, { createContext, ReactNode, useContext, useMemo } from "react"
import {
  FormProvider,
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  useFormContext,
  useWatch,
} from "react-hook-form"
import { AddressPayload } from "../../../../components/templates/address-form"
import { Option } from "../../../../types/shared"

export type NewOrderForm = {
  shipping_address: AddressPayload
  billing_address: AddressPayload
  region: Option | null
  items: {
    quantity: number
    variant_id?: string
    title: string
    unit_price: number
    thumbnail?: string | null
    product_title?: string
  }[]
  shipping_option: Option | null
  custom_shipping_price?: number
}

type NewOrderContextValue = {
  validCountries: Option[]
  region: Region | undefined
  items: UseFieldArrayReturn<NewOrderForm, "items", "id">
  shippingOptions: ShippingOption[]
}

const NewOrderContext = createContext<NewOrderContextValue | null>(null)

const NewOrderFormProvider = ({ children }: { children?: ReactNode }) => {
  const form = useForm<NewOrderForm>({
    defaultValues: {
      items: [],
    },
  })
  const { mutate } = useAdminCreateDraftOrder()

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

  const items = useFieldArray({
    control: form.control,
    name: "items",
  })

  const validShippingOptions = useMemo(() => {
    if (!shipping_options) {
      return []
    }

    const total = items.fields.reduce((acc, next) => {
      return acc + next.quantity * next.unit_price
    }, 0)

    return shipping_options.reduce((acc, next) => {
      if (next.requirements) {
        const minSubtotal = next.requirements.find(
          (req) => req.type === "min_subtotal"
        )

        if (minSubtotal) {
          if (total <= minSubtotal.amount) {
            return acc
          }
        }

        const maxSubtotal = next.requirements.find(
          (req) => req.type === "max_subtotal"
        )

        if (maxSubtotal) {
          if (total >= maxSubtotal.amount) {
            return acc
          }
        }
      }

      acc.push(next)
      return acc
    }, [] as ShippingOption[])
  }, [shipping_options, items])

  const handleSubmit = form.handleSubmit((data) => {
    console.log(data)
  })

  return (
    <NewOrderContext.Provider
      value={{
        validCountries,
        region,
        items,
        shippingOptions: validShippingOptions,
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

  return { context, form }
}

export default NewOrderFormProvider
