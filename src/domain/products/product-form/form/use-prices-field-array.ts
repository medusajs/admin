import { useFieldArray, UseFieldArrayProps, useWatch } from "react-hook-form"
import { NestedForm } from "../../../../utils/nested-form"
import { ProductFormValues } from "../utils/types"

type UsePricesFieldArrayOptions = {
  defaultAmount: number
  defaultCurrencyCode: string
}

type PricesPayload = {
  currency_code: string
  amount: number
}[]

type UseFieldArrayFormProps = {
  form: NestedForm<PricesPayload>
}

const usePricesFieldArray = <TKey extends string>(
  currencyCodes: string[],
  {
    control,
    name,
    keyName,
  }: UseFieldArrayProps<ProductFormValues, "prices", TKey>,
  options: UsePricesFieldArrayOptions = {
    defaultAmount: 1000,
    defaultCurrencyCode: "usd",
  }
) => {
  const { defaultAmount, defaultCurrencyCode } = options
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName,
  })
  const watchedFields =
    useWatch({
      control,
      name,
      defaultValue: fields,
    }) || []

  const selectedCurrencies = watchedFields.map(
    (field) => field?.price?.currency_code
  )
  const availableCurrencies = currencyCodes?.filter(
    (currency) => !selectedCurrencies.includes(currency)
  )

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchedFields[index],
    }
  })

  const appendPrice = () => {
    let newCurrency = availableCurrencies[0]
    if (!selectedCurrencies.includes(defaultCurrencyCode)) {
      newCurrency = defaultCurrencyCode
    }
    append({
      price: { currency_code: newCurrency, amount: defaultAmount },
    })
  }

  const deletePrice = (index: number | undefined) => {
    return () => {
      remove(index)
    }
  }

  return {
    fields: controlledFields,
    appendPrice,
    deletePrice,
    availableCurrencies,
    selectedCurrencies,
  } as const
}

export default usePricesFieldArray
