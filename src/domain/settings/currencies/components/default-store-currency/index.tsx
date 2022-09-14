import { Store } from "@medusajs/medusa"
import React from "react"
import { Option } from "../../../../../types/shared"
import DefaultCurrencySelector from "./default-currency-selector"

type DefaultStoreCurrencyFormType = {
  default_currency_code: Option & { prefix: string }
}

type Props = {
  store: Store
}

const DefaultStoreCurrency = ({ store }: Props) => {
  return (
    <div className="flex flex-col gap-y-large">
      <div>
        <h3 className="inter-large-semibold mb-2xsmall">
          Default store currency
        </h3>
        <p className="inter-base-regular text-grey-50">
          This is the currency your prices are shown in.
        </p>
      </div>

      <DefaultCurrencySelector store={store} />
    </div>
  )
}

export default DefaultStoreCurrency
