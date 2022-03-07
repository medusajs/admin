import React, { useState } from "react"
import { RouteComponentProps, Router } from "@reach/router"

import BodyCard from "../../../components/organisms/body-card"
import CustomerGroupTable from "../../../components/templates/customer-group-table"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import AddCustomerGroupModal from "./add-customer-group-modal"
import CustomersPageTableHeader from "../header"

const Index: React.FC<RouteComponentProps> = () => {
  const [showModal, setShowModal] = useState(false)

  const actions = [
    {
      label: "New group",
      onClick: () => setShowModal(true),
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BodyCard
          actionables={actions}
          customHeader={<CustomersPageTableHeader activeView="groups" />}
        >
          <CustomerGroupTable />
        </BodyCard>
      </div>
      {showModal && (
        <AddCustomerGroupModal handleClose={() => setShowModal(false)} />
      )}
    </div>
  )
}

const CustomerGroups: React.FC<RouteComponentProps> = () => {
  return (
    <Router basepath="/a/customers/groups">
      <Index path="/" />
      {/*<Details path=":id" />*/}
    </Router>
  )
}

export default CustomerGroups
