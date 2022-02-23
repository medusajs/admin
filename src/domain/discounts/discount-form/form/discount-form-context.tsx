import React, { useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import useDetectChange from "../../../../hooks/use-detect-change"
import { Option } from "../../../../types/shared"

const defaultDiscount = {
  code: "",
  rule: {
    type: "percentage",
    value: "",
    description: "",
    allocation: "total",
  },
  is_dynamic: false,
  regions: null,
  starts_at: new Date(),
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
  const isDynamic = methods.watch("is_dynamic") as boolean
  const regions = methods.watch("regions") as Option[] | null
  const products = methods.watch("rule.valid_for") as Option[] | undefined

  useEffect(() => {
    if (products?.length && appliesToAll) {
      setAppliesToAll(false)
    }
  }, [products, appliesToAll])

  useEffect(() => {
    if (isEdit) {
      setRegionsDisabled(true)
    } else {
      setRegionsDisabled(false)
    }

    if (type === "free_shipping") {
      setIsFreeShipping(true)
    } else {
      setIsFreeShipping(false)
    }
  }, [type, isEdit])

  useEffect(() => {
    if (isFreeShipping) {
      methods.setValue("rule.type", "free_shipping")
      methods.setValue("rule.allocation", undefined)
    }
  }, [isFreeShipping])

  const handleReset = () => {
    methods.reset({
      ...discount,
      starts_at: new Date(),
    })
  }

  const print = async (values) => {
    console.log(values)
    console.log(methods.formState.isSubmitSuccessful)
  }

  const isDirty = !!Object.keys(methods.formState.dirtyFields).length // isDirty from useForm is behaving more like touched and is therfore not working as expected

  const onError = (errors, e) => {
    console.log(errors, e)
    // errors.regions.ref.focus()
    console.log(document.getElementById("regionsSelector"))
    document.getElementById("regionsSelector")?.focus()
  }

  useDetectChange({
    isDirty: isDirty,
    reset: handleReset,
    options: {
      fn: methods.handleSubmit(print, onError),
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
          setAppliesToAll,
          isFreeShipping,
          setIsFreeShipping,
          isDynamic,
        }}
      >
        {children}
      </DiscountFormContext.Provider>
    </FormProvider>
  )
}

const DiscountFormContext = React.createContext<{
  type?: string
  isDynamic: boolean
  regionsDisabled: boolean
  appliesToAll: boolean
  setAppliesToAll: (value: boolean) => void
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
