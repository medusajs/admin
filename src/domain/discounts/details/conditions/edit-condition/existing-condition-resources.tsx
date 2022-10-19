import {
  useAdminDeleteDiscountConditionResourceBatch,
  useAdminProducts,
} from "medusa-react"
import React, { useState } from "react"
import Modal from "../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../new/discount-form/condition-tables/shared/common"
import {
  ProductRow,
  ProductsHeader,
  useProductColumns,
} from "../../../new/discount-form/condition-tables/shared/products"
import { useEditConditionContext } from "./edit-condition-provider"
import ExistingConditionTableActions from "./existing-condition-resources-table-actions"

const ExistingConditions = () => {
  const params = useQueryFilters(defaultQueryProps)

  const {
    condition,
    removeConditionResources,
    isLoading,
  } = useEditConditionContext()

  const { isLoading: isLoadingProducts, count, products } = useAdminProducts(
    { discount_condition_id: condition.id },
    {
      keepPreviousData: true,
    }
  )

  const columns = useProductColumns()
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const onDeselect = () => {
    setSelectedRowIds([])
  }

  const onRemove = () => {
    removeConditionResources(selectedRowIds)
    onDeselect()
  }

  return (
    <Modal.Content>
      <SelectableTable
        options={{
          enableSearch: false,
          tableActions: (
            <ExistingConditionTableActions
              numberOfSelectedRows={selectedRowIds.length}
              onDeselect={onDeselect}
              onRemove={onRemove}
              deleting={isLoading}
            />
          ),
        }}
        resourceName="products"
        totalCount={count!}
        selectedIds={selectedRowIds}
        data={products || []}
        columns={columns}
        isLoading={isLoadingProducts}
        onChange={(ids) => setSelectedRowIds(ids)}
        renderRow={ProductRow}
        renderHeaderGroup={ProductsHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default ExistingConditions
