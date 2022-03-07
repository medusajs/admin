import React, { useState } from "react"
import { RouteComponentProps, Router } from "@reach/router"

import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import CustomerTable from "../../components/templates/customer-table"
import CustomerGroupTable from "../../components/templates/customer-group-table"
import Details from "./details"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import AddCustomerGroupModal from "./groups/add-customer-group-modal"
import { useAdminCreateCustomerGroup } from "medusa-react"
import { getErrorMessage } from "../../utils/error-messages"
import useNotification from "../../hooks/use-notification"

enum CustomerTabs {
  people = "People",
  groups = "Groups",
}

const CustomerIndex: React.FC<RouteComponentProps> = () => {
  const [showModal, setShowModal] = useState(false)
  const [activeView, setActiveView] = React.useState(CustomerTabs.people)

  const notification = useNotification()

  const { mutate } = useAdminCreateCustomerGroup()

  const isGroupsView = activeView === CustomerTabs.groups

  const newGroupAction = {
    label: "New group",
    onClick: () => setShowModal(true),
    icon: (
      <span className="text-grey-90">
        <PlusIcon size={20} />
      </span>
    ),
  }

  const handleSubmit = ({ data }) => {
    mutate(data, {
      onSuccess: () => {
        notification(
          "Success",
          "Successfully created the customer group",
          "success"
        )
        setShowModal(false)
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  const actionables = isGroupsView ? [newGroupAction] : undefined

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actionables}
          customHeader={
            <TableViewHeader
              activeView={activeView}
              setActiveView={setActiveView}
              views={[CustomerTabs.people, CustomerTabs.groups]}
            />
          }
        >
          {isGroupsView ? <CustomerGroupTable /> : <CustomerTable />}
        </BodyCard>
      </div>
      {showModal && (
        <AddCustomerGroupModal
          handleSave={handleSubmit}
          handleClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Customers
