import { navigate } from "gatsby"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import React, { useEffect, useState } from "react"
import BreadCrumb from "../../components/molecules/breadcrumb"
import Select from "../../components/molecules/select"
import BodyCard from "../../components/organisms/body-card"
import TwoSplitPane from "../../components/templates/two-split-pane"
import useToaster from "../../hooks/use-toaster"
import { currencies } from "../../utils/currencies"
import { getErrorMessage } from "../../utils/error-messages"

type SelectCurrency = {
  value: string
  label: string
}

const CurrencySettings = () => {
  const [storeCurrencies, setStoreCurrencies] = useState<SelectCurrency[]>([])
  const [allCurrencies, setAllCurrencies] = useState<SelectCurrency[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<SelectCurrency>({
    value: "",
    label: "",
  })

  const toaster = useToaster()
  const { isLoading, store } = useAdminStore()
  const updateStore = useAdminUpdateStore()

  const setCurrenciesOnLoad = () => {
    const defaultCurr = {
      label: store!.default_currency_code.toUpperCase(),
      value: store!.default_currency_code.toUpperCase(),
    }

    const storeCurrs =
      store?.currencies.map((c) => ({
        value: c.code.toUpperCase(),
        label: c.code.toUpperCase(),
      })) || []

    const allCurrs = Object.keys(currencies).map((currency) => ({
      label: currency,
      value: currency,
    }))

    setSelectedCurrency(defaultCurr)
    setStoreCurrencies(storeCurrs)
    setAllCurrencies(allCurrs)
  }

  useEffect(() => {
    if (isLoading || !store) {
      return
    }

    setCurrenciesOnLoad()
  }, [store, isLoading])

  const handleChange = (currencies) => {
    setStoreCurrencies(currencies)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    updateStore.mutate(
      {
        default_currency_code: selectedCurrency.value,
        currencies: storeCurrencies.map((c) => c.value),
      },
      {
        onSuccess: () => {
          toaster("Successfully updated currencies", "success")
        },
        onError: (error) => {
          toaster(getErrorMessage(error), "error")
        },
      }
    )
  }

  const currencyEvents = [
    {
      label: "Save",
      onClick: (e) => onSubmit(e),
    },
    {
      label: "Cancel changes",
      onClick: () => navigate("/a/settings"),
    },
  ]

  return (
    <div>
      <BreadCrumb
        previousRoute="/a/settings"
        previousBreadcrumb="Settings"
        currentPage="Currencies"
      />
      <TwoSplitPane>
        <BodyCard
          title="Currencies"
          subtitle="Manage the currencies that you will operate in"
          events={currencyEvents}
          className={"h-auto max-h-full"}
        >
          <Select
            label="Default store currency"
            options={storeCurrencies} // You are only allow to choose default currency from store currencies
            value={selectedCurrency}
            isMultiSelect={false}
            enableSearch={true}
            onChange={(e: SelectCurrency) => setSelectedCurrency(e)}
            className="mb-6"
          />
          <Select
            label="Store currencies"
            options={allCurrencies}
            value={storeCurrencies}
            isMultiSelect={true}
            enableSearch={true}
            onChange={handleChange}
            className="mb-2"
          />
        </BodyCard>
      </TwoSplitPane>
    </div>
  )
}

export default CurrencySettings
