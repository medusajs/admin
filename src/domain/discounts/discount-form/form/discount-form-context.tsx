import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
import { Option } from "../../../../types/shared"
import {
  ConditionMap,
  DiscountConditionOperator,
  DiscountConditionType,
} from "../../types"
import { DiscountFormValues } from "./mappers"

const defaultDiscount: DiscountFormValues = {
  code: "",
  rule: {
    type: "percentage",
    value: 0,
    description: "",
  },
  usage_limit: undefined,
  is_dynamic: false,
  regions: [],
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
  items: { id: string; label: string }[] | null
  operator: DiscountConditionOperator
  shouldDelete?: boolean
}

const defaultConditions: ConditionMap = {
  products: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.PRODUCTS,
    items: [],
  },
  product_collections: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.PRODUCT_COLLECTIONS,
    items: [],
  },
  product_tags: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.PRODUCT_TAGS,
    items: [],
  },
  product_types: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.PRODUCT_TYPES,
    items: [],
  },
  customer_groups: {
    id: undefined,
    operator: DiscountConditionOperator.IN,
    type: DiscountConditionType.CUSTOMER_GROUPS,
    items: [],
  },
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
  const [prevUsageLimit, setPrevUsageLimit] = useState<number | undefined>(
    undefined
  )
  const [prevValidDuration, setPrevValidDuration] = useState<string>("")
  const [startsAt, setStartsAt] = useState(discount.starts_at)

  const [conditions, setConditions] = useState<ConditionMap>(defaultConditions)

  const updateCondition = ({ type, items, operator }: UpdateConditionProps) => {
    setConditions((prevConditions) => ({
      ...prevConditions,
      [type]: {
        ...prevConditions[type],
        items,
        operator,
      },
    }))
  }

  const methods = useForm<DiscountFormValues>({
    defaultValues: discount,
    reValidateMode: "onBlur",
  })

  const setConditionType = (value: string | undefined) =>
    methods.setValue("condition_type", value)

  const type = methods.watch("rule.type") as string | undefined
  const conditionType = methods.watch("condition_type")
  const isDynamic = methods.watch("is_dynamic") as boolean
  const regions = methods.watch("regions") as Option[] | null
  const usageLimit = methods.watch("usage_limit")
  const validDuration = methods.watch("valid_duration") as string

  const endsAt = methods.watch("ends_at")

  useEffect(() => {
    if (hasExpiryDate && !endsAt) {
      methods.setValue(
        "ends_at",
        new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      )
    }

    if (!hasExpiryDate && endsAt) {
      methods.setValue("ends_at", null)
    }
  }, [endsAt, hasExpiryDate])

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
    methods.setValue("rule.type", "free_shipping")
  }

  const handleUnselectFreeShipping = () => {
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
    if (values.indexOf("usage_limit") === -1 && usageLimit) {
      setPrevUsageLimit(usageLimit)
      // debounce the setValue call to not flash an empty field when collapsing the accordion
      setTimeout(() => {
        methods.setValue("usage_limit", "")
      }, 300)
    } else if (values.indexOf("usage_limit") > -1 && usageLimit) {
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
    methods.reset({
      ...discount,
      valid_for: null,
    })
  }

  useEffect(() => {
    handleReset()
  }, [discount])

  return (
    <FormProvider {...methods}>
      <DiscountFormContext.Provider
        value={{
          type,
          conditionType,
          setConditionType,
          regions,
          regionsDisabled,
          isFreeShipping,
          setIsFreeShipping,
          isDynamic,
          hasExpiryDate,
          setHasExpiryDate,
          hasStartDate,
          startsAt,
          setHasStartDate,
          setStartsAt,
          handleConfigurationChanged,
          conditions,
          updateCondition,
          setConditions,
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
  regionsDisabled: boolean
  regions: any[] | null
  isFreeShipping: boolean
  setIsFreeShipping: (value: boolean) => void
  hasExpiryDate: boolean
  setHasExpiryDate: (value: boolean) => void
  startsAt: Date | undefined
  hasStartDate: boolean
  setStartsAt: (value: Date) => void
  setHasStartDate: (value: boolean) => void
  handleConfigurationChanged: (values: string[]) => void
  conditions: ConditionMap
  updateCondition: ({ type, items: update }: UpdateConditionProps) => void
  setConditions: Dispatch<SetStateAction<ConditionMap>>
} | null>(null)

export const useDiscountForm = () => {
  const context = React.useContext(DiscountFormContext)
  const form = useFormContext<DiscountFormValues>()
  if (!context) {
    throw new Error("useDiscountForm must be a child of DiscountFormContext")
  }
  return { ...form, ...context }
}
