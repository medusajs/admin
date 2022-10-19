import { useAdminCollections } from "medusa-react"
import React, { useState } from "react"
import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import {
  CollectionRow,
  CollectionsHeader,
  useCollectionColumns,
} from "../../../../../new/discount-form/condition-tables/shared/collection"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import { useEditConditionContext } from "../../edit-condition-provider"
import ExistingConditionTableActions from "../../existing-condition-resources-table-actions"

const ProductCollectionsConditionsTable = () => {
  const params = useQueryFilters(defaultQueryProps)

  const {
    condition,
    removeConditionResources,
    isLoading,
  } = useEditConditionContext()

  const {
    isLoading: isLoadingCollections,
    count,
    collections,
  } = useAdminCollections(
    { discount_condition_id: condition.id, ...params.queryObject },
    {
      keepPreviousData: true,
    }
  )

  const columns = useCollectionColumns()

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
        resourceName="product_collections"
        totalCount={count!}
        selectedIds={selectedRowIds}
        data={collections || []}
        columns={columns}
        isLoading={isLoadingCollections}
        onChange={(ids) => setSelectedRowIds(ids)}
        renderRow={CollectionRow}
        renderHeaderGroup={CollectionsHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default ProductCollectionsConditionsTable
