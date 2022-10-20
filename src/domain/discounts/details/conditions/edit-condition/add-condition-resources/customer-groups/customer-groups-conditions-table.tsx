import { useAdminCustomerGroups } from "medusa-react"
import React, { useState } from "react"
import Modal from "../../../../../../../components/molecules/modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  CustomerGroupsHeader,
  CustomerGroupsRow,
  useGroupColumns,
} from "../../../../../new/discount-form/condition-tables/shared/groups"
import { useEditConditionContext } from "../../edit-condition-provider"
import ExistingConditionTableActions from "../../condition-table-actions"

const CustomerGroupsConditionsTable = () => {
  const params = useQueryFilters(defaultQueryProps)

  const {
    condition,
    removeConditionResources,
    isLoading,
  } = useEditConditionContext()

  const {
    isLoading: isLoadingCustomerGroups,
    count,
    customer_groups,
  } = useAdminCustomerGroups(
    { discount_condition_id: condition.id, ...params.queryObject },
    {
      keepPreviousData: true,
    }
  )

  const columns = useGroupColumns()

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
        resourceName="customer_groups"
        totalCount={count!}
        selectedIds={selectedRowIds}
        data={customer_groups || []}
        columns={columns}
        isLoading={isLoadingCustomerGroups}
        onChange={(ids) => setSelectedRowIds(ids)}
        renderRow={CustomerGroupsRow}
        renderHeaderGroup={CustomerGroupsHeader}
        {...params}
      />
    </Modal.Content>
  )
}

export default CustomerGroupsConditionsTable
