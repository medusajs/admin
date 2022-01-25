import { RouteComponentProps } from "@reach/router"
import { useAdminCustomer } from "medusa-react"
import moment from "moment"
import React, { useState } from "react"
import { Box, Flex } from "rebass"
import Avatar from "../../../components/atoms/avatar"
import Spinner from "../../../components/atoms/spinner"
import StatusDot from "../../../components/fundamentals/status-dot"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import CustomerOrdersTable from "../../../components/templates/customer-orders-table"
import useMedusa from "../../../hooks/use-medusa"

type CustomerDetailProps = {
  id: string
} & RouteComponentProps

const CustomerDetail: React.FC<CustomerDetailProps> = ({ id }) => {
  const { customer, isLoading } = useAdminCustomer(id, {})

  const { toaster, update } = useMedusa("customers", {
    id,
  })

  const [hasFetchedOrders, setHasFetchedOrders] = useState(false)
  const [editCustomer, setEditCustomer] = useState(false)

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  let name =
    (customer.first_name ? customer.first_name : "") +
    (customer.last_name ? ` ${customer.last_name}` : "")
  if (!name) {
    name = "N / A"
  }

  const phone = customer.phone
    ? customer.phone
    : customer.shipping_addresses && customer?.shipping_addresses[0]
    ? customer?.shipping_addresses[0].phone
    : "N / A"

  const customerDropdown = [
    {
      label: "Edit customer",
      onClick: () => {
        setEditCustomer(true)
      },
    },
  ]

  const registered = customer.has_account ? "registered" : "not_registered"

  const customerName = () => {
    if (customer?.first_name && customer?.last_name) {
      return `${customer.first_name} ${customer.last_name}`
    } else {
      return customer?.email
    }
  }

  return (
    <div>
      <Breadcrumb
        currentPage={"Customer Details"}
        previousBreadcrumb={"Customers"}
        previousRoute="/a/customers"
      />
      <BodyCard className={"h-auto w-full pt-[100px] mb-4"}>
        <div className="h-[120px] w-full absolute top-0 right-0 left-0 bg-gradient-to-b from-fuschia-20 z-0" />
        <div className="flex flex-col grow overflow-y-scroll">
          <div className="w-[64px] h-[64px] mb-4">
            <Avatar
              user={customer}
              font="inter-2xlarge-semibold"
              color="bg-fuschia-40"
            />
          </div>
          <div className="flex items-center justify-between">
            <h1 className="inter-xlarge-semibold text-grey-90">
              {customerName()}
            </h1>
            {/* <Actionables actions={actionables} /> */}
          </div>
          <h3 className="inter-small-regular pt-1.5 text-grey-50">
            {customer?.email}
          </h3>
        </div>
        <div className="flex mt-6 space-x-6 divide-x">
          <div className="flex flex-col">
            <div className="inter-smaller-regular text-grey-50 mb-1">
              First seen
            </div>
            <div>{moment(customer?.created_at).format("DD MMM YYYY")}</div>
          </div>
          <div className="flex flex-col pl-6">
            <div className="inter-smaller-regular text-grey-50 mb-1">Phone</div>
            <div>{customer?.phone || "N/A"}</div>
          </div>
          <div className="flex flex-col pl-6">
            <div className="inter-smaller-regular text-grey-50 mb-1">
              Orders
            </div>
            <div>{customer?.orders.length}</div>
          </div>
          <div className="flex flex-col pl-6 h-100">
            <div className="inter-smaller-regular text-grey-50 mb-1">User</div>
            <div className="flex justify-center items-center h-50">
              <StatusDot variant="success" />
            </div>
          </div>
        </div>
      </BodyCard>
      <BodyCard
        title={`Orders (${customer?.orders.length})`}
        subtitle="An overview of Customer Orders"
      >
        {isLoading || !customer ? (
          <div className="w-full pt-2xlarge flex items-center justify-center">
            <Spinner size={"large"} variant={"secondary"} />
          </div>
        ) : (
          <div className="flex grow  flex-col pt-2 mt-large">
            <CustomerOrdersTable customerId={customer.id} />
          </div>
        )}
      </BodyCard>
    </div>
  )
}

export default CustomerDetail
