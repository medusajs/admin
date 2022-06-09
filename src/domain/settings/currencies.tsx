import { navigate } from "gatsby"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import BreadCrumb from "../../components/molecules/breadcrumb"
import Select from "../../components/molecules/select"
import BodyCard from "../../components/organisms/body-card"
import TwoSplitPane from "../../components/templates/two-split-pane"
import useNotification from "../../hooks/use-notification"
import { Option } from "../../types/shared"
import { currencies } from "../../utils/currencies"
import { getErrorMessage } from "../../utils/error-messages"

type CurrencySettingsFormData = {
  default_currency_code: Option
  currencies: Option[]
}

const CurrencySettings = () => {
  const { control, handleSubmit, reset } = useForm<CurrencySettingsFormData>()

  const notification = useNotification()
  const { store } = useAdminStore()
  const updateStore = useAdminUpdateStore()

  useEffect(() => {
    reset({
      currencies: store?.currencies.map((c) => ({
        label: c.code.toUpperCase(),
        value: c.code,
      })),
      default_currency_code: {
        label: store?.default_currency_code.toUpperCase(),
        value: store?.default_currency_code,
      },
    })
  }, [store])

  const defaultCurrencyOptions = useMemo(() => {
    return (
      store?.currencies?.map((c) => ({
        label: c.code.toUpperCase(),
        value: c.code,
      })) || []
    )
  }, [store])

  const allCurencyOptions = useMemo(() => {
    return Object.values(currencies).reduce((acc, current) => {
      acc.push({ label: current.code.toUpperCase(), value: current.code })
      return acc
    }, [] as Option[])
  }, [currencies])

  const onSubmit = (data: CurrencySettingsFormData) => {
    updateStore.mutate(
      {
        default_currency_code: data.default_currency_code.value,
        currencies: data.currencies.map((c) => c.value),
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully updated currencies", "success")
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const currencyEvents = [
    {
      label: "Save",
      onClick: handleSubmit(onSubmit),
    },
    {
      label: "Cancel changes",
      onClick: () => navigate("/a/settings"),
    },
  ]

  return (
    <form>
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
          <Controller
            name="default_currency_code"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  label="Default store currency"
                  options={defaultCurrencyOptions} // You are only allowed to choose default currency from store currencies
                  value={value}
                  enableSearch
                  onChange={onChange}
                  className="mb-6"
                />
              )
            }}
          />
          <Controller
            name="currencies"
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  label="Store currencies"
                  options={allCurencyOptions}
                  value={value}
                  isMultiSelect
                  enableSearch
                  onChange={onChange}
                  className="mb-2"
                />
              )
            }}
          />
        </BodyCard>
      </TwoSplitPane>
    </form>
  )
}

export default CurrencySettings
