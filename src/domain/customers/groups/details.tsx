import React, { useContext, useEffect, useState } from "react"
import { difference } from "lodash"
import { navigate } from "gatsby"
import { CustomerGroup } from "@medusajs/medusa"
import {
  useAdminAddCustomersToCustomerGroup,
  useAdminCustomerGroup,
  useAdminCustomerGroupCustomers,
  useAdminCustomerGroups,
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
import CustomerGroupContext, {
  CustomerGroupContextContainer,
} from "./context/customer-group-context"
import useQueryFilters from "../../../hooks/use-query-filters"
import useSetSearchParams from "../../../hooks/use-set-search-params"
import DeletePrompt from "../../../components/organisms/delete-prompt"

type CustomerGroupCustomersListProps = { group: CustomerGroup }

const defaultQueryProps = {
  additionalFilters: { expand: "groups" },
  limit: 15,
  offset: 0,
}

/**
 * Placeholder for the customer groups list.
 */
function CustomersListPlaceholder() {
  return (
    <div className="h-full flex center justify-center items-center min-h-[756px]">
      <span className="text-xs text-gray-400">
        No customers in this group yet
      </span>
    </div>
  )
}

/**
 * Customer groups list container.
 */
function CustomerGroupCustomersList(props: CustomerGroupCustomersListProps) {
  const groupId = props.group.id

  const {
    q,
    reset,
    paginate,
    setQuery,
    queryObject,
    representationObject,
  } = useQueryFilters(defaultQueryProps)

  // useSetSearchParams(representationObject)

  const { customers = [], isLoading, count } = useAdminCustomerGroupCustomers(
    groupId,
    queryObject
  )

  const { mutate: addCustomers } = useAdminAddCustomersToCustomerGroup(groupId)
  const { mutate: removeCustomers } = useAdminRemoveCustomersFromCustomerGroup(
    groupId
  )

  const [activeGroupId, setActiveGroupId] = useState()
  const { customer_groups } = useAdminCustomerGroups({ expand: "customers" })

  const filteringOptions = [
    {
      title: "Groups",
      options: [
        {
          title: "All",
          onClick: () => setActiveGroupId(null),
        },
        ...(customer_groups || []).map((g) => ({
          title: g.name,
          count: g.customers.length,
          onClick: () => setActiveGroupId(g.id),
        })),
      ],
    },
  ]

  const data = activeGroupId
    ? customers?.filter((c) => c.groups.some((g) => g.id === activeGroupId))
    : customers

  const [showCustomersModal, setShowCustomersModal] = useState(false)
  const [selectedCustomerIds, setSelectedCustomerIds] = useState(
    customers.map((c) => c.id)
  )

  const showPlaceholder = !isLoading && !customers.length && !q

  useEffect(() => {
    if (!isLoading) setSelectedCustomerIds(customers.map((c) => c.id))
  }, [isLoading, customers])

  const calculateDiff = () => {
    const initial = customers.map((c) => c.id)
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
          setSelectedCustomerIds={setSelectedCustomerIds}
          handleSubmit={handleSubmit}
          onClose={() => setShowCustomersModal(false)}
        />
      )}

      {showPlaceholder ? (
        <CustomersListPlaceholder />
      ) : (
        <CustomersListTable
          query={q}
          count={count || 0}
          paginate={paginate}
          setQuery={setQuery}
          customers={data}
          filteringOptions={filteringOptions}
          groupId={props.group.id}
          queryObject={queryObject}
          removeCustomers={removeCustomers}
        />
      )}
    </BodyCard>
  )
}

type CustomerGroupDetailsHeaderProps = {
  customerGroup: CustomerGroup
}

/**
 * Customers groups details page header.
 */
function CustomerGroupDetailsHeader(props: CustomerGroupDetailsHeaderProps) {
  const { showModal } = useContext(CustomerGroupContext)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const { mutate: deleteGroup } = useAdminDeleteCustomerGroup(
    props.customerGroup.id
  )

  const actions = [
    {
      label: "Edit",
      onClick: showModal,
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: () => {
        setShowDeleteConfirmation(true)
      },
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  const onDeleteConfirmed = async () => {
    deleteGroup()
    navigate("/a/customers/groups")
  }

  const handleConfirmDialogClose = () => setShowDeleteConfirmation(false)

  return (
    <>
      <BodyCard
        title={props.customerGroup.name}
        actionables={actions}
        className="min-h-0 w-full"
        subtitle={" "}
      />
      {showDeleteConfirmation && (
        <DeletePrompt
          onDelete={onDeleteConfirmed}
          handleClose={handleConfirmDialogClose}
          confirmText="Yes, delete"
          heading="Delete the group"
          successText="Group deleted"
          text="Are you sure you want to delete this customer group?"
        />
      )}
    </>
  )
}

type CustomerGroupDetailsProps = { id: string }

/**
 * Customer groups details page
 */
function CustomerGroupDetails(p: CustomerGroupDetailsProps) {
  const { customer_group } = useAdminCustomerGroup(p.id)

  if (!customer_group) return null

  return (
    <CustomerGroupContextContainer group={customer_group}>
      <div className="-mt-4 pb-4">
        <Breadcrumb
          currentPage={customer_group ? customer_group.name : "Customer Group"}
          previousBreadcrumb="Groups"
          previousRoute="/a/customers/groups"
        />
        <CustomerGroupDetailsHeader customerGroup={customer_group} />
        <CustomerGroupCustomersList group={customer_group} />
      </div>
    </CustomerGroupContextContainer>
  )
}

export default CustomerGroupDetails
