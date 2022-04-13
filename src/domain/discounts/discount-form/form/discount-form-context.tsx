import React, { useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Option } from "../../../../types/shared"
import { DiscountConditionRecord } from "../../types"
import { DiscountFormValues } from "./mappers"

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

type UpdateConditionProps = {
  type:
    | "products"
    | "product_collections"
    | "product_types"
    | "product_tags"
    | "customer_groups"
  update: string[] | null
}

const defaultConditions: DiscountConditionRecord = {
  products: null,
  product_collections: null,
  product_tags: null,
  customer_groups: null,
  product_types: null,
}

export const DiscountFormProvider = ({
  discount = defaultDiscount,
  isEdit = false,
  children,
}: DiscountFormProviderProps) => {
  const [regionsDisabled, setRegionsDisabled] = useState(false)
  const [isFreeShipping, setIsFreeShipping] = useState(false)
  const [hasExpiryDate, setHasExpiryDate] = useState(false)
  const [hasStartDate, setHasStartDate] = useState(false)
  const [prevType, setPrevType] = useState<string | undefined>(undefined)
  const [prevUsageLimit, setPrevUsageLimit] = useState<string>("")
  const [prevValidDuration, setPrevValidDuration] = useState<string>("")
  const [prevAllocation, setPrevAllocation] = useState<string | undefined>(
    "total"
  )
  const [prevExpiryDate, setPrevExpiryDate] = useState<Date | undefined>(
    undefined
  )
  const [startsAt, setStartsAt] = useState(discount.starts_at)
  const [endsAt, setEndsAt] = useState(discount.ends_at)

  const [conditions, setConditions] = useState<DiscountConditionRecord>(
    discount.rule?.conditions || defaultConditions
  )

  const updateCondition = ({ type, update }: UpdateConditionProps) => {
    setConditions((prevConditions) => ({
      ...prevConditions,
      [type]: {
        ...prevConditions[type],
        items: update,
      },
    }))
  }

  const methods = useForm({ defaultValues: discount, reValidateMode: "onBlur" })

  methods.register({
    name: "allocation",
    value: discount?.allocation || "total",
  })

  const setAllocation = (value) => {
    methods.setValue("allocation", value)
    setPrevAllocation(value)
  }

  const setConditionType = (value: string | undefined) =>
    methods.setValue("condition_type", value)

  const type = methods.watch("type") as string | undefined
  const conditionType = methods.watch("condition_type")
  const isDynamic = methods.watch("is_dynamic") as boolean
  const allocation = methods.watch("allocation") as string
  const regions = methods.watch("regions") as Option[] | null
  const usageLimit = methods.watch("usage_limit") as string
  const validDuration = methods.watch("valid_duration") as string

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
    if (isEdit && discount.type === "fixed") {
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
    methods.setValue("allocation", "total")
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

  const handleConfigurationChanged = (values) => {
    if (values.indexOf("ends_at") > -1 && !hasExpiryDate) {
      setHasExpiryDate(true)
    } else if (values.indexOf("ends_at") === -1 && hasExpiryDate) {
      setHasExpiryDate(false)
    }

    if (values.indexOf("starts_at") === -1 && hasStartDate) {
      setHasStartDate(false)
    } else if (values.indexOf("starts_at") > -1 && !hasStartDate) {
      setHasStartDate(true)
    }

    // usage_limit
    if (values.indexOf("usage_limit") === -1 && usageLimit !== "") {
      setPrevUsageLimit(usageLimit)
      // debounce the setValue call to not flash an empty field when collapsing the accordion
      setTimeout(() => {
        methods.setValue("usage_limit", "")
      }, 300)
    } else if (values.indexOf("usage_limit") > -1 && usageLimit === "") {
      methods.setValue("usage_limit", prevUsageLimit)
    }

    // valid duration
    if (values.indexOf("valid_duration") === -1 && validDuration !== "") {
      setPrevValidDuration(validDuration)
      // debounce the setValue call to not flash an empty field when collapsing the accordion
      setTimeout(() => {
        methods.setValue("valid_duration", "")
      }, 300)
    } else if (values.indexOf("valid_duration") > -1 && validDuration === "") {
      methods.setValue("valid_duration", prevValidDuration)
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
          conditionType,
          setConditionType,
          regions,
          setAllocation,
          regionsDisabled,
          isFreeShipping,
          setIsFreeShipping,
          isDynamic,
          hasExpiryDate,
          setHasExpiryDate,
          hasStartDate,
          setHasStartDate,
          startsAt,
          setStartsAt,
          endsAt,
          setEndsAt,
          handleConfigurationChanged,
          conditions,
          updateCondition,
        }}
      >
        {children}
      </DiscountFormContext.Provider>
    </FormProvider>
  )
}

const DiscountFormContext = React.createContext<{
  type?: string
  conditionType?: string
  setConditionType: (value: string | undefined) => void
  isDynamic: boolean
  setAllocation: (value: string) => void
  regionsDisabled: boolean
  regions: any[] | null
  isFreeShipping: boolean
  setIsFreeShipping: (value: boolean) => void
  hasExpiryDate: boolean
  setHasExpiryDate: (value: boolean) => void
  endsAt: Date | null
  setEndsAt: (value: Date | null) => void
  startsAt: Date
  hasStartDate: boolean
  setStartsAt: (value: Date) => void
  setHasStartDate: (value: boolean) => void
  handleConfigurationChanged: (values: string[]) => void
  conditions: DiscountConditionRecord
  updateCondition: ({ type, update }: UpdateConditionProps) => void
} | null>(null)

export const useDiscountForm = () => {
  const context = React.useContext(DiscountFormContext)
  const form = useFormContext()
  if (!context) {
    throw new Error("useDiscountForm must be a child of DiscountFormContext")
  }
  return { ...form, ...context }
}
