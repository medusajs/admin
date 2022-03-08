import React from "react"
import { CustomerGroup } from "@medusajs/medusa"
import { useAdminCustomerGroup } from "medusa-react"

import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"

type CustomerGroupCustomersListProps = { groupId: string }

function CustomerGroupCustomersList(props: CustomerGroupCustomersListProps) {
  const actions = [
    {
      label: "Add customer",
      // onClick: () => setShowModal(true),
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
    ></BodyCard>
  )
}

type CustomerGroupDetailsHeaderProps = {
  customerGroup: CustomerGroup
}

function CustomerGroupDetailsHeader(props: CustomerGroupDetailsHeaderProps) {
  const actions = [
    {
      label: "Edit",
      // onClick: () => setShowEdit(true),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      // onClick: () => console.log("TODO: delete customer"),
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
  const { customer_group } = useAdminCustomerGroup(p.id)

  if (!customer_group) return null

  return (
    <div className="-mt-4 pb-4">
      <Breadcrumb
        currentPage={customer_group ? customer_group.name : "Customer Group"}
        previousBreadcrumb="Groups"
        previousRoute="/a/customers/groups"
      />
      <CustomerGroupDetailsHeader customerGroup={customer_group} />
      <CustomerGroupCustomersList groupId={customer_group.id} />
    </div>
  )
}

export default CustomerGroupDetails
