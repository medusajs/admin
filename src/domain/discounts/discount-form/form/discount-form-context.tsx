import React, { useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import FileTextIcon from "../../../../components/fundamentals/icons/file-text-icon"
import PublishIcon from "../../../../components/fundamentals/icons/publish-icon"
import useDetectChange, {
  NotificationAction,
} from "../../../../hooks/use-detect-change"
import { Option } from "../../../../types/shared"
import { DiscountFormValues } from "./mappers"
import { useFormActions } from "./use-form-actions"

const defaultDiscount: DiscountFormValues = {
  code: "",
  rule: {
    type: "percentage",
    value: undefined,
    description: "",
    allocation: "total",
    valid_for: null,
  },
  is_dynamic: false,
  regions: null,
  starts_at: new Date(),
}

type DiscountFormProviderProps = {
  discount?: DiscountFormValues
  isEdit?: boolean
  children?: React.ReactNode
}

export const DiscountFormProvider = ({
  discount = defaultDiscount,
  isEdit = false,
  children,
}: DiscountFormProviderProps) => {
  const [regionsDisabled, setRegionsDisabled] = useState(false)
  const [appliesToAll, setAppliesToAll] = useState(true)
  const [isFreeShipping, setIsFreeShipping] = useState(false)
  const [hasExpiryDate, setHasExpiryDate] = useState(false)
  const [prevType, setPrevType] = useState<string | undefined>(undefined)
  const [prevAllocation, setPrevAllocation] = useState<string | undefined>(
    undefined
  )
  const [prevExpiryDate, setPrevExpiryDate] = useState<Date | undefined>(
    undefined
  )

  const methods = useForm({ defaultValues: discount })

  const type = methods.watch("rule.type") as string | undefined
  const isDynamic = methods.watch("is_dynamic") as boolean
  const regions = methods.watch("regions") as Option[] | null
  const products = methods.watch("rule.valid_for") as Option[] | undefined
  const endsAt = methods.watch("ends_at") as Date | undefined
  const allocation = methods.watch("rule.allocation") as string | undefined

  useEffect(() => {
    if (hasExpiryDate && !endsAt) {
      const value = prevExpiryDate
        ? prevExpiryDate
        : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      methods.setValue("ends_at", value)
    }

    if (hasExpiryDate && endsAt) {
      methods.setValue("ends_at", undefined)
    }
  }, [hasExpiryDate])

  useEffect(() => {
    if (endsAt) {
      setPrevExpiryDate(endsAt)
    }
  }, [endsAt])

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

  const handleSelectFreeShipping = () => {
    setPrevType(type)
    setPrevAllocation(allocation)
    methods.setValue("rule.type", "free_shipping")
    methods.setValue("rule.allocation", undefined)
  }

  const handleUnselectFreeShipping = () => {
    methods.setValue(
      "rule.allocation",
      prevAllocation ? prevAllocation : "total"
    ) // reset to previous value
    methods.setValue("rule.type", prevType ? prevType : "percentage") // reset to previous value

    if (prevType === "fixed" && regions) {
      let newReg: Option | undefined = undefined
      if (Array.isArray(regions)) {
        newReg = regions[0]
      } else {
        newReg = (regions as unknown) as { label: string; value: string }
      }

      methods.setValue("regions", newReg) // if prev value type was fixed, and user has selected multiple regions while free shipping was selected, reset to first region
    }
  }

  useEffect(() => {
    if (isFreeShipping) {
      handleSelectFreeShipping()
    } else {
      if (type === "free_shipping") {
        handleUnselectFreeShipping()
      }
    }
  }, [isFreeShipping])

  const handleReset = () => {
    setHasExpiryDate(discount.ends_at ? true : false)
    setAppliesToAll(discount.rule?.valid_for?.length ? false : true)
    methods.reset({
      ...discount,
      rule: {
        ...discount.rule,
        valid_for: null,
      },
      starts_at: new Date(),
    })
  }

  const isDirty = !!Object.keys(methods.formState.dirtyFields).length // isDirty from useForm is behaving more like touched and is therefore not working as expected

  const onError = (errors) => {
    if (Object.keys(errors).includes("regions")) {
      document.getElementsByName("regions")?.[0]?.focus()
    }
  }

  const { onSaveAsActive, onSaveAsInactive, onUpdate } = useFormActions(
    discount.id!
  )

  let notificationAction: NotificationAction[] | (() => Promise<void>)

  if (isEdit) {
    notificationAction = async () => {
      await onUpdate({ ...methods.getValues() })
    }
  } else {
    notificationAction = [
      {
        icon: <PublishIcon />,
        label: "Save and activate",
        onClick: async () => {
          await onSaveAsActive({ ...methods.getValues() })
        },
      } as NotificationAction,
      {
        label: "Save as inactive",
        onClick: async () => {
          await onSaveAsInactive({ ...methods.getValues() })
        },
        icon: <FileTextIcon />,
      } as NotificationAction,
    ]
  }

  useDetectChange({
    isDirty: isDirty,
    reset: handleReset,
    options: {
      fn: notificationAction,
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
          hasExpiryDate,
          setHasExpiryDate,
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
  regions: any[] | null
  isFreeShipping: boolean
  setIsFreeShipping: (value: boolean) => void
  hasExpiryDate: boolean
  setHasExpiryDate: (value: boolean) => void
} | null>(null)

export const useDiscountForm = () => {
  const context = React.useContext(DiscountFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useDiscountForm must be a child of DiscountFormContext")
  }
  return { ...form, ...context }
}
