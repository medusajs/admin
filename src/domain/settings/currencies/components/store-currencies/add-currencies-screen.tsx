import { AdminGetCurrenciesParams } from "@medusajs/medusa"
import { useAdminCurrencies } from "medusa-react"
import React from "react"
import CurrenciesTable from "./table"

const AddCurrenciesScreen = () => {
  const [params, setParams] = React.useState<
    AdminGetCurrenciesParams | undefined
  >({ limit: 15, offset: 0 })

  const { currencies, count, status } = useAdminCurrencies(params, {
    keepPreviousData: true,
  })

  if (status === "error") {
    return <div>Failed to load</div>
  }

  if (status === "loading" && !currencies) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>
        <CurrenciesTable
          source={currencies || []}
          count={count || 0}
          params={params}
          setParams={setParams}
        />
      </div>
    </div>
  )
}

export default AddCurrenciesScreen
