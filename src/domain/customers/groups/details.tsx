import React, { useState } from "react"
import { difference } from "lodash"
import { navigate } from "gatsby"
import { CustomerGroup } from "@medusajs/medusa"
import {
  useAdminAddCustomersToCustomerGroup,
  useAdminCustomerGroup,
  useAdminDeleteCustomerGroup,
  useAdminRemoveCustomersFromCustomerGroup,
} from "medusa-react"

import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import EditCustomersTable from "../../../components/templates/customer-group-table/edit-customers-table"
import CustomersListTable from "../../../components/templates/customer-group-table/customers-list-table"

type CustomerGroupCustomersListProps = { group: CustomerGroup }

function CustomerGroupCustomersList(props: CustomerGroupCustomersListProps) {
  const { mutate: addCustomers } = useAdminAddCustomersToCustomerGroup(
    props.group.id
  )
  const { mutate: removeCustomers } = useAdminRemoveCustomersFromCustomerGroup(
    props.group.id
  )

  const [showCustomersModal, setShowCustomersModal] = useState(false)
  const [selectedCustomerIds, setSelectedCustomerIds] = useState(
    props.group.customers.map((c) => c.id)
  )

  const toggleCustomer = (customerId: string) => {
    if (selectedCustomerIds.includes(customerId))
      setSelectedCustomerIds(
        selectedCustomerIds.filter((i) => i !== customerId)
      )
    else setSelectedCustomerIds([...selectedCustomerIds, customerId])
  }

  const calculateDiff = () => {
    const initial = props.group.customers.map((c) => c.id)
    return {
      toAdd: difference(selectedCustomerIds, initial),
      toRemove: difference(initial, selectedCustomerIds),
    }
  }

  const handleSubmit = () => {
    const { toAdd, toRemove } = calculateDiff()

    if (toAdd.length)
      addCustomers({ customer_ids: toAdd.map((i) => ({ id: i })) })
    if (toRemove.length)
      removeCustomers({ customer_ids: toRemove.map((i) => ({ id: i })) })

    setShowCustomersModal(false)
  }

  const actions = [
    {
      label: "Edit customers",
      onClick: () => setShowCustomersModal(true),
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]
  return (
    <BodyCard
      title="Customers"
      actionables={actions}
      className="min-h-0 w-full my-4 min-h-[756px]"
    >
      {showCustomersModal && (
        <EditCustomersTable
          selectedCustomerIds={selectedCustomerIds}
          toggleCustomer={toggleCustomer}
          handleSubmit={handleSubmit}
          onClose={() => setShowCustomersModal(false)}
        />
      )}

      <CustomersListTable customers={props.group.customers} />
    </BodyCard>
  )
}

type CustomerGroupDetailsHeaderProps = {
  customerGroup: CustomerGroup
}

function CustomerGroupDetailsHeader(props: CustomerGroupDetailsHeaderProps) {
  const { mutate } = useAdminDeleteCustomerGroup(props.customerGroup.id)

  const actions = [
    {
      label: "Edit",
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: () => {
        mutate()
        navigate("/a/customers/groups")
      }, // TODO: confirmation
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  return (
    <BodyCard
      title={props.customerGroup.name}
      actionables={actions}
      className="min-h-0 w-full"
    >
      <div className="border-l border-gray-200 pl-4">
        <span className="text-xs text-gray-500 block pb-1">Size</span>
        <span className="text-xs text-gray-900 block">Max of 200 people</span>
      </div>
    </BodyCard>
  )
}

type CustomerGroupDetailsProps = { id: string }

function CustomerGroupDetails(p: CustomerGroupDetailsProps) {
  const { customer_group } = useAdminCustomerGroup(p.id, {
    expand: "customers",
  })

  if (!customer_group) return null

  return (
    <div className="-mt-4 pb-4">
      <Breadcrumb
        currentPage={customer_group ? customer_group.name : "Customer Group"}
        previousBreadcrumb="Groups"
        previousRoute="/a/customers/groups"
      />
      <CustomerGroupDetailsHeader customerGroup={customer_group} />
      <CustomerGroupCustomersList group={customer_group} />
    </div>
  )
}

export default CustomerGroupDetails
