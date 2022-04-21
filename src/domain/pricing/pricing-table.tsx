import { useAdminPriceLists } from "medusa-react"
import React from "react"
import useSetSearchParams from "../../hooks/use-set-search-params"
import LoadingContainer from "../../components/loading-container"
import { usePriceListTableColumns } from "../../components/templates/price-list-table/use-price-list-columns"
import { usePriceListFilters } from "../../components/templates/price-list-table/use-price-list-filters"
import { useLocation } from "@reach/router"
import { PriceListTable } from "../../components/templates/price-list-table/price-list-table"
import PriceListsFilter from "../../components/templates/price-list-table/price-list-filters"

/**
 * Default filtering config for querying price lists endpoint.
 */
const DEFAULT_PAGE_SIZE = 15
const defaultQueryProps = {
  expand: "customer_groups,prices",
  offset: 0,
  limit: DEFAULT_PAGE_SIZE,
}

const PricingTable = () => {
  const location = useLocation()
  const params = usePriceListFilters(location.search, defaultQueryProps)
  const [columns] = usePriceListTableColumns()

  const { price_lists, isLoading, count = 0 } = useAdminPriceLists(
    params.queryObject,
    {
      keepPreviousData: true,
    }
  )

  useSetSearchParams(params.representationObject)

  const resetFilters = () => {
    params.setQuery("")
    params.reset()
  }

  return (
    <div className="w-full overflow-y-auto flex flex-col justify-between min-h-[300px] h-full ">
      <LoadingContainer isLoading={isLoading}>
        <PriceListTable
          columns={columns}
          count={count}
          priceLists={price_lists || []}
          options={{
            enableSearch: true,
            filter: (
              <PriceListsFilter
                filters={params.filters}
                submitFilters={params.setFilters}
                clearFilters={resetFilters}
                tabs={params.availableTabs}
                onTabClick={params.setTab}
                activeTab={params.activeFilterTab}
                onRemoveTab={params.removeTab}
                onSaveTab={params.saveTab}
              />
            ),
          }}
          {...params}
        />
      </LoadingContainer>
    </div>
  )
}

export default PricingTable
