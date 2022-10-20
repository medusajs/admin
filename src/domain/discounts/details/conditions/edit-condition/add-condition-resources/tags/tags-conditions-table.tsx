import { useAdminProductTags } from "medusa-react"
import React, { useState } from "react"
import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  TagColumns,
  TagHeader,
  TagRow,
} from "../../../../../new/discount-form/condition-tables/shared/tags"
import { useEditConditionContext } from "../../edit-condition-provider"
import ExistingConditionTableActions from "../../condition-table-actions"

const ProductTagsConditionsTable = () => {
  const params = useQueryFilters(defaultQueryProps)

  const {
    condition,
    removeConditionResources,
    isLoading,
  } = useEditConditionContext()

  const { isLoading: isLoadingTags, count, product_tags } = useAdminProductTags(
    { discount_condition_id: condition.id, ...params.queryObject },
    {
      keepPreviousData: true,
    }
  )

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
        resourceName="product_tags"
        totalCount={count!}
        selectedIds={selectedRowIds}
        data={product_tags || []}
        columns={TagColumns}
        isLoading={isLoadingTags}
        onChange={(ids) => setSelectedRowIds(ids)}
        renderRow={TagRow}
        renderHeaderGroup={TagHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default ProductTagsConditionsTable
