import React, { useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import FileTextIcon from "../../../../components/fundamentals/icons/file-text-icon"
import PublishIcon from "../../../../components/fundamentals/icons/publish-icon"
import {
  MultiSubmitFunction,
  SaveNotificationProvider,
  SubmitFunction,
} from "../../../../components/organisms/save-notifications/notification-provider"
import { Option } from "../../../../types/shared"
import { DiscountFormValues } from "./mappers"
import { useFormActions } from "./use-form-actions"

const defaultDiscount: DiscountFormValues = {
  code: "",
  type: "percentage",
  value: undefined,
  description: "",
  allocation: "total",
  valid_for: null,
  is_dynamic: false,
  regions: null,
  starts_at: new Date(),
  ends_at: null,
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
  const [startsAt, setStartsAt] = useState(discount.starts_at)
  const [endsAt, setEndsAt] = useState(discount.ends_at)

  const methods = useForm({ defaultValues: discount })

  const type = methods.watch("type") as string | undefined
  const isDynamic = methods.watch("is_dynamic") as boolean
  const regions = methods.watch("regions") as Option[] | null
  const products = methods.watch("valid_for") as Option[] | undefined
  const allocation = methods.watch("allocation") as string | undefined

  useEffect(() => {
    if (hasExpiryDate && !endsAt) {
      const value = prevExpiryDate
        ? prevExpiryDate
        : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      setEndsAt(value)
    }

    if (!hasExpiryDate && endsAt) {
      setEndsAt(null)
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
    methods.setValue("type", "free_shipping")
    methods.setValue("allocation", undefined)
  }

  const handleUnselectFreeShipping = () => {
    methods.setValue("allocation", prevAllocation ? prevAllocation : "total") // reset to previous value
    methods.setValue("type", prevType ? prevType : "percentage") // reset to previous value

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
    setStartsAt(discount.starts_at)
    setEndsAt(discount.ends_at)
    methods.reset({
      ...discount,
      valid_for: null,
    })
  }

  useEffect(() => {
    handleReset()
  }, [discount])

  const { onSaveAsActive, onSaveAsInactive, onUpdate } = useFormActions(
    discount.id!,
    {
      ...discount,
      starts_at: startsAt,
      ends_at: endsAt,
    }
  )

  let notificationAction:
    | SubmitFunction<DiscountFormValues>
    | MultiSubmitFunction<DiscountFormValues>

  if (isEdit) {
    notificationAction = onUpdate
  } else {
    notificationAction = [
      {
        icon: <PublishIcon />,
        label: "Save as active",
        onSubmit: onSaveAsActive,
      },
      {
        label: "Save as inactive",
        icon: <FileTextIcon />,
        onSubmit: onSaveAsInactive,
      },
    ]
  }

  const [datesChanged, setDatesChanged] = useState({
    startsAt: false,
    endsAt: false,
  })

  useEffect(() => {
    if (startsAt.getTime() !== discount.starts_at.getTime()) {
      setDatesChanged({
        ...datesChanged,
        startsAt: true,
      })
    } else {
      setDatesChanged({
        ...datesChanged,
        startsAt: false,
      })
    }
  }, [startsAt])

  useEffect(() => {
    if (endsAt?.getTime() !== discount.ends_at?.getTime()) {
      setDatesChanged({
        ...datesChanged,
        endsAt: true,
      })
    } else {
      setDatesChanged({
        ...datesChanged,
        endsAt: false,
      })
    }
  }, [endsAt])

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
          startsAt,
          setStartsAt,
          endsAt,
          setEndsAt,
        }}
      >
        <SaveNotificationProvider
          options={{
            onReset: handleReset,
            onSubmit: notificationAction,
            additionalDirtyStates: {
              startsAt: datesChanged.startsAt,
              endsAt: datesChanged.endsAt,
            },
          }}
        >
          {children}
        </SaveNotificationProvider>
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
  startsAt: Date
  setStartsAt: (value: Date) => void
  endsAt: Date | null
  setEndsAt: (value: Date | null) => void
} | null>(null)

export const useDiscountForm = () => {
  const context = React.useContext(DiscountFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useDiscountForm must be a child of DiscountFormContext")
  }
  return { ...form, ...context }
}
