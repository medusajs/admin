import { useAdminProducts } from "medusa-react"
import React, { useContext, useMemo, useState } from "react"
import { useTable } from "react-table"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import { SelectableTable } from "../../../../../components/templates/selectable-table"
import { useDebounce } from "../../../../../hooks/use-debounce"
import useQueryFilters from "../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../new/discount-form/condition-tables/shared/common"
import {
  ProductRow,
  ProductsHeader,
  useProductColumns,
} from "../../../new/discount-form/condition-tables/shared/products"
import { useEditConditionContext } from "./edit-condition-provider"

const LIMIT = 10

const AddConditionsScreen = () => {
  const params = useQueryFilters(defaultQueryProps)
  const { addConditionResources } = useEditConditionContext()

  // const [query, setQuery] = useState<string | undefined>(undefined)

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const columns = useProductColumns()

  // const deboucedQuery = useDebounce(query, 500)

  const { isLoading, count, products } = useAdminProducts(params.queryObject, {
    keepPreviousData: true,
  })

  const { pop, reset } = useContext(LayeredModalContext)

  const saveAndClose = () => {
    addConditionResources(selectedRowIds)
    reset()
    // onClose()
  }

  const saveAndGoBack = () => {
    addConditionResources(selectedRowIds)
    pop()
  }

  return (
    <>
      <Modal.Content>
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: "Search...",
          }}
          totalCount={count!}
          selectedIds={selectedRowIds}
          data={products || []}
          columns={columns}
          isLoading={isLoading}
          onChange={(ids) => setSelectedRowIds(ids)}
          renderRow={ProductRow}
          renderHeaderGroup={ProductsHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex justify-end w-full space-x-xsmall">
          <Button variant="secondary" size="small" onClick={pop}>
            Cancel
          </Button>
          <Button variant="primary" size="small" onClick={saveAndGoBack}>
            Save and go back
          </Button>
          <Button variant="primary" size="small" onClick={saveAndClose}>
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useAddConditionsModalScreen = () => {
  const { pop } = React.useContext(LayeredModalContext)

  return {
    title: `Add conditions`,
    onBack: pop,
    view: <AddConditionsScreen />,
  }
}

export default AddConditionsScreen
