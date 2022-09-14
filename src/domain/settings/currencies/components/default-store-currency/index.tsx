import { Store } from "@medusajs/medusa"
import React from "react"
import Button from "../../../../../components/fundamentals/button"
import ArrowTopRightIcon from "../../../../../components/fundamentals/icons/arrow-top-right-icon"
import CoinsIcon from "../../../../../components/fundamentals/icons/coins-icon"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { Option } from "../../../../../types/shared"
import DefaultStoreCurrencyModal from "./default-store-currency-modal"

type DefaultStoreCurrencyFormType = {
  default_currency_code: Option & { prefix: string }
}

type Props = {
  store: Store
}

const DefaultStoreCurrency = ({ store }: Props) => {
  const { state, close, toggle } = useToggleState()

  return (
    <>
      <div className="flex flex-col gap-y-large">
        <div>
          <h3 className="inter-large-semibold mb-2xsmall">
            Default store currency
          </h3>
          <p className="inter-base-regular text-grey-50">
            This is the currency your prices are shown in.
          </p>
        </div>

        <div className="flex items-center justify-between border border-grey-20 px-base py-xsmall rounded-rounded">
          <div className="flex items-center gap-x-base">
            <div className="flex items-center justify-center bg-grey-10 rounded-rounded w-xlarge h-xlarge">
              <CoinsIcon size={20} className="text-grey-50" />
            </div>
            <div>
              <span className="inter-base-semibold text-grey-90">
                {store.default_currency.code.toUpperCase()}
              </span>
              <p className="text-grey-50">{store.default_currency.name}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="small"
            className="h-xlarge w-xlarge"
            onClick={toggle}
          >
            <ArrowTopRightIcon size={20} className="text-grey-50" />
          </Button>
        </div>
      </div>
      <DefaultStoreCurrencyModal open={state} onClose={close} store={store} />
    </>
  )
}

export default DefaultStoreCurrency
