import React, { useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import useDetectChange from "../../../../hooks/use-detect-change"

const defaultDiscount = {
  code: "",
  rule: {
    type: "percentage",
    value: "",
    description: "",
  },
  is_dynamic: false,
  regions: [],
}

export const DiscountFormProvider = ({
  discount = defaultDiscount,
  isEdit = false,
  children,
}) => {
  const [regionsDisabled, setRegionsDisabled] = useState(false)
  const [appliesToAll, setAppliesToAll] = useState(true)
  const [isFreeShipping, setIsFreeShipping] = useState(false)

  const methods = useForm({ defaultValues: discount })

  const type = methods.watch("rule.type") as string | undefined
  const regions = methods.watch("regions") as any[] | undefined
  const products = methods.watch("rule.valid_for") as
    | { label: string; value: string }[]
    | undefined

  useEffect(() => {
    if (products?.length && appliesToAll) {
      setAppliesToAll(false)
    }
  }, [products, appliesToAll])

  useEffect(() => {
    if (type === "fixed") {
      setRegionsDisabled(true)
    } else {
      setRegionsDisabled(false)
    }

    if (type === "free_shipping") {
      setIsFreeShipping(true)
    } else {
      setIsFreeShipping(false)
    }
  }, [type])

  useEffect(() => {
    if (isFreeShipping) {
      methods.setValue("rule.type", "free_shipping")
    }
  }, [isFreeShipping])

  const handleReset = () => {
    methods.reset({
      ...discount,
    })
  }

  const isDirty = !!Object.keys(methods.formState.dirtyFields).length // isDirty from useForm is behaving more like touched and is therfore not working as expected

  useDetectChange({
    isDirty: isDirty,
    reset: handleReset,
    options: {
      fn: [],
      title: "You have unsaved changes",
      message: "Do you want to save your changes?",
    },
  })

  return (
    <FormProvider {...methods}>
      <DiscountFormContext.Provider
        value={{
          type,
          regions,
          regionsDisabled,
          appliesToAll,
          isFreeShipping,
          setIsFreeShipping,
        }}
      >
        {children}
      </DiscountFormContext.Provider>
    </FormProvider>
  )
}

const DiscountFormContext = React.createContext<{
  type?: string
  regionsDisabled: boolean
  appliesToAll: boolean
  regions?: any[]
  isFreeShipping: boolean
  setIsFreeShipping: (value: boolean) => void
} | null>(null)

export const useDiscountForm = () => {
  const context = React.useContext(DiscountFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useDiscountForm must be a child of DiscountFormContext")
  }
  return { ...form, ...context }
}
