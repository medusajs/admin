import React, { useContext } from "react"
import { RouteComponentProps, Router } from "@reach/router"

import BodyCard from "../../../components/organisms/body-card"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import CustomersPageTableHeader from "../header"
import Details from "./details"
import CustomerGroupContext, {
  CustomerGroupContextContainer,
} from "./context/customer-group-context"
import CustomerGroupsTable from "../../../components/templates/customer-group-table/customer-groups-table"

/*
 * Customer groups index page
 */
function Index(_: RouteComponentProps) {
  const { showModal } = useContext(CustomerGroupContext)

  const actions = [
    {
      label: "New group",
      onClick: showModal,
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
          <CustomerGroupsTable />
        </BodyCard>
      </div>
    </div>
  )
}

/*
 * Customer groups routes
 */
function CustomerGroups(_: RouteComponentProps) {
  return (
    <CustomerGroupContextContainer>
      <Router basepath="/a/customers/groups">
        <Index path="/" />
        <Details path=":id" />
      </Router>
    </CustomerGroupContextContainer>
  )
}

export default CustomerGroups
