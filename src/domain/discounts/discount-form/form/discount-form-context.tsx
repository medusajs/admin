import React, { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FormProvider, useForm, useFormContext } from "react-hook-form"
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
  children,
}: DiscountFormProviderProps) => {
  const [hasExpiryDate, setHasExpiryDate] = useState(false)
  const [hasStartDate, setHasStartDate] = useState(false)
  const [prevUsageLimit, setPrevUsageLimit] = useState<number | undefined>(
    undefined
  )
  const [prevValidDuration, setPrevValidDuration] = useState<
    string | undefined
  >(undefined)

  const [conditions, setConditions] = useState<ConditionMap>(defaultConditions)

  const updateCondition = ({
    type,
    items,
    operator,
    shouldDelete,
  }: UpdateConditionProps) => {
    setConditions((prevConditions) => ({
      ...prevConditions,
      [type]: {
        ...prevConditions[type],
        items,
        operator,
        shouldDelete,
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
  const isDynamic = methods.watch("is_dynamic")
  const usageLimit = methods.watch("usage_limit")
  const validDuration = methods.watch("valid_duration")

  const endsAt = methods.watch("ends_at")
  const startsAt = methods.watch("starts_at")

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
    if (hasStartDate && !startsAt) {
      methods.setValue("starts_at", new Date(new Date().getTime()))
    }

    if (!hasStartDate && startsAt) {
      methods.setValue("starts_at", null)
    }
  }, [endsAt, hasExpiryDate])

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

  const handleReset = () => {
    setHasExpiryDate(discount.ends_at ? true : false)
    setConditions(defaultConditions)
    methods.reset({
      ...discount,
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
          isDynamic,
          hasExpiryDate,
          setHasExpiryDate,
          hasStartDate,
          setHasStartDate,
          handleConfigurationChanged,
          conditions,
          updateCondition,
          setConditions,
          handleReset,
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
  hasExpiryDate: boolean
  setHasExpiryDate: (value: boolean) => void
  hasStartDate: boolean
  setHasStartDate: (value: boolean) => void
  handleConfigurationChanged: (values: string[]) => void
  conditions: ConditionMap
  updateCondition: ({
    type,
    items,
    operator,
    shouldDelete,
  }: UpdateConditionProps) => void
  setConditions: Dispatch<SetStateAction<ConditionMap>>
  handleReset: () => void
} | null>(null)

export const useDiscountForm = () => {
  const context = React.useContext(DiscountFormContext)
  const form = useFormContext<DiscountFormValues>()
  if (!context) {
    throw new Error("useDiscountForm must be a child of DiscountFormContext")
  }
  return { ...form, ...context }
}
