import React from "react"
import { RouteComponentProps, Router } from "@reach/router"

import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import CustomerTable from "../../components/templates/customer-table"
import CustomerGroupTable from "../../components/templates/customer-group-table"
import Details from "./details"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"

enum CustomerTabs {
  people = "People",
  groups = "Groups",
}

const CustomerIndex: React.FC<RouteComponentProps> = () => {
  const [activeView, setActiveView] = React.useState(CustomerTabs.people)

  const isGroupsView = activeView === CustomerTabs.groups

  const newGroupAction = {
    label: "New group",
    onClick: () => {},
    icon: (
      <span className="text-grey-90">
        <PlusIcon size={20} />
      </span>
    ),
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
