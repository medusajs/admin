import { useAdminCustomerGroups } from "medusa-react"
import React, { useState } from "react"
import Spinner from "../../../../../../components/atoms/spinner"
import Modal from "../../../../../../components/molecules/modal"
import useQueryFilters from "../../../../../../hooks/use-query-filters"
import {
  AddConditionSelectorProps,
  DiscountConditionOperator,
} from "../../../../types"
import { useDiscountForm } from "../../form/discount-form-context"
import { defaultQueryProps } from "../shared/common"
import ConditionOperator from "../shared/condition-operator"
import {
  CustomerGroupsHeader,
  CustomerGroupsRow,
  useGroupColumns,
} from "../shared/groups"
import { SelectableTable } from "../shared/selectable-table"
import AddConditionFooter from "./add-condition-footer"

const AddCustomerGroupConditionSelector = ({
  onClose,
}: AddConditionSelectorProps) => {
  const params = useQueryFilters(defaultQueryProps)

  const { conditions } = useDiscountForm()

  const [items, setItems] = useState(conditions?.customer_groups?.items || [])
  const [operator, setOperator] = useState<DiscountConditionOperator>(
    conditions.customer_groups.operator
  )

  const { isLoading, count, customer_groups } = useAdminCustomerGroups(
    params.queryObject,
    {
      // avoid UI flickering by keeping previous data
      keepPreviousData: true,
    }
  )

  const changed = (values: string[]) => {
    const selectedCustomerGroups =
      customer_groups?.filter((cg) => values.includes(cg.id)) || []

    setItems(
      selectedCustomerGroups.map((customer_group) => ({
        id: customer_group.id,
        label: customer_group.name,
      }))
    )
  }

  const columns = useGroupColumns()

  return (
    <>
      <Modal.Content>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <ConditionOperator value={operator} onChange={setOperator} />
            <SelectableTable
              options={{
                enableSearch: true,
                immediateSearchFocus: true,
                searchPlaceholder: "Search groups...",
              }}
              resourceName="Customer groups"
              totalCount={count || 0}
              selectedIds={items.map((i) => i.id)}
              data={customer_groups}
              columns={columns}
              isLoading={isLoading}
              onChange={changed}
              renderRow={CustomerGroupsRow}
              renderHeaderGroup={CustomerGroupsHeader}
              {...params}
            />
          </>
        )}
      </Modal.Content>
      <Modal.Footer>
        <AddConditionFooter
          type="customer_groups"
          items={items}
          onClose={onClose}
          operator={operator}
        />
      </Modal.Footer>
    </>
  )
}

export default AddCustomerGroupConditionSelector
