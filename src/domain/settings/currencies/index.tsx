import { RouteComponentProps } from "@reach/router"
import { useAdminStore } from "medusa-react"
import React from "react"
import BackButton from "../../../components/atoms/back-button"
import Tooltip from "../../../components/atoms/tooltip"
import Section from "../../../components/organisms/section"
import CurrencyTaxSetting from "./components/currency-tax-setting"
import DefaultStoreCurrency from "./components/default-store-currency"
import StoreCurrencies from "./components/store-currencies"

const CurrencySettings = (_props: RouteComponentProps) => {
  const { store, status } = useAdminStore()

  if (status === "error") {
    return <div>Failed to load store</div>
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!store) {
    return <div>Store not found</div>
  }

  return (
    <div className="pb-xlarge">
      <BackButton
        label="Back to Settings"
        path="/a/settings"
        className="mb-xsmall"
      />
      <div className="grid grid-cols-3 gap-base">
        <div className="col-span-2 flex flex-col gap-y-xsmall ">
          <Section title="Currencies">
            <p className="text-grey-50 inter-base-regular mt-2xsmall">
              Manage the markets that you will operate within.
            </p>
          </Section>

          <Section>
            <div className="mb-large">
              <StoreCurrencies store={store} />
            </div>
            <div className="cursor-default">
              <div className="inter-small-semibold text-grey-50 flex items-center justify-between mb-base">
                <p>Currency</p>
                <Tooltip
                  side="top"
                  content={
                    "Decide if you want to include or exclude taxes whenever you define a price in this currency"
                  }
                >
                  <p>Tax Incl. Prices</p>
                </Tooltip>
              </div>
              <div className="grid grid-cols-1 gap-base">
                {store.currencies
                  .sort((a, b) => {
                    return a.code > b.code ? 1 : -1
                  })
                  .map((c, index) => {
                    return (
                      <CurrencyTaxSetting
                        currency={c}
                        isDefault={store.default_currency_code === c.code}
                        key={index}
                      />
                    )
                  })}
              </div>
            </div>
          </Section>
        </div>
        <div>
          <Section>
            <DefaultStoreCurrency store={store} />
          </Section>
        </div>
      </div>
    </div>
  )
}

export default CurrencySettings
